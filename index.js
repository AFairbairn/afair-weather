const express = require("express");
const fetch = require("node-fetch");
require('dotenv').config();
const opencage = require('opencage-api-client');
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server Started"));
app.use(express.static("public"));

app.get("/api/:latlon", async (request, response) => {
    let latlon = request.params.latlon.split(",");
    let place;
    opencage.geocode({ q: latlon, language: 'en' }).then(data => {
        // console.log(JSON.stringify(data));
        if (data.status.code == 200) {
            if (data.results.length > 0) {
                place = data.results[0];
            }
        } else if (data.status.code == 402) {
            console.log('hit free trial daily limit');
        } else {
            // other possible response codes:
            // https://opencagedata.com/api#codes
            console.log('error', data.status.message);
        }
    }).catch(error => {
        console.log('error', error.message);
    });
    const KEY = process.env.DARK_SKY;
    const apiUrl = `https://api.darksky.net/forecast/${KEY}/${latlon[0]},${latlon[1]}/?units=si`;
    const fetch_response = await fetch(apiUrl);
    const weather = await fetch_response.json();
    const data = { place, weather }
    response.json(data);
});

