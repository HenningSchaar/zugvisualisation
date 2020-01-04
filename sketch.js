let stationList;
let map;
let trainCanvas;
let streckenOld;
let strecken;

// General config

const dataTimeout = 30000

// Config Display options
const FPS = 20;
const backgroundColor = 50;
const trainColour1 = [255, 0, 0];
const trainColour2 = [255, 0, 255];
const trainColour3 = [0, 255, 0];
const trainColour4 = [0, 255, 0];
const sizeY = 1440;
const sizeX = sizeY * (16 / 9)
const latOffset = 47.5;
const lngOffset = 6.7;
const coordRange = 2.7;


function preload() {
    map = loadJSON('http://localhost:8080/map.json');
    strecken = loadJSON('http://localhost:8080/strecken.json');
}


function setup() {

    /* //Shorten Streckenarray for testing
    strecken.strecken = strecken.strecken.slice(0, 1); */

    // Write initial strecken to streckenOld for later modification
    streckenOld = JSON.parse(JSON.stringify(strecken));

    // Create an array of Stations in the map.json file
    stationList = map.stations;

    //Initialize Graphics
    createCanvas(sizeX, sizeY);
    trainCanvas = createGraphics(sizeX, sizeY, P2D);
    background(backgroundColor);
    frameRate(FPS);
    textSize(10);
    noStroke();
    trainCanvas.clear(); //.background(50, 50, 0, 50);
    trainCanvas.noStroke();

    // Calculate Canvas position based on coordinates
    addPixelData(stationList);

    // Draw map of all available Stations
    drawMap(stationList);

    // Get Zugfinder data on each strecke
    collectData();

    //noLoop();
}


function draw() {
    drawMap(stationList);
    strecken.strecken.forEach(strecke => {
        if (strecke.zuege) {
            strecke.zuege.forEach(zug => {
                progressInfo = calculateProgress(zug, strecke);
                zug.progressInfo = progressInfo
            })
            drawTrains(strecke.zuege);
        }
    })
}

function collectData() {
    strecken.strecken.forEach(strecke => {
        getData(strecke);
    });
    setTimeout(collectData, dataTimeout);
}

function getData(strecke) {
    url = jsonUrl(strecke.url)
    httpGet(url, false, function(response) {
        console.log(response);

        trains = response.array; //convert train data to an array of trains
        trains.shift(); //remove first entry which for some reason is always empty
        if (strecke.zuege) {
            oldZuege = strecke.zuege;
        } else { oldZuege = null }
        strecke.zuege = [];

        //Write old y-position to newly fetched data Entry for smooth displaying.
        trains.forEach(train => {
            if (oldZuege) {

                oldZuege.forEach(oldZug => {
                    if (oldZug.zugnr + oldZug.beginn == train.zugnr + train.beginn) {
                        train.yOld = oldZug.yOld;
                    }
                })

            }
            strecke.zuege.push(train);
        })


        //Check if an old train is no longer in the new data to try keeping it until there is new information.
        if (oldZuege) {

            oldZuege.forEach(oldZug => {
                isGone = true;

                trains.forEach(train => {
                    if (oldZug.zugnr + oldZug.beginn == train.zugnr + train.beginn) {
                        isGone = false;
                    }
                })

                if (isGone == true) {
                    if (oldZug.oldness) {
                        oldZug.oldness = oldZug.oldness + 1
                    } else(oldZug.oldness = 1)

                    if (oldZug.oldness) {
                        if (oldZug.oldness <= 4) {
                            strecke.zuege.push(oldZug);
                        }
                    } else {
                        console.log("Zug is too old. Deleting: ");
                        console.log(oldZug)
                    }
                    //console.log("Zug is not contained in new Request")
                }
            })

        }
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
}