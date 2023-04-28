import { ChildProcess } from "child_process";
import { AppSettings } from "./AppSettings";
import { Common } from "./Common";

const AdmZip = require("adm-zip");

export namespace Updater {

    const RepoZIPUrl: string = 'https://github.com/VilleOlof/Toolbox/archive/refs/heads/main.zip';
    const root: string = `${Common.IO.GetRootFolder()}/../`.replace('\\', '/');

    export type UpdateReturn = {
        updateAvailable: boolean,
        remoteVersion: string,
        localVersion: string
    }

    export async function CheckForUpdate(): Promise<UpdateReturn> {
        const githubVersion: string = (await (await fetch('https://raw.githubusercontent.com/VilleOlof/Toolbox/main/AppSettings.json')).json()).Version;
        const localVersion: string = AppSettings.GetSetting("Version");

        return {
            updateAvailable: CheckVersionNumbers(githubVersion, localVersion),
            remoteVersion: githubVersion,
            localVersion: localVersion
        };
    }

    function CheckVersionNumbers(newVersion: string, oldVersion: string): boolean {
        const newVersionNumbers: string[] = newVersion.split('.');
        const oldVersionNumbers: string[] = oldVersion.split('.');

        for (let i = 0; i < newVersionNumbers.length; i++) {
            if (parseInt(newVersionNumbers[i]) > parseInt(oldVersionNumbers[i])) {
                return true;
            }
        }

        return false;
    }

    export function DownloadUpdate(): void {
        const curlCommand: ChildProcess = Common.ExecuteCommand(`curl.exe -L ${RepoZIPUrl} -o "${root}../Toolbox.zip"`, `${root}../`);
        curlCommand.stdout.on('data', (data) => {
            console.error(`curl stdout: ${data}`);
        });

        curlCommand.on('close', (code) => {
            console.log(`curl child process exited with code ${code}`);
            UnzipUpdate();
        });
    }

    function UnzipUpdate(): void {
        const zipFile: string = `${root}../Toolbox.zip`

        const zip = new AdmZip(zipFile);
        const entryFolder = zip.getEntries()[0];
        zip.extractEntryTo(entryFolder, `${root}../`, true, true);

        Common.IO.DeleteFile(zipFile);

        BuildPlugin();
    }

    function BuildPlugin(): void {
        const buildCommand: ChildProcess = Common.ExecuteCommand(`npm run build`, root);
        buildCommand.stdout.on('data', (data) => {
            console.error(`build stdout: ${data}`);
        });

        buildCommand.on('close', (code) => {
            console.log(`build child process exited with code ${code}`);
            RelaunchPlugin();
        });
    }

    function RelaunchPlugin(): void {
        AppSettings.SetSetting('WindowSize', {
            width: window.innerWidth,
            height: window.innerHeight
        })

        const position = Common.Electron.GetCurrentWindow().getPosition();
        AppSettings.SetSetting('WindowPosition', {
            x: position[0],
            y: position[1]
        });

        const app = Common.Electron.GetApp();

        app.relaunch();
        app.exit();
    }
}