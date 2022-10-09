const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const windowStateKeeper = require('electron-window-state');
require('@electron/remote/main').initialize();

ipcMain.on( 'closeappcompletely', ( event ) => {
  app.quit();
} );

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
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  require('@electron/remote/main').enable(mainWindow.webContents);
  mainWindowState.manage(mainWindow);
  mainWindow.loadFile('window/index.html');
  ipcMain.on( 'softreboot', ( event ) => {
    mainWindow.loadFile('window/index.html')
  } );
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
  //setMainMenu();
});

app.allowRendererProcessReuse = false;