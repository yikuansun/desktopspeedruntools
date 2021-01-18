const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
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
  mainWindow.loadFile('window/index.html');
  settingsdata = JSON.parse(fs.readFileSync(__dirname + "/window/settings.json", "utf-8"));
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
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.allowRendererProcessReuse = false;