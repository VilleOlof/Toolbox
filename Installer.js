const { exec } = require('child_process');
const fs = require('fs');
const AdmZip = require("adm-zip");
const { clearInterval } = require('timers');

// Change this to the URL of the repo zip file when its public
const RepoZipURL = 'https://github.com/VilleOlof/Toolbox/archive/refs/heads/main.zip';

//DEV URL
//const RepoZipURL = 'https://cdn.discordapp.com/attachments/365772775832420353/1095864411882799155/Toolbox-main.zip'

function Install(path) {
    //Update path to new workflow folder
    path = CreateWorkflowFolder(path);

    DownloadRepo(path);
    UnzipRepo(path);

    //Update path to new repo folder
    path = path += '/Toolbox-main'
    //CreateJSONFiles(path);

    //wait for the path to exist
    let attempts = 0;
    let pathInterval = setInterval(() => {
        if (fs.existsSync(path)) {
            clearInterval(pathInterval);
            console.log('Path Exists');

            NPMInstall(path);

        }
        if (attempts > 10) {
            clearInterval(pathInterval);
            console.log('Path Doesnt Exist');
        }
        attempts++;
    }, 500);


}

function CreateWorkflowFolder(path) {
    path = `${path}/Workflow Integration Plugins`
    exec(`mkdir -p "${path}"`, (err, stdout, stderr) => {
        if (err) {
            //console.log(`Error: ${err}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
    return path;
}

function DownloadRepo(Path) {
    exec(`curl.exe -L ${RepoZipURL} -o "${Path}/Toolbox.zip"`, (err, stdout, stderr) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}

function UnzipRepo(Path) {
    //wait for download to finish
    let attempts = 0;
    let downloadInterval = setInterval(() => {
        if (CheckForRepo(`${Path}/Toolbox.zip`)) {
            clearInterval(downloadInterval);
            console.log('Download Complete');

            const zip = new AdmZip(`${Path}/Toolbox.zip`);
            zip.extractAllTo(Path, true);

            CreateJSONFiles(Path + '/Toolbox-main');

            DeleteOldZip(Path);
        }
        if (attempts > 10) {
            clearInterval(downloadInterval);
            console.log('Download Failed');
        }
        attempts++;
    }, 500);
}

function CheckForRepo(path) {
    try {
        if (fs.existsSync(path)) {
            return true;
        }
    }
    catch (err) {
        console.error(err)
    }
    return false;
}

function CreateJSONFiles(path) {
    fs.writeFileSync(`${path}/Data.json`, '{}');
    fs.writeFileSync(`${path}/Settings.json`, '{}');
}

function NPMInstall(path) {
    process.chdir(path);
    exec(`npm install`, (err, stdout, stderr) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        NPMBuild(path)
    });
}

function NPMBuild(path) {
    process.chdir(path);
    exec(`npm run build`, (err, stdout, stderr) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}

function DeleteOldZip(Path) {
    fs.unlinkSync(`${Path}/Toolbox.zip`);
}

const args = process.argv.slice(2);

// Default path to DaVinci Resolve
let DavinciPath = args[0] ?? `${process.env.PROGRAMDATA}\\Blackmagic Design\\DaVinci Resolve\\Support`

Install(DavinciPath);