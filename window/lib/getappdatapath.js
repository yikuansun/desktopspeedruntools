path = require("path");

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