const fs = require('fs');
const { ipcRenderer } = require('electron');
const { app } = require("@electron/remote");
const userDataPath = app.getPath("userData");

alphabetkeys = "abcdefghijklmnopqrstuvwxyz".split("");
numberkeys = "1234567890".split("");
fkeys = "F1 F2 F3 F4 F5 F6 F7 F8 F9 F10".split(" ");

for (key of [].concat.apply([], [alphabetkeys, numberkeys, fkeys])) {
    optionTag = document.createElement("option");
    optionTag.innerHTML = key;
    document.getElementById("alt").appendChild(optionTag);
    optionTag = document.createElement("option");
    optionTag.innerHTML = key;
    document.getElementById("shift").appendChild(optionTag);
}

availFonts = ["Trebuchet MS", "Arial", "Courier", "serif", "system-ui"];
for (font of availFonts) {
    optionTag = document.createElement("option");
    optionTag.innerHTML = font;
    optionTag.style.fontFamily = font;
    document.getElementById("fontselect").appendChild(optionTag);
}
document.getElementById("fontselect").style.fontFamily = document.getElementById("fontselect").value;
document.getElementById("fontselect").addEventListener("input", function() {
    this.style.fontFamily = this.value;
});

currentSettings = JSON.parse(fs.readFileSync(userDataPath + "/settings.json", "utf-8"));
startKey = currentSettings.startKey;
splitKey = currentSettings.splitKey;
hueRotate = currentSettings.hueRotate;
globalFont = currentSettings.globalFont;
countdownTime = currentSettings.countdownTime;
autoStop = Boolean(currentSettings.autoStop);
document.getElementById("alt").value = startKey;
document.getElementById("shift").value = splitKey;
document.getElementById("hueslider").value = hueRotate;
document.getElementById("colordisp").style.filter = "hue-rotate(" + hueRotate.toString() + "deg)";
document.getElementById("fontselect").value = globalFont;
document.getElementById("fontselect").style.fontFamily = globalFont;
document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
document.getElementById("countdown").value = countdownTime;
document.getElementById("autostop").checked = autoStop;

function save_options() {
    startKey = document.getElementById("alt").value;
    splitKey = document.getElementById("shift").value;
    hueRotate = document.getElementById("hueslider").value;
    globalFont = document.getElementById("fontselect").value;
    countdownTime = document.getElementById("countdown").value;
    autoStop = document.getElementById("autostop").checked;
    fs.writeFileSync(userDataPath + "/settings.json", JSON.stringify({
        startKey: startKey,
        splitKey: splitKey,
        hueRotate: hueRotate,
        globalFont: globalFont,
        countdownTime: countdownTime,
        autoStop: autoStop
    }));

    ipcRenderer.send("softreboot");

    return false;
}

document.getElementById("hueslider").oninput = function() {
    document.getElementById("colordisp").style.filter = "hue-rotate(" + this.value.toString() + "deg)";
}

document.querySelector("form").onsubmit = save_options;