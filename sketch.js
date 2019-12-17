let trains;
let stationList;
let trainsOld;
let map;
let pixelMap = {};
const backgroundColor = 50;
const trainColour1 = [255, 0, 0];
const trainColour2 = [255, 0, 255];
const trainColour3 = [0, 255, 0];
const trainColour4 = [0, 255, 0];
const sizeY = 1200;
const sizeX = sizeY * (16 / 10)
const latOffset = 47;
const lngOffset = 6.5;
const coordRange = 3.4;

function preload() {
    map = loadJSON('map.json');
}


function setup() {
    stationList = map.stations;
    addPixelData(stationList);
    //console.log(stationList);
    createCanvas(sizeX, sizeY);
    background(backgroundColor);
    frameRate(1);
    textSize(10);
    noStroke();
    drawMap(stationList);
    noLoop();
}

function draw() {

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
        this.color = [random(50, 255), random(50, 255), random(50, 255)];
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
        this.x = trainDataEntry.xpos * (height / 1000) + (width / 2 - height / 2);
        this.y = trainDataEntry.ypos * (height / 1000);
        this.diameter = 10;
        this.color = extractColour(trainDataEntry.farbe);
        this.speed = 0;
    }

    display() {
        fill(this.color)
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }
}

function drawTrains(trains) {
    background(255);
    background(backgroundColor);
    trains.forEach(trainDataEntry => {
        train = new Train(trainDataEntry);
        train.display();
    });
}

function handleError(error) {
    console.log(error);
    setTimeout(perform, 1000);
};

/*

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

function getData() {
    let url =
        'https://www.zugfinder.de/js/json.php?netz=deutschland|439|53|1278|615';
    httpGet(url, 'json', false, function(response) {
        if (trains != response) {
            trains = response.array; //convert train data to an array of trains
            trains.shift(); //remove first entry which for some reason is always empty
        } else { console.log('No new data.') };
    })
}
*/