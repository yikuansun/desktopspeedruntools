path = require("path");

function getAppDataPath() {
    switch (process.platform) {
      case "darwin": {
        return path.join(process.env.HOME, "Library", "Application Support", "runtime");
      }
      case "win32": {
        return path.join(process.env.APPDATA, "runtime");
      }
      case "linux": {
        return path.join(process.env.HOME, ".runtime");
      }
      default: {
        console.log("Unsupported platform!");
        process.exit(1);
      }
    }
  }