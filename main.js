const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const shell = require('electron').shell;

ipcMain.on( 'reboot', ( event ) => {
  app.relaunch();
  app.exit();
} );

ipcMain.on( 'closeappcompletely', ( event ) => {
  app.quit();
} );

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 250,
    height: 400,
    frame: false,
    resizable: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindow.loadFile('window/index.html');
  ipcMain.on( 'softreboot', ( event ) => {
    for (win of BrowserWindow.getAllWindows()) {
      win.close();
    }
    createWindow();
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
  setMainMenu();
});

app.allowRendererProcessReuse = false;