const { BrowserWindow, Menu, MenuItem } = require('electron').remote;
const { ipcRenderer } = require('electron');
const fs = require('fs');
const ioHook = require('iohook');
const os = require('os');

keycodeNames = JSON.parse(fs.readFileSync(__dirname + "/keycodenames/" + os.platform() + ".json", "utf-8"));

ioHook.start();

rightClickMenu = new Menu();
settingsButton = new MenuItem({
    label: 'Open Settings',
    click: () => {
        const win = new BrowserWindow({
            height: 300,
            width: 400,
            webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            }
        });

        win.loadFile("window/settings.html");
    }
});
customSplitsButton = new MenuItem({
    label: 'Edit Splits',
    click: () => {
        const win = new BrowserWindow({
            height: 500,
            width: 400,
            webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            }
        });

        win.loadFile("window/splitsmanager/editsplits.html");
    }
});
closeButton = new MenuItem({
    label: 'Close Runtime',
    click: () => { window.close(); }
});
rightClickMenu.append(settingsButton);
rightClickMenu.append(customSplitsButton);
rightClickMenu.append(closeButton);
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    rightClickMenu.popup();
}, false);

scheme = ["#141414", "#002F63", "#003D82", "#0C53A6", "#2B6ABC"];

try {
    settings = JSON.parse(fs.readFileSync(getAppDataPath() + "/settings.json", "utf8"));
}
catch(err) {
    try {
        fs.mkdirSync(getAppDataPath());
    } catch(err2) { console.log("nothing"); }
    fs.writeFileSync(getAppDataPath() + "/settings.json", '{"startKey":"Alt","splitKey":"Shift","topbottom":"top","leftright":"right","hueRotate":"0","globalFont":"Trebuchet MS"}');
    settings = JSON.parse(fs.readFileSync(getAppDataPath() + "/settings.json", "utf8"));
}

try {
    splitdata = JSON.parse(fs.readFileSync(getAppDataPath() + "/splits.json", "utf8"));
}
catch(err) {
    splitdata = '[{"name":"Level 1","time":60000},{"name":"Level 2","time":120000},{"name":"Level 3","time":180000}]';
    fs.writeFileSync(getAppDataPath() + "/splits.json", splitdata);
}

ipcRenderer.send("SettingsData", settings);

document.getElementById("content").style.filter = "hue-rotate(" + settings.hueRotate + "deg)";
document.getElementById("content").style.fontFamily = settings.globalFont;

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

/*// key farming
iohookkeycodes = [];
jskeynames = [];*/

ioHook.on("keydown", e => {
    keyname = keycodeNames[e.keycode];
    //iohookkeycodes.push(e.keycode);
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
/*
// key farming
farm = {};
document.addEventListener("keydown", function(er) {
    jskeynames.push(er.key);
    if (er.key == "ArrowRight") {
        for (i = 0; i < iohookkeycodes.length; i++) {
            farm[iohookkeycodes[i]] = jskeynames[i];
        }
        fs.writeFileSync(__dirname + "/darwin-keycodenames.json", JSON.stringify(farm));
    }
});*/