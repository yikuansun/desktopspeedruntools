const fs = require('fs');
const { ipcRenderer } = require('electron');

function formatTime(realtime) {
    s = (realtime % 60000) / 1000;
    m = Math.floor(realtime / 60000);
    s_display = (s < 10)?("0"+s.toFixed(2)):(s.toFixed(2));
    return m.toString() + ":" + s_display;
}

tbody = document.getElementById("tablebody");

splits = JSON.parse(fs.readFileSync(getAppDataPath() + "/splits.json", "utf-8"));
for (split of splits) {
    row = document.createElement("tr");
    tbody.appendChild(row);

    cellone = document.createElement("td");
    nameinput = document.createElement("input");
    nameinput.style.width = "95%";
    nameinput.value = split.name;
    cellone.appendChild(nameinput);
    row.appendChild(cellone);

    formatted_time = formatTime(split.time);
    celltwo = document.createElement("td");
    minuteinput = document.createElement("input");
    minuteinput.type = "number";
    minuteinput.style.width = "30%";
    minuteinput.style.textAlign = "right";
    minuteinput.value = formatted_time.split(":")[0];
    decospan = document.createElement("span");
    decospan.innerText = ":";
    secondinput = document.createElement("input");
    secondinput.type = "number";
    secondinput.step = "0.01";
    secondinput.style.width = "50%";
    secondinput.value = formatted_time.split(":")[1];
    celltwo.appendChild(minuteinput);
    celltwo.appendChild(decospan);
    celltwo.appendChild(secondinput);
    row.appendChild(celltwo);

    cellthree = document.createElement("td");
    deletebutton = document.createElement("button");
    deletebutton.innerText = "Delete row";
    cellthree.appendChild(deletebutton);
    row.appendChild(cellthree);
    deletebutton.addEventListener("click", function() {
        this.parentElement.parentElement.remove();
    });
}
document.getElementById("addrowbutton").addEventListener("click", function() {
    row = document.createElement("tr");
    tbody.appendChild(row);

    cellone = document.createElement("td");
    nameinput = document.createElement("input");
    nameinput.style.width = "95%";
    nameinput.value = split.name;
    cellone.appendChild(nameinput);
    row.appendChild(cellone);

    formatted_time = formatTime(split.time);
    celltwo = document.createElement("td");
    minuteinput = document.createElement("input");
    minuteinput.type = "number";
    minuteinput.style.width = "30%";
    minuteinput.style.textAlign = "right";
    minuteinput.value = formatted_time.split(":")[0];
    decospan = document.createElement("span");
    decospan.innerText = ":";
    secondinput = document.createElement("input");
    secondinput.type = "number";
    secondinput.step = "0.01";
    secondinput.style.width = "50%";
    secondinput.value = formatted_time.split(":")[1];
    celltwo.appendChild(minuteinput);
    celltwo.appendChild(decospan);
    celltwo.appendChild(secondinput);
    row.appendChild(celltwo);

    cellthree = document.createElement("td");
    deletebutton = document.createElement("button");
    deletebutton.innerText = "Delete row";
    cellthree.appendChild(deletebutton);
    row.appendChild(cellthree);
    deletebutton.addEventListener("click", function() {
        this.parentElement.parentElement.remove();
    });
});