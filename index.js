const request = require('request-promise');
const DomParser = require('dom-parser');
const testUrl = 'https://www.zugfinder.de/kbs.php?kbs=770'

let parser = new DomParser();

request('https://www.zugfinder.de/kbs.php?kbs=770')
    .then(body => {
        let dom = parser.parseFromString(body);
        strecke = dom.getElementById('strecke');
        positionNodes = strecke.getElementsByClassName('station');
        stationList = extractTowns(strecke);
        positionList = extractPositions(strecke);

        console.log(positionList);
        console.log(stationList);
    });

function handleError(error) {
    console.log(error);
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