const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow

ipcMain.on('new-item', (e, itemUrl) => {
  setTimeout(() => {
    e.sender.send('new-item-success', 'New Item from main process')
  }, 2000);
})

const createWindow = () => {

  //state keeper
  let state = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 650
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 500,
    height: 650,
    x: state.x,
    y: state.y,
    minWidth: 350,
    maxWidth: 650,
    minHeight: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './renderer/main.html'));

  // Manage Window state
  state.manage(mainWindow);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
