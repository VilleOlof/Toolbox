// Modules to control application life and create native browser window
const {app, BrowserWindow, nativeImage} = require('electron')
const path = require('path')
const os = require('os')

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 900,
        height: 825,
        useContentSize: true,
        webPreferences: {
            preload: path.join(__dirname, './preload.js'),
            // NOTE: Replace the below variable with a more secure implementation. Reference: https://www.electronjs.org/docs/tutorial/security
            nodeIntegration: true,
            enableRemoteModule: true
        },
    })

    // Hide the menu bar (enable below code to hide menu bar)
    //mainWindow.setMenu(null);

    mainWindow.on('close', function(e) {
        app.quit()
    });

    // Load index.html on the window.
    mainWindow.loadFile('../dist/index.html')

    // Open the DevTools (enable below code to show DevTools)
    mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
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
