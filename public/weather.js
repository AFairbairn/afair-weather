let unixtimestamp;
let delay;

async function getWeather(latlon) {
    lat = latlon.lat;
    lon = latlon.lon;
    const apiUrl = `api/${lat},${lon}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    document.getElementById("place").innerHTML = data.place.formatted;
    generateForecast(data.weather);
}

function generateForecast(weather) {
    let temp = weather.currently.temperature.toFixed(1);
    let icon = createIcon(weather.currently.icon);
    let currPrecip = Math.floor(weather.currently.precipProbability * 100);
    hourlyForecast(weather.hourly.data);
    generateFiveDay(weather.daily.data);
    generateExtra(weather.currently);
    document.getElementById("icon").className = "wi " + icon;
    document.getElementById("info").innerHTML = weather.currently.summary;
    if (currPrecip < 1) {
        document.getElementById("precip").style.display = "none";
        document.getElementById("precipIcon").style.display = "none";
    } else {
        document.getElementById("precip").innerHTML = currPrecip + "%";
    }
    document.getElementById("temperature").innerHTML = temp + "&deg;";
    createChart();
}

function createIcon(icon) {
    if (icon == "clear-day") {
        icon = "wi-day-sunny";
    } else if (icon == "clear-night") {
        icon = "wi-night-clear";
    } else if (icon == "rain") {
        icon = "wi-rain";
    } else if (icon == "snow") {
        icon = "wi-snow";
    } else if (icon == "sleet") {
        icon = "wi-sleet";
    } else if (icon == "wind") {
        icon = "wi-strong-wind";
    } else if (icon == "fog") {
        icon = "wi-fog";
    } else if (icon == "cloudy") {
        icon = "wi-cloudy";
    } else if (icon == "partly-cloudy-day") {
        icon = "wi-day-cloudy";
    } else if (icon == "partly-cloudy-night") {
        icon = "wi-night-partly-cloudy";
    } else {
        icon = "wi-na";
    };
    return icon;
}

function generateFiveDay(data) {
    let days = document.querySelectorAll(".weekDay");
    let icons = document.querySelectorAll(".icon");
    let highs = document.querySelectorAll(".high");
    let lows = document.querySelectorAll(".low");
    let c = 0;
    for (let i = 1; i <= 5; i++) {
        unixtimestamp = data[i].time;
        day = convert(unixtimestamp);
        icon = data[i].icon;
        icon = createIcon(icon);
        high = data[i].temperatureHigh;
        high = high.toFixed(1);
        low = data[i].temperatureLow;
        low = low.toFixed(1);
        days[c].innerHTML = day;
        icons[c].className = "icon wi " + icon;
        highs[c].innerHTML = high + "&deg;";
        lows[c].innerHTML = low + "&deg;";
        c++;
    }
}

function convert(unixtimestamp) {
    let date = new Date(unixtimestamp * 1000);
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var dayOfWeek = days[date.getDay()]
    return dayOfWeek;
}

function generateExtra(data) {
    let temp = data.apparentTemperature;
    temp = temp.toFixed(1);
    document.getElementById("feelsLike").innerHTML = temp + "&deg;";
    let wind = data.windSpeed;
    wind = wind.toFixed(1);
    let windDir = data.windBearing;
    if (wind != 0) {
        windDir = windSymbol(windDir);
    }
    document.getElementById("windDir").className = "wi wi-wind " + windDir;
    document.getElementById("wind").innerHTML = wind + "kph";
    let vis = data.visibility;
    vis = vis.toFixed(1);
    document.getElementById("visibility").innerHTML = vis + "km";
    let bar = data.pressure;
    bar = bar.toFixed(1);
    document.getElementById("barometer").innerHTML = bar + "hPa";
    let hum = data.humidity;
    hum = Math.floor(hum * 100);
    document.getElementById("humidity").innerHTML = hum + "%";
    let dew = data.dewPoint;
    dew = dew.toFixed(1);
    document.getElementById("dewPoint").innerHTML = dew + "&deg;";
}

function windSymbol(dir) {
    let windIcon;
    if (dir > 348 || dir < 12) {
        windIcon = "from-0-deg";
    } else if (dir >= 12 && dir <= 34) {
        windIcon = "from-23-deg";
    } else if (dir >= 35 && dir <= 56) {
        windIcon = "from-45-deg";
    } else if (dir >= 57 && dir <= 79) {
        windIcon = "from-68-deg";
    } else if (dir >= 80 && dir <= 101) {
        windIcon = "from-90-deg";
    } else if (dir >= 102 && dir <= 124) {
        windIcon = "from-113-deg";
    } else if (dir >= 125 && dir <= 146) {
        windIcon = "from-135-deg";
    } else if (dir >= 147 && dir <= 169) {
        windIcon = "from-158-deg";
    } else if (dir >= 170 && dir <= 191) {
        windIcon = "from-180-deg";
    } else if (dir >= 192 && dir <= 214) {
        windIcon = "from-203-deg";
    } else if (dir >= 215 && dir <= 236) {
        windIcon = "from-225-deg";
    } else if (dir >= 237 && dir <= 259) {
        windIcon = "from-248-deg";
    } else if (dir >= 260 && dir <= 281) {
        windIcon = "from-270-deg";
    } else if (dir >= 282 && dir <= 304) {
        windIcon = "from-293-deg";
    } else if (dir >= 305 && dir <= 234) {
        windIcon = "from-313-deg";
    } else if (dir >= 325 && dir <= 347) {
        windIcon = "from-336-deg";
    }
    return windIcon;
}

let hours = [];
let temps = [];
let precips = [];

function hourlyForecast(data) {
    let today = new Date();
    let c = 0;
    for (let i = 0; i < 48; i++) {
        temp = data[i].temperature;
        precip = data[i].precipProbability;
        precip = Math.floor(precip * 100);
        let data_timestamp = data[i].time;
        let timestamp = Math.floor(today.getTime() / 1000);
        let date = new Date(data_timestamp * 1000);
        hour = date.getHours();
        let offset = getDelay();
        if (data_timestamp >= (timestamp - offset) && c <= 12) {
            hour = checkTime(hour);
            hours[c] = hour + ":00";
            temp = temp.toFixed(1);
            precips[c] = precip;
            temps[c] = temp;
            c++;
        }
    }
}


function createChart() {
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.maintainAspectRatio = false;
    Chart.defaults.global.defaultFontColor = "rgba(238,238,238, 0.9)";
    Chart.defaults.global.defaultFontFamily = 'Roboto';
    Chart.defaults.global.defaultFontSize = '14';
    let max = Math.max(...temps) + 2;
    let ctx = document.getElementById("hourly");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: hours,
            datasets: [{
                fill: true,
                data: temps,
                backgroundColor: "rgba(238,238,238, 0.2)",
                borderColor: "rgba(238,238,238, 0.9)",
                borderWidth: 1,
                type: "line",
                yAxisID: "temperature",
                xAxisID: "tempDate",
                datalabels: {
                    display: true,
                    color: "rgba(238,238,238, 0.9)",
                    anchor: "end",
                    align: "top",
                    clip: false,
                    formatter: function (value) {
                        return value + "°";
                    }
                }
            }, {
                data: precips,
                backgroundColor: "rgba(101,146,183, 0.6)",
                yAxisID: "precip",
                xAxisID: "precipDate",
                steppedLine: true,
                datalabels: {
                    display: function (context) {
                        return context.dataset.data[context.dataIndex] >= 10;
                    },
                    color: "rgba(238,238,238, 0.9)",
                    anchor: "end",
                    align: "right",
                    offset: 45,
                    clip: false,
                    color: "rgba(238,238,238, 0.9)",
                    formatter: function (value) {
                        return value + "%";
                    }
                }
            }]
        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            layout: {
                padding: {
                    top: 30
                }
            },
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            scales: {
                yAxes: [{
                    display: false,
                },
                {
                    id: 'temperature',
                    type: 'linear',
                    display: false,
                    stacked: false,
                    scaleLabel: {
                        display: false,
                    },
                    ticks: {
                        stepSize: 1,
                        max: max,
                        suggestedMin: 0
                    }
                },
                {
                    id: 'precip',
                    type: 'linear',
                    display: false,
                    stacked: false,
                    scaleLabel: {
                        display: false,
                    },
                    ticks: {
                        suggestedMax: 400
                    }
                }
                ],
                xAxes: [{
                    id: 'tempDate',
                    stacked: false,
                }, {
                    id: "precipDate",
                    display: false,
                    stacked: false,
                    barPercentage: 1,
                    categoryPercentage: 1,
                }]
            },
        }
    });
}

function getDelay() {
    var date = new Date();
    var hour = date.getMinutes();
    return (60 - hour) * 60 * 1000;
}


var dynamicInterval = function (latlon) {
    clearInterval(interval);
    delay = getDelay();
    interval = setInterval(dynamicInterval, delay);
    getWeather(latlon);
}
var interval = setInterval(dynamicInterval, delay);


//getWeather();
document.addEventListener("DOMContentLoaded", async function () {

    if (navigator.geolocation) {
        const getCoords = async () => {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            return {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
            };
        };
        latlon = await getCoords();
    } else {
        console.log("location services not allowed");
    };
    dynamicInterval(latlon);

});
