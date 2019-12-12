const request = require('request-promise');
const fs = require('fs');
const DomParser = require('dom-parser');
const testUrl = 'https://www.zugfinder.de/kbs.php?kbs=770'
const parser = new DomParser();

const urlList = JSON.parse(fs.readFileSync('map.json')).routes;

let strecken = { "strecken": [] };

urlList.forEach(url => {
    printStreckenTable(url);
})

function printStreckenTable(url) {
    request(url)
        .then(body => {
            let dom = parser.parseFromString(body);
            strecke = dom.getElementById('strecke');
            stationList = extractTowns(strecke);
            positionList = extractPositions(strecke);
            streckeTable = marryData(testUrl, stationList, positionList);
            console.log(streckenTable);
        });
}

function extractTowns(strecke) {
    stationList = strecke.textContent.split('\n\t').filter(word => word.length > 1);
    return stationList
}

function extractPositions(strecke) {
    positionNodes = strecke.getElementsByClassName('station');
    positionList = [];
    positionNodes
        .forEach(station => {
            positionValue = parseInt(station.attributes[1].value.slice(4, -2));
            positionList.push(positionValue);
        })
    return positionList;
}

function marryData(testUrl, stationList, positionList) {
    streckenTable = {
        "url": testUrl,
        "stations": []
    };
    stationList.forEach((station, i) => {
        streckenTable.stations.push({
            "station": station,
            "position": positionList[i]
        })
    });
}

function handleError(error) {
    console.log(error);
}