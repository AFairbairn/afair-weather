var today, h, m, s, wkDay, day, month, year;
var weekday = new Array(7);
weekday[0] = "Sun";
weekday[1] = "Mon";
weekday[2] = "Tue";
weekday[3] = "Wed";
weekday[4] = "Thu";
weekday[5] = "Fri";
weekday[6] = "Sat";

function clock(){
    today = new Date();
    h = today.getHours();
    m = today.getMinutes();
    s = today.getSeconds();
    wkDay = today.getDay();
    day = today.getDate();
    month = today.getMonth();
    year = today.getFullYear();
    h = checkTime(h)
    m = checkTime(m);
    s = checkTime(s);
    wkDay = weekday[wkDay];
    document.getElementById("time").innerHTML = h + ":" + m;
    document.getElementById("second").innerHTML = s + " ";
    document.getElementById("today").innerHTML = wkDay + " ";
    document.getElementById("calDate").innerHTML = day + "/" + month + "/" + year;
    var t = setTimeout(clock, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

document.addEventListener("DOMContentLoaded", function() {
    clock();
});