const fs = require('fs');

if (window.process.platform === "darwin") {
    keycodeNames = JSON.parse(fs.readFileSync(__dirname + "/keycodenames/darwin.json"));
}