let stationList;
let map;
let trainCanvas;
let streckenOld;
let strecken;
let cursor;
let explosions = [];

//network

let socket;
let isConnected;

// General config

const dataTimeout = 60000
let trainCategory3 = ["VIA", "RB", "BusSEV"];
let trainCategory2 = ["RE", "IC", "IRE"];
let trainCategory1 = ["ICE", "TGV", "NJ"];

// Config Display options
const FPS = 30;
const backgroundColor = 50;
const trainColour1 = [255, 0, 0];
const trainColour2 = [255, 0, 255];
const trainColour3 = [0, 255, 0];
const trainColour4 = [0, 255, 0];
const sizeY = 1920;
const sizeX = 1080
const latOffset = 49.3;
const lngOffset = 7.1;
const coordRange = 2.4;
const cursorDiameter = 20
const audibleRadius = 500


function preload() {
    map = loadJSON('http://localhost:8080/map.json');
    strecken = loadJSON('http://localhost:8080/strecken.json');
}


function setup() {
    setupOsc(8000, 12000)

    /* //Shorten Streckenarray for testing
    strecken.strecken = strecken.strecken.slice(0, 1); */

    // Write initial strecken to streckenOld for later modification
    streckenOld = JSON.parse(JSON.stringify(strecken));

    // Create an array of Stations in the map.json file
    stationList = map.stations;

    //Initialize Graphics
    createCanvas(1920, 1080);
    trainCanvas = createGraphics(1920, 1080, P2D);
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

    //Create Cursor
    cursor = new Cursor;

    //hide OS cursor
    noCursor();

    // Get Zugfinder data on each strecke
    //collectData();

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
            drawTrains(strecke);
        }
    })
    drawExplosions();
    cursor.display();
}

function collectData() {
    strecken.strecken.forEach(strecke => {
        getData(strecke);
    });
    setTimeout(collectData, dataTimeout);
}

function evaluateData(response) {
    response = response[0];
    splitResponse = response.split("\null")
    url = splitResponse[0];
    let strecke

    strecken.strecken.forEach(str => {
        if (str.url == url) {
            strecke = str;
        }
    })

    response = JSON.parse(splitResponse[1]);

    console.log(response);

    trains = response.array; //convert train data to an array of trains
    trains.shift(); //remove first entry which for some reason is always empty
    if (strecke.zuege) {
        oldZuege = strecke.zuege;
    } else { oldZuege = null }
    strecke.zuege = [];

    //Write old y-position to newly fetched data Entry for smooth displaying.
    trains.forEach(train => {

        // Give the train a Unique ID
        train.ID = calculateID(train);

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
}

function jsonUrl(url) {
    url = url.slice(0, 25) + 'js/json_' + url.slice(25)
    return url;
}

// Network Functions

function setupOsc(oscPortIn, oscPortOut) {
    socket = io.connect('http://localhost:8081', { port: 8081, rememberTransport: false });
    socket.on('connect', function() {
        socket.emit('config', {
            server: { port: oscPortIn, host: 'localhost' },
            client: { port: oscPortOut, host: 'localhost' }
        });
    });
    socket.on('connect', function() {
        isConnected = true;
    });
    socket.on('message', function(msg) {
        if (msg[0] == '#bundle') {
            for (var i = 2; i < msg.length; i++) {
                receiveOsc(msg[i][0], msg[i].splice(1));
            }
        } else {
            receiveOsc(msg[0], msg.splice(1));
        }
    });
    socket.on('hi', function(msg) {
        console.log('hi');
    });
}

function receiveOsc(address, value) {
    if (adress = '/streckenData') {
        evaluateData(value);
    } else(handleError('Received from unknown adress: ' + adress))

}

function sendOsc(address, value) {
    if (isConnected) {
        socket.emit('message', [address, value]);
    } else {
        handleError("No connection, message " + value + " not sent to " + adress)
    }

}

String.prototype.hashCode = function() {
    var hash = 0,
        i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

//prevent scrolling

function mouseWheel(event) {
    return false;
}

// Debugging functions

function stop() {
    noLoop();
    trainCanvas.noLoop();
}

function handleError(error) {
    console.log(error);
}