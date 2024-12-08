const express = require('express');
const om = require('openmeteo');

const app = express();

app.listen(3000, () => {
    console.log("listening on port 3000");
});

app.use(express.static("public"));
app.use(express.json()); // parses body of requests as json [middleware: research]

app.post("/coordinates", (req, res) => {
    fetchWeatherData(req.body.latitude, req.body.longitude);
    res.send("/coordinates: POST request receieved.");
});

app.get("/weather-data", (req, res) => {
    res.send("omg hi!!");
});

async function fetchWeatherData(lat, lon) {
    const params = {
        "latitude": [lat],
        "longitude": [lon],
        "current": ['temperature_2m', 'precipitation', 'weather_code', 'wind_speed_10m', 'wind_direction_10m', 'cloud_cover'],
        "timezone": "America/Los_Angeles"
    };

    const url = 'https://api.open-meteo.com/v1/forecast';
    const response = (await om.fetchWeatherApi(url, params))[0];

    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current();

    const weatherData = {

        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature: current.variables(0).value(),
            precipitation: current.variables(1).value(),
            weatherCode: current.variables(2).value(),
            windSpeed: current.variables(3).value(),
            windDirection: current.variables(4).value(),
            cloudCover: current.variables(5).value()
        }

    };

    console.log(weatherData); // this is a test change

}