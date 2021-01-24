const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

ipcMain.on( "SettingsData", ( event, data ) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  settingsdata = data;
  mainWindow = global.mainWindow;
  
  if (settingsdata.topbottom == "top") {
    mainWindow.y = 0;
  }
  else {
    mainWindow.y = height - 400;
  }
  if (settingsdata.leftright == "right") {
    mainWindow.x = width - 250;
  }
  else {
    mainWindow.x = 0;
  }
  mainWindow.setPosition(mainWindow.x, mainWindow.y);
} );

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

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

app.allowRendererProcessReuse = false;