const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const windowStateKeeper = require('electron-window-state');
require('@electron/remote/main').initialize();

ipcMain.on( 'closeappcompletely', ( event ) => {
  app.quit();
} );

ipcMain.on("hardreboot", function(e) {
  app.relaunch();
  app.quit();
});

ipcMain.on("openSettings", function(e) {
  var win = new BrowserWindow({
    height: 500,
    width: 400,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
    }
  });

  win.loadFile("window/settings.html");
  win.setMenuBarVisibility(false);

  require("@electron/remote/main").enable(win.webContents);
});

ipcMain.on("openSplitEditor", function(e) {
  var win = new BrowserWindow({
    height: 500,
    width: 400,
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
    }
  });

  win.loadFile("window/splitsmanager/editsplits.html");
  win.setMenuBarVisibility(false);

  require("@electron/remote/main").enable(win.webContents);
});

function createWindow () {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 250,
    defaultHeight: 400
  });

  var mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame: false,
    //resizable: false,
    transparent: true,
    alwaysOnTop: true,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
    icon: "window/icon.png",
  });
  require('@electron/remote/main').enable(mainWindow.webContents);
  mainWindowState.manage(mainWindow);
  mainWindow.loadFile('window/index.html');
  ipcMain.on( 'softreboot', ( event ) => {
    mainWindow.loadFile('window/index.html')
  } );
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });
});

app.allowRendererProcessReuse = false;