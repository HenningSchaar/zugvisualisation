const request = require('request-promise');
const fs = require('fs');
const DomParser = require('dom-parser');
const testUrl = 'https://www.zugfinder.de/kbs.php?kbs=770'
const parser = new DomParser();

const urlList = JSON.parse(fs.readFileSync('map.json')).routes;

let strecken = { "strecken": [] };

urlList.forEach(url => {
    getStreckenTable(url);
})

checkStrecken();

function writeFileToDisk() {
    fs.writeFileSync('strecken.json', JSON.stringify(strecken, null, "\t"));
}

function checkStrecken() {
    if (strecken.strecken.length == urlList.length) {
        writeFileToDisk();
    } else {
        setTimeout(checkStrecken, 1000);
    }
}

function getStreckenTable(url) {
    request(url)
        .then(body => {
            let dom = parser.parseFromString(body);
            strecke = dom.getElementById('strecke');
            stationList = extractTowns(strecke);
            positionList = extractPositions(strecke);
            streckeTable = marryData(url, stationList, positionList);
            strecken.strecken.push(streckeTable);
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
    streckeTable = {
        "url": testUrl,
        "stations": []
    };
    stationList.forEach((station, i) => {
        streckeTable.stations.push({
            "station": station,
            "position": positionList[i]
        })
    });
    return streckeTable
}

function handleError(error) {
    console.log(error);
}