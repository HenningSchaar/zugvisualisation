let trains;
let stationList;
let trainsOld;
let map;
let trainCanvas;

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
    map = loadJSON('map.json');
    strecken = loadJSON('strecken.json');
}

function setup() {
    stationList = map.stations;
    addPixelData(stationList);
    //console.log(stationList);
    createCanvas(sizeX, sizeY);
    trainCanvas = createGraphics(sizeX, sizeY, P2D);
    background(backgroundColor);
    frameRate(0.1);
    textSize(10);
    noStroke();
    trainCanvas.clear(); //.background(50, 50, 0, 50);
    trainCanvas.noStroke();
    drawMap(stationList); //draw the background with all available Stations
    map.routes.forEach(url => {
        console.log(jsonUrl(url))
    })

    getData(jsonUrl(map.routes[0]));

}

function draw() {
    drawMap(stationList);
    strecken.strecken.forEach(strecke => {
        if (strecke.zuege) {
            //console.log(strecke.zuege);
            drawTrains(strecke.zuege);
        }
    })
}

function getData(url) {
    httpGet('https://www.zugfinder.de/js/json_kbs.php?kbs=771', "json", false, function(response) {
        console.log(response);
        /*
        if (trains != response) {
            trains = response.array; //convert train data to an array of trains
            trains.shift(); //remove first entry which for some reason is always empty
            strecken.strecken.forEach(strecke => {
                strecke.zuege = [];
                trains.forEach(train => {
                    strecke.zuege.push(train);
                })
            })
        } //else { console.log('No new data.') };
        */
    })
}

function drawTrains(trains) {
    trains.forEach(trainDataEntry => {
        train = new Train(trainDataEntry);
        train.display();
    });
}


function jsonUrl(url) {
    url = url.slice(0, 25) + 'js/json_' + url.slice(25)
    return url;
}

function addPixelData(stationList) {
    stationList.forEach(stationEntry => {
        station = new Station(stationEntry);
        stationEntry.coordinates["x"] = station.x;
        stationEntry.coordinates["y"] = station.y;
    })

}

class Station {
    constructor(stationEntry) {
        this.name = stationEntry.name;
        this.lat = stationEntry.coordinates.lat;
        this.lng = stationEntry.coordinates.lng;
        this.x = (stationEntry.coordinates.lng - lngOffset) * (height / coordRange) + (width / 2 - height / 2);
        this.y = height - ((stationEntry.coordinates.lat - latOffset) * (height / coordRange));
        this.diameter = 10;
        this.color = 100; //[random(50, 255), random(50, 255), random(50, 255)];
        this.speed = 0;
    }

    display(arg) {
        fill(this.color)
        ellipse(this.x, this.y, this.diameter, this.diameter);
        if (arg == text) {
            text(this.name, this.x + 5, this.y + 5)
        }
    }
}

function drawMap(stationList) {
    background(backgroundColor);
    stationList.forEach(stationEntry => {
        station = new Station(stationEntry);
        station.display();
    });
}

class Train {
    constructor(trainDataEntry) {
        this.x = trainDataEntry.xpos * (trainCanvas.height / 1000) + (trainCanvas.width / 2 - trainCanvas.height / 2);
        this.y = trainDataEntry.ypos * (trainCanvas.height / 1000);
        this.diameter = 10;
        this.color = extractColour(trainDataEntry.farbe);
        this.speed = 0;
    }

    display() {
        fill(this.color)
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }
}

function extractColour(colour) {
    if (colour == "rot") {
        return trainColour1;
    } else {
        if (colour == "lila") {
            return trainColour2;
        } else {
            if (colour == "gruen") {
                return trainColour3;
            } else {
                if (colour == "blau") {
                    return trainColour4;
                } else {
                    console.log('Unknown colour "' + colour + '"')
                    return [0, 0, 0];
                }
            }
        }
    }
}

function stop() {
    noLoop();
    trainCanvas.noLoop();
}

function handleError(error) {
    console.log(error);
};
h