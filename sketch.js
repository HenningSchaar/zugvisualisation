let trains;
let trainsOld;
const backgroundColor = 50;
const trainColour1 = [255, 0, 0];
const trainColour2 = [255, 0, 255];
const trainColour3 = [0, 255, 0];
const trainColour4 = [0, 255, 0];
const size = 1440;

function setup() {
    createCanvas(size * (16 / 9), size);
    background(backgroundColor);
    frameRate(1);
    textSize(32);
    noStroke();
}

function draw() {
    getData();
    if (trains) {
        drawTrains(trains);
    }
}

function getData() {
    let url =
        'https://www.zugfinder.de/js/json_kbs.php?kbs=700';
    httpGet(url, 'json', false, function(response) {
        if (trains != response) {
            trains = response.array; //convert train data to an array of trains
            trains.shift(); //remove first entry which for some reason is always empty
        } else { console.log('No new data.') };
    })
}

function drawTrains(trains) {
    background(255);
    background(backgroundColor);
    trains.forEach(trainDataEntry => {
        train = new Train(trainDataEntry);
        train.display();
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


function handleError(error) {
    console.log(error);
    setTimeout(perform, 1000);
};