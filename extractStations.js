const fs = require('fs');
const request = require('request');
const escape = require('remove-accents');

const apiKey = 'AIzaSyAqHZBp2U6KwmMlSvR4Tab_j6JVy23xIxI';

let stations = []
let stationsWithCoordinates = []
const streckenList = JSON.parse(fs.readFileSync('strecken.json')).strecken;
const map = JSON.parse(fs.readFileSync('map.json'));
map.stations = [];

streckenList.forEach(strecke => {
    strecke.stations.forEach(station => {
        stations.push(station.station);
    })
});

stations = [...new Set(stations)]; //remove duplicates
//stations = stations.sort(); //sort alphabetically

stations.forEach(station => {
    getCoordinates(station);
})

checkCoordinates();


function checkCoordinates() {
    if (stationsWithCoordinates.length == stations.length) {
        map.stations = stationsWithCoordinates;
        console.log(map);
        //fs.writeFileSync('map.json', JSON.stringify(map, null, "\t"));
    } else {
        setTimeout(checkCoordinates, 1000);
    }
}




function getCoordinates(station) {
    let stationFormatted = escape(station.replace(/ /g, '+')).replace(/ß/g, 'ss')
    let apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${stationFormatted}&key=${apiKey}`;

    request(apiUrl, (error, resp, body) => {
        if (error != null) {
            handleError(error);
            return;
        }

        locationData = JSON.parse(body);
        if (locationData.status == "OK") {
            let coordinates = locationData.results[0].geometry.location;
            let entry = { "name": 0, "coordinates": 0 }
            entry.name = station;
            entry.coordinates = coordinates;
            stationsWithCoordinates.push(entry);
        } else { handleError("API Request for " + stationFormatted + " failed." + "\n" + locationData.error_message); }

        //setTimeout(addCoordinates, 50000);
    });
}

function handleError(error) {
    console.log(error);
}