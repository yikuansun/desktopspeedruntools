const { ipcRenderer } = require('electron');
const { BrowserWindow, Menu, app } = require("@electron/remote");
const fs = require('fs');
const { uIOhook, UiohookKey } = require("uiohook-napi");
const os = require('os');
const userDataPath = app.getPath("userData");

var keycodeNames = JSON.parse(fs.readFileSync(__dirname + "/keycodenames/" + os.platform() + ".json", "utf-8"));

uIOhook.start();

var rightClickMenu = Menu.buildFromTemplate([
    {
        label: 'Open Settings',
        click: () => {
            ipcRenderer.send("openSettings");
        }
    },
    {
        label: 'Edit Splits',
        click: () => {
            ipcRenderer.send("openSplitEditor");
        }
    },
    {
        label: 'Close Runtime',
        click: () => { ipcRenderer.send("closeappcompletely"); }
    }
]);
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    rightClickMenu.popup();
}, false);

const scheme = ["#141414", "#002F63", "#003D82", "#0C53A6", "#2B6ABC"];
for (var i = 0; i < scheme.length; i++) {
    document.documentElement.style.setProperty("--color-" + i.toString(), scheme[i]);
}

var settings;
try {
    settings = JSON.parse(fs.readFileSync(userDataPath + "/settings.json", "utf8"));
}
catch(err) {
    try {
        fs.mkdirSync(userDataPath);
    } catch(err2) { console.log("nothing"); }
    fs.writeFileSync(userDataPath + "/settings.json", JSON.stringify({
        startKey: "Alt",
        splitKey: "Shift",
        hueRotate: "0",
        globalFont: "Trebuchet MS",
        countdownTime: "5",
        autoStop: false
    }));
    settings = JSON.parse(fs.readFileSync(userDataPath + "/settings.json", "utf8"));
}

var splitdata;
try {
    splitdata = JSON.parse(fs.readFileSync(userDataPath + "/splits.json", "utf8"));
}
catch(err) {
    splitdata = [
        {
            name: "Level 1",
            time: 60000
        },
        {
            name: "Level 2",
            time: 120000
        },
        {
            name: "Level 3",
            time: 180000
        }
    ];
    fs.writeFileSync(userDataPath + "/splits.json", JSON.stringify(splitdata));
}

document.getElementById("content").style.filter = "hue-rotate(" + settings.hueRotate + "deg)";
document.getElementById("content").style.fontFamily = settings.globalFont;

function now() {
    return ((new Date()).getTime());
}

var AltToStartClock = true;

var time = document.getElementById("time");
var clock = -(settings.countdownTime * 1000);

var splits = document.getElementById("splits");

var keylog = document.getElementById("keylog");

function formatTime(realtime) {
    var s = (realtime % 60000) / 1000;
    var m = Math.floor(realtime / 60000);
    if (m < 1) return s.toFixed(2);
    if (m < 60) {
        var s_display = (s < 10)?("0"+s.toFixed(2)):(s.toFixed(2));
        return m.toString() + ":" + s_display;
    }
    else {
        var h = Math.floor(realtime / 3600000);
        m = m - 60 * h;
        var m_display = (m < 10)?("0"+m.toFixed(0)):(m.toFixed(0));
        var s_display = (s < 10)?("0"+s.toFixed(0)):(s.toFixed(0));
        if (s_display == "60") s_display = "59";
        return h.toString() + ":" + m_display + ":" + s_display;
    }
}

var startTime;
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
        var row = document.createElement("tr");
        var splitname = document.createElement("td");
        splitname.innerText = split.name;
        splitname.style.width = "50%";
        row.appendChild(splitname);
        var goaltime = document.createElement("td");
        goaltime.innerText = formatTime(split.time);
        goaltime.style.width = "50%";
        goaltime.style.textAlign = "right";
        goaltime.setAttribute("class", "splittimes");
        goaltime.dataset.goal = split.time;
        row.appendChild(goaltime);
        splits.appendChild(row);

        scrolllen = row.getBoundingClientRect().height;
    }
    segment_on = 0;
}
fillsplits();

var keymap = {};

/*// key farming
iohookkeycodes = [];
jskeynames = [];*/

function displayPressedKeys() {
    var array_to_disp = [];
    for (keypressed in keymap) {
        if (keymap[keypressed]) {
            array_to_disp.push(keypressed);
        }
    }
    keylog.innerText = "Keys pressed: " + array_to_disp.sort().join("; ");
}

uIOhook.on("keydown", e => {
    var keyname = keycodeNames[e.keycode];
    //iohookkeycodes.push(e.keycode);
    if (keyname == settings.startKey) {
        if (AltToStartClock) {
            clock = 0 - settings.countdownTime * 1000;
            startTime = now();
            splits.innerHTML = "";
            fillsplits();
            mainLoop = setInterval(updateClock, 1000 / 60);
            AltToStartClock = false;
        }
        else {
            clearInterval(mainLoop);
            AltToStartClock = true;
        }
    }
    else if (keyname == settings.splitKey) {
        var splitText = document.getElementsByClassName("splittimes")[segment_on];
        if (splitText) {
            var offset = " (" + ((clock <= parseFloat(splitText.dataset.goal))?"-":"+") + (Math.abs(clock - parseFloat(splitText.dataset.goal)) / 1000).toFixed(1) + ")";
            splitText.innerText = time.innerText + offset;
            if (segment_on > 1) {
                smoothscroll.scrollTopAmnt(splits_outer_div, scrolllen);
            }
            segment_on++;
        }
        if (segment_on == document.getElementsByClassName("splittimes").length && Boolean(settings.autoStop)) {
            try {
                clearInterval(mainLoop);
                AltToStartClock = true;
            } catch(err) {  }
        }
    }

    keymap[keyname] = true;

    displayPressedKeys();
});

uIOhook.on("keyup", e => {
    var keyname = keycodeNames[e.keycode];
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