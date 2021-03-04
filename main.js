const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const shell = require('electron').shell;
const path = require('path');
const fs = require('fs');

ipcMain.on( "reboot", ( event ) => {
  app.relaunch();
  app.exit();
} );

ipcMain.on( "closeappcompletely", ( event ) => {
  app.quit();
} );

function createWindow () {
  global.mainWindow = new BrowserWindow({
    width: 250,
    height: 400,
    x: 0,
    y: 0,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  global.mainWindow.loadFile('window/index.html');
}

function setMainMenu() {
  const template = [
    {
      label: 'Help',
      submenu: [
        {
          label: 'Read the Docs',
          accelerator: 'Shift+CmdOrCtrl+H',
          click() {
            shell.openExternal('https://github.com/yikuansun/desktopspeedruntools#usage');
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
  setMainMenu();
});

app.allowRendererProcessReuse = false;