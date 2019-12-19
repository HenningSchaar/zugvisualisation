let trains;
let stationList;
let map;
let trainCanvas;

// Config variables/Display options
const backgroundColor = 50;
const trainColour1 = [255, 0, 0];
const trainColour2 = [255, 0, 255];
const trainColour3 = [0, 255, 0];
const trainColour4 = [0, 255, 0];
const sizeY = 1200;
const sizeX = sizeY * (16 / 10)
const latOffset = 47.5;
const lngOffset = 6.7;
const coordRange = 2.7;


function preload() {
    map = loadJSON('http://localhost:8080/map.json');
    strecken = loadJSON('http://localhost:8080/strecken.json');
}


function setup() {
    // Create an array of Stations in the map.json file
    stationList = map.stations;

    // Calculate Canvas position based on coordinates
    addPixelData(stationList);

    //Initialize Graphics
    createCanvas(sizeX, sizeY);
    trainCanvas = createGraphics(sizeX, sizeY, P2D);
    background(backgroundColor);
    frameRate(1);
    textSize(10);
    noStroke();
    trainCanvas.clear(); //.background(50, 50, 0, 50);
    trainCanvas.noStroke();

    // Draw map of all available Stations
    drawMap(stationList);

    // Get Zugfinder data on each strecke
    collectData();
}


function draw() {
    drawMap(stationList);
    strecken.strecken.forEach(strecke => {
        if (strecke.zuege) {
            drawTrains(strecke.zuege);
        }
    })
}

function collectData() {
    strecken.strecken.forEach(strecke => {
        strecke = getData(strecke);
    });
    setTimeout(collectData, 60000);
}

function getData(strecke) {
    url = jsonUrl(strecke.url)
    httpGet(url, false, function(response) {
        console.log(response);
        if (trains != response) {
            trains = response.array; //convert train data to an array of trains
            trains.shift(); //remove first entry which for some reason is always empty
            strecke.zuege = [];
            trains.forEach(train => {
                strecke.zuege.push(train);
            })
            return strecke;
        } else { console.log('No new data.') };
    })
}

function jsonUrl(url) {
    url = url.slice(0, 25) + 'js/json_' + url.slice(25)
    return url;
}

function stop() {
    noLoop();
    trainCanvas.noLoop();
}

function handleError(error) {
    console.log(error);
};