const labels = {
    temperature: document.getElementById("temperature"),
    precipitation: document.getElementById("precipitation"),
    windSpeed: document.getElementById("windSpeed"),
    windDirection: document.getElementById("windDirection"),
    cloudCover: document.getElementById("cloudCover")
};

const summaryPassage = document.getElementById("summary");
const windArrow = document.getElementById("wind-arrow");
const fTemp = document.getElementById("ftemp");

// also receives data from server
async function sendCoords(geoResponse) {
    const latitude = geoResponse.coords.latitude;
    const longitude = geoResponse.coords.longitude;

    const coords = { latitude, longitude };

    const options = {
        method: "POST",
        body: JSON.stringify(coords),
        headers: {
            "Content-Type": "application/json"
        }
    };

    // send coordinates over to server
    const response = await fetch("/data", options);

    // server response handling
    if(response.ok) {
        const obj = await response.json();
        console.log(obj);
        displayData(obj);
    } else {
        return null;
    }
}

function displayData(data) {

    const { weatherData, summary } = data;
    

    for(const [key, value] of Object.entries(weatherData)) {
        // check if data key in set of labels for website
        if(key in labels) {
            labels[key].textContent = Number( value.toPrecision(3) );
        }
    }

    fTemp.textContent = Number(((9/5 * weatherData.temperature) + 32).toPrecision(3));

    windArrow.style.rotate = weatherData.windDirection + "deg";

    summaryPassage.textContent = summary;

}

if("geolocation" in navigator) {
    
    navigator.geolocation.getCurrentPosition(sendCoords);

} else {
    console.log("geolocation not available");
}