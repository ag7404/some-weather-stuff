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
    const response = await fetch("/coordinates", options);

    // server response handling
    if(response.ok) {
        const obj = await response.text();
        console.log(obj);
    }
}

if("geolocation" in navigator) {
    
    navigator.geolocation.getCurrentPosition(sendCoords);

} else {
    console.log("geolocation not available");
}