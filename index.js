const express = require('express');
const om = require('openmeteo');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("SECRET KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();

app.listen(process.env.PORT, () => {
    console.log("listening on port");
});

app.use(express.static("public"));
app.use(express.json());

app.post("/data", async (req, res) => {
    // req.body.latitude, req.body.longitude
    const d = await getAllData(req.body.latitude, req.body.longitude);
    res.send(d);
});

async function generateSummary(weatherData) {

    const prompt = "Generate a two sentence summary of this weather data and _nothing_ else: temperature: " + weatherData.temperature + " C precipitation: " + weatherData.precipitation + "% wind speed: " + weatherData.windSpeed + "kmph cloud cover: " + weatherData.cloudCover + "%";

    const result = await model.generateContent(prompt);
    
    return result;

}
// fetch weather data ==> generate summary ==> post response
async function getAllData(lat, lon) {
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

        
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature: current.variables(0).value(),
            precipitation: current.variables(1).value(),
            weatherCode: current.variables(2).value(),
            windSpeed: current.variables(3).value(),
            windDirection: current.variables(4).value(),
            cloudCover: current.variables(5).value()
        

    };

    const summary = (await generateSummary(weatherData)).response.text();
    console.log(summary);
    
    return { weatherData, summary };
}
