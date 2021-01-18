const { BrowserWindow } = require('electron').remote;
const fs = require('fs');
const ioHook = require('iohook');
 
ioHook.start();

document.getElementById("settingsbutton").addEventListener("click", function() {
    const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true,
        }
    });

    win.loadFile("window/settings.html");
});

scheme = ["#141414", "#002F63", "#003D82", "#0C53A6", "#2B6ABC"];
settings = JSON.parse(fs.readFileSync(__dirname + "/settings.json", "utf8"));

document.body.style.filter = "hue-rotate(" + settings.hueRotate + "deg)";

function now() {
    return ((new Date()).getTime());
}

AltToStartClock = true;

time = document.getElementById("time");
clock = 0;

splits = document.getElementById("splits");

keylog = document.getElementById("keylog")

clockDisp = function() {
    s = (clock % 60000) / 1000;
    m = Math.floor(clock / 60000);
    s_display = (s < 10)?("0"+s.toFixed(2)):(s.toFixed(2));
    time.innerHTML = m.toString() + ":" + s_display;
};

updateClock = function() {
    clock = now() - startTime;
    clockDisp();
};

keymap = {};


ioHook.on("keydown", e => {
    keyname = keycodeNames[e.keycode];
    console.log(keyname)
    if (keyname == settings.startKey) {
        if (AltToStartClock) {
            clock = 0;
            startTime = now();
            splits.innerHTML = "";
            mainLoop = setInterval(updateClock, 10);
            AltToStartClock = false;
        }
        else {
            clearInterval(mainLoop);
            AltToStartClock = true;
        }
    }
    else if (keyname == settings.splitKey) {
        splitText = document.createElement("div");
        splitText.innerHTML = time.innerText;
        splitText.style.color = scheme[3];
        splitText.style.fontSize = "24px";
        splitText.style.fontFamily = "Trebuchet MS";
        splitText.style.marginLeft = "12px";
        splitText.style.marginTop = "2px";
        splitText.style.marginBottom = "2px";
        splits.appendChild(splitText);
        splits.scrollTop = splits.scrollHeight;
    }

    keymap[keyname] = true;
    outstring = "Keys pressed: ";
    for (keypressed in keymap) {
        if (keymap[keypressed]) {
            outstring += keypressed + "; ";
        }
    }
    keylog.innerText = outstring;
});

ioHook.on("keyup", e => {
    keyname = keycodeNames[e.keycode];
    keymap[keyname] = false;
    outstring = "Keys pressed: ";
    for (keypressed in keymap) {
        if (keymap[keypressed]) {
            outstring += keypressed + "; ";
        }
    }
    keylog.innerText = outstring;
});