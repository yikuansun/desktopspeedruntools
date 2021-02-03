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
            height: 500,
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
    click: () => { ipcRenderer.send("closeappcompletely"); }
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
    fs.writeFileSync(getAppDataPath() + "/settings.json", '{"startKey":"Alt","splitKey":"Shift","topbottom":"top","leftright":"right","hueRotate":"0","globalFont":"Trebuchet MS","countdownTime":"5"}');
    settings = JSON.parse(fs.readFileSync(getAppDataPath() + "/settings.json", "utf8"));
}

try {
    splitdata = JSON.parse(fs.readFileSync(getAppDataPath() + "/splits.json", "utf8"));
}
catch(err) {
    splitdata = '[{"name":"Level 1","time":60000},{"name":"Level 2","time":120000},{"name":"Level 3","time":180000}]';
    fs.writeFileSync(getAppDataPath() + "/splits.json", splitdata);
    splitdata = JSON.parse(splitdata);
}

ipcRenderer.send("SettingsData", settings);

document.getElementById("content").style.filter = "hue-rotate(" + settings.hueRotate + "deg)";
document.getElementById("content").style.fontFamily = settings.globalFont;

function now() {
    return ((new Date()).getTime());
}

AltToStartClock = true;

time = document.getElementById("time");
clock = -(settings.countdownTime * 1000);

splits = document.getElementById("splits");

keylog = document.getElementById("keylog");

function formatTime(realtime) {
    s = (realtime % 60000) / 1000;
    m = Math.floor(realtime / 60000);
    s_display = (s < 10)?("0"+s.toFixed(2)):(s.toFixed(2));
    return m.toString() + ":" + s_display;
}

time.innerHTML = ((clock >= 0)?"":"-") + formatTime(Math.abs(clock));
updateClock = function() {
    if (clock < 0) {
        time.style.color = scheme[2];
    }
    else { time.style.color = scheme[3]; }
    clock = now() - startTime - settings.countdownTime * 1000;
    time.innerHTML = ((clock >= 0)?"":"-") + formatTime(Math.abs(clock));
};

var scrolllen, segment_on;
function fillsplits() {
    for (split of splitdata) {
        row = document.createElement("tr");
        splitname = document.createElement("td");
        splitname.innerText = split.name;
        splitname.style.width = "32.5%";
        row.appendChild(splitname);
        goaltime = document.createElement("td");
        goaltime.innerText = formatTime(split.time);
        goaltime.style.width = "22.5%";
        row.appendChild(goaltime);
        realtime = document.createElement("td");
        realtime.innerText = "";
        realtime.style.width = "45%";
        realtime.setAttribute("class", "splittimes");
        realtime.dataset.goal = split.time;
        row.appendChild(realtime);
        splits.appendChild(row);

        scrolllen = row.getBoundingClientRect().height;
    }
    segment_on = 0;
}
fillsplits();

keymap = {};

/*// key farming
iohookkeycodes = [];
jskeynames = [];*/

function displayPressedKeys() {
    array_to_disp = [];
    for (keypressed in keymap) {
        if (keymap[keypressed]) {
            array_to_disp.push(keypressed);
        }
    }
    keylog.innerText = "Keys pressed: " + array_to_disp.sort().join("; ");
}

ioHook.on("keydown", e => {
    keyname = keycodeNames[e.keycode];
    //iohookkeycodes.push(e.keycode);
    if (keyname == settings.startKey) {
        if (AltToStartClock) {
            clock = 0 - settings.countdownTime * 1000;
            startTime = now();
            splits.innerHTML = "";
            fillsplits();
            mainLoop = setInterval(updateClock, 10);
            AltToStartClock = false;
        }
        else {
            clearInterval(mainLoop);
            AltToStartClock = true;
        }
    }
    else if (keyname == settings.splitKey) {
        splitText = document.getElementsByClassName("splittimes")[segment_on];
        if (splitText) {
            offset = " (" + ((clock <= parseFloat(splitText.dataset.goal))?"-":"+") + (Math.abs(clock - parseFloat(splitText.dataset.goal)) / 1000).toFixed(2) + ")";
            splitText.innerText = time.innerText + offset;
            if (segment_on > 1) {
                smoothscroll.scrollTopAmnt(splits_outer_div, scrolllen);
            }
            segment_on++;
        }
    }

    keymap[keyname] = true;

    displayPressedKeys();
});

ioHook.on("keyup", e => {
    keyname = keycodeNames[e.keycode];
    keymap[keyname] = false;
    
    displayPressedKeys();
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