const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const fs = require('fs');

function getAppDataPath() {
  switch (process.platform) {
    case "darwin": {
      return path.join(process.env.HOME, "Library", "Application Support", "speedruntools");
    }
    case "win32": {
      return path.join(process.env.APPDATA, "speedruntools");
    }
    case "linux": {
      return path.join(process.env.HOME, ".speedruntools");
    }
    default: {
      console.log("Unsupported platform!");
      process.exit(1);
    }
  }
}

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

  try {
      settingsdata = JSON.parse(fs.readFileSync(getAppDataPath() + "/settings.json", "utf8"));
  }
  catch(err) {
      try {
          fs.mkdirSync(getAppDataPath());
      } catch(err2) { console.log("nothing"); }
      fs.writeFileSync(getAppDataPath() + "/settings.json", '{"startKey":"Alt","splitKey":"Shift","topbottom":"top","leftright":"right","hueRotate":"0"}');
      settingsdata = JSON.parse(fs.readFileSync(getAppDataPath() + "/settings.json", "utf8"));
  }
  
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

app.on('window-all-closed', function () { app.quit(); });

app.allowRendererProcessReuse = false;