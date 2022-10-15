const fs = require('fs');
const { ipcRenderer } = require('electron');
const { app } = require("@electron/remote");
const userDataPath = (app || remote.app).getPath("userData");

function formatTime(realtime) {
    s = (realtime % 60000) / 1000;
    m = Math.floor(realtime / 60000);
    s_display = (s < 10)?("0"+s.toFixed(2)):(s.toFixed(2));
    return m.toString() + ":" + s_display;
}

function parseTime(minutes, seconds) {
    return (parseFloat(minutes) * 60 + parseFloat(seconds)) * 1000;
}

tbody = document.getElementById("tablebody");

splits = JSON.parse(fs.readFileSync(userDataPath + "/splits.json", "utf-8"));
addTableRow = function(split) {
    row = document.createElement("tr");
    tbody.appendChild(row);

    cellone = document.createElement("td");
    nameinput = document.createElement("input");
    nameinput.style.width = "100%";
    nameinput.style.boxSizing = "border-box";
    nameinput.value = split.name;
    cellone.appendChild(nameinput);
    row.appendChild(cellone);

    formatted_time = formatTime(split.time);
    celltwo = document.createElement("td");
    minuteinput = document.createElement("input");
    minuteinput.type = "number";
    minuteinput.style.width = "25%";
    minuteinput.style.textAlign = "right";
    minuteinput.value = formatted_time.split(":")[0];
    decospan = document.createElement("span");
    decospan.innerText = ":";
    secondinput = document.createElement("input");
    secondinput.type = "number";
    secondinput.style.width = "20%";
    secondinput.value = parseFloat(formatted_time.split(":")[1]).toFixed(2).split(".")[0];
    secondinput.style.textAlign = "right";
    secondinput.max = "59";
    secondinput.min = "0";
    decospan2 = document.createElement("span");
    decospan2.innerText = ".";
    hundredthinput = document.createElement("input");
    hundredthinput.type = "number";
    hundredthinput.style.width = "25%";
    hundredthinput.value = parseFloat(formatted_time.split(":")[1]).toFixed(2).split(".")[1];
    hundredthinput.max = "99";
    hundredthinput.min = "0";
    celltwo.appendChild(minuteinput);
    celltwo.appendChild(decospan);
    celltwo.appendChild(secondinput);
    celltwo.appendChild(decospan2);
    celltwo.appendChild(hundredthinput);
    row.appendChild(celltwo);

    cellthree = document.createElement("td");
    deletebutton = document.createElement("button");
    deletebutton.innerText = "-";
    cellthree.appendChild(deletebutton);
    row.appendChild(cellthree);
    deletebutton.addEventListener("click", function() {
        this.parentElement.parentElement.remove();
    });
};
for (eachsplit of splits) {
    addTableRow(eachsplit);
}

document.getElementById("addrowbutton").addEventListener("click", function() {
    addTableRow({name: "Level 1", "time": 60000});
});

document.getElementById("submitbutton").addEventListener("click", function() {
    matrix = [];
    for (tr of tbody.children) {
        matrix.push({
            name: tr.children[0].children[0].value,
            time: parseTime(tr.children[1].children[0].value, tr.children[1].children[2].value + "." + tr.children[1].children[4].value),
        });
    }
    fs.writeFileSync(userDataPath + "/splits.json", JSON.stringify(matrix));
    ipcRenderer.send("softreboot");
});

document.body.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
document.body.style.userSelect = "none";