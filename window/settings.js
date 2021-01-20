const fs = require('fs');

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

currentSettings = JSON.parse(fs.readFileSync(getAppDataPath() + "/settings.json", "utf-8"));
startKey = currentSettings.startKey;
splitKey = currentSettings.splitKey;
topbottom = currentSettings.topbottom;
leftright = currentSettings.leftright;
hueRotate = currentSettings.hueRotate;
document.getElementById("alt").value = startKey;
document.getElementById("shift").value = splitKey;
document.getElementById("verticalAlign").value = topbottom;
document.getElementById("horizontalAlign").value = leftright;
document.getElementById("hueslider").value = hueRotate;
document.getElementById("colordisp").style.filter = "hue-rotate(" + hueRotate.toString() + "deg)";

function save_options() {
    startKey = document.getElementById("alt").value;
    splitKey = document.getElementById("shift").value;
    topbottom = document.getElementById("verticalAlign").value;
    leftright = document.getElementById("horizontalAlign").value;
    hueRotate = document.getElementById("hueslider").value;
    fs.writeFileSync(getAppDataPath() + "/settings.json", JSON.stringify({
        startKey: startKey,
        splitKey: splitKey,
        topbottom: topbottom,
        leftright: leftright,
        hueRotate: hueRotate
    }));
    var status = document.getElementById("status");
    status.innerText = "Settings saved. Restart app to use updated settings";
    setTimeout(function() {
        status.textContent = "";
    }, 5000);
}

document.getElementById("hueslider").oninput = function() {
    document.getElementById("colordisp").style.filter = "hue-rotate(" + this.value.toString() + "deg)";
}

document.querySelector("button").onclick = save_options;