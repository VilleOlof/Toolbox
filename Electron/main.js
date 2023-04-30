// Modules to control application life and create native browser window
const {app, BrowserWindow, nativeImage, ipcMain, globalShortcut} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')

const AppSettings = require('../AppSettings.json')
AppSettings.WindowSize = AppSettings.WindowSize || {width: 900, height: 825};
AppSettings.WindowPosition = AppSettings.WindowPosition || {x: 250, y: 250};
fs.writeFileSync(path.join(__dirname, '../AppSettings.json'), JSON.stringify(AppSettings, null, 4))

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: AppSettings.WindowSize.width,
        height: AppSettings.WindowSize.height,
        useContentSize: true,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            // NOTE: Replace the below variable with a more secure implementation. Reference: https://www.electronjs.org/docs/tutorial/security
            nodeIntegration: true,
            enableRemoteModule: true
        },
        autoHideMenuBar: true,
        frame: false,
    })

    // Set the window position
    mainWindow.setPosition(AppSettings.WindowPosition.x, AppSettings.WindowPosition.y)

    mainWindow.setAlwaysOnTop(AppSettings.AlwaysOnTop ?? false, 'screen-saver');

    mainWindow.setIcon(nativeImage.createFromPath(__dirname + '/../src/assets/Icon.png'))

    // Hide the menu bar (enable below code to hide menu bar)
    //mainWindow.setMenu(null);

    mainWindow.on('close', function(e) {
        app.quit()
    });

    // Load index.html on the window.
    mainWindow.loadFile('../dist/index.html')

    // Open the DevTools (enable below code to show DevTools)
    if(AppSettings.Debug) mainWindow.webContents.openDevTools()
}

ipcMain.handle('keybind:set', (event, keybind) => {
    globalShortcut.register(keybind, () => {
        BrowserWindow.getAllWindows()[0].webContents.send(`keybind:${keybind}`, keybind);
    });
});

ipcMain.handle('keybind:unset', (event, keybind) => {
    globalShortcut.unregister(keybind);
});

ipcMain.handle('keybind:unsetAll', (event) => {
    globalShortcut.unregisterAll();
});

let oldTimeout = null;
ipcMain.handle('lifeCycle:ping', (event) => {
    clearTimeout(oldTimeout);
    
    oldTimeout = setTimeout(() => {
        app.quit();
    }, 3000);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll();

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
