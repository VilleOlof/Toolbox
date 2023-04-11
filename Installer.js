const { exec } = require('child_process');
const fs = require('fs');
const AdmZip = require("adm-zip");
const { clearInterval } = require('timers');

// Change this to the URL of the repo zip file when its public
const RepoZipURL = 'https://github.com/VilleOlof/Toolbox/archive/refs/heads/main.zip';

function Install(path) {
    //Update path to new workflow folder
    path = CreateWorkflowFolder(path);
    DownloadRepo(path);
    UnzipRepo(path);
    //Update path to new repo folder
    path = path += '/Toolbox'
    NPMInstall(path);
    NPMBuild(path)
}

function CreateWorkflowFolder(path) {
    path = `${path}/fl Integration Plugins`
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

function NPMInstall(path) {
    exec(`npm install`, {
        cwd: path
    }, (err, stdout, stderr) => {
        if (err) {
            console.log(`Error: ${err}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}

function NPMBuild(path) {
    exec(`npm run build`, {
        cwd: path
    }, (err, stdout, stderr) => {
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
let DavinciPath = args[0] ?? `${process.env.PROGRAMDATA}/Blackmagic Design/DaVinci Resolve/Support`

Install(DavinciPath);