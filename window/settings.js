const fs = require('fs');
const { ipcRenderer } = require('electron');

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

availFonts = ["Trebuchet MS", "Arial", "Courier New", "serif"];
for (font of availFonts) {
    optionTag = document.createElement("option");
    optionTag.innerHTML = font;
    optionTag.style.fontFamily = "font";
    document.getElementById("fontselect").appendChild(optionTag);
}
document.getElementById("fontselect").style.fontFamily = document.getElementById("fontselect").value;
document.getElementById("fontselect").addEventListener("input", function() {
    this.style.fontFamily = this.value;
});

currentSettings = JSON.parse(fs.readFileSync(getAppDataPath() + "/settings.json", "utf-8"));
startKey = currentSettings.startKey;
splitKey = currentSettings.splitKey;
topbottom = currentSettings.topbottom;
leftright = currentSettings.leftright;
hueRotate = currentSettings.hueRotate;
globalFont = currentSettings.globalFont;
countdownTime = currentSettings.countdownTime;
document.getElementById("alt").value = startKey;
document.getElementById("shift").value = splitKey;
document.getElementById("verticalAlign").value = topbottom;
document.getElementById("horizontalAlign").value = leftright;
document.getElementById("hueslider").value = hueRotate;
document.getElementById("colordisp").style.filter = "hue-rotate(" + hueRotate.toString() + "deg)";
document.getElementById("fontselect").value = globalFont;
document.getElementById("fontselect").style.fontFamily = globalFont;
document.getElementById("countdown").value = countdownTime;

function save_options() {
    var status = document.getElementById("status");
    status.innerText = "Please wait...";

    startKey = document.getElementById("alt").value;
    splitKey = document.getElementById("shift").value;
    topbottom = document.getElementById("verticalAlign").value;
    leftright = document.getElementById("horizontalAlign").value;
    hueRotate = document.getElementById("hueslider").value;
    globalFont = document.getElementById("fontselect").value;
    countdownTime = document.getElementById("countdown").value;
    fs.writeFileSync(getAppDataPath() + "/settings.json", JSON.stringify({
        startKey: startKey,
        splitKey: splitKey,
        topbottom: topbottom,
        leftright: leftright,
        hueRotate: hueRotate,
        globalFont: globalFont,
        countdownTime: countdownTime
    }));

    ipcRenderer.send("reboot");
}

document.getElementById("hueslider").oninput = function() {
    document.getElementById("colordisp").style.filter = "hue-rotate(" + this.value.toString() + "deg)";
}

document.querySelector("button").onclick = save_options;