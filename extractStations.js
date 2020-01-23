const fs = require('fs');
const request = require('request');
const escape = require('remove-accents');

const apiKey = 'AIzaSyAqHZBp2U6KwmMlSvR4Tab_j6JVy23xIxI';

let stations = []
let stationsWithCoordinates = []
let failedRequests = 0
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

stations.forEach((station, idx) => {
    setTimeout(() => {
        getCoordinates(station, idx, stations.length);
    }, 1000 * idx);
});

checkCoordinates();


function checkCoordinates() {
    if ((stationsWithCoordinates.length - failedRequests) == stations.length) {
        map.stations = stationsWithCoordinates;
        //console.log(map);
        console.log('Write file to Disk');
        fs.writeFileSync('map.json', JSON.stringify(map, null, "\t"));
        console.log('done!');
    } else {
        setTimeout(checkCoordinates, 1000);
    }
}




function getCoordinates(station, idx, max) {

    console.log("requesting: " + station + " " + idx + "/" + max);

    stationWithProvince = station + " Germany"
    let stationFormatted = escape(stationWithProvince.replace(/ /g, '+')).replace(/ß/g, 'ss')
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
        } else {
            handleError("API Request for " + stationFormatted + " failed." + "\n" + locationData.error_message);
            failedRequests = failedRequests + 1
        }

        //setTimeout(addCoordinates, 50000);
    });
}

function handleError(error) {
    console.log(error);
}