let trains;
let trainsOld;
const backgroundColor = 200;
const trainColour1 = [255, 0, 0];
const trainColour2 = [255, 0, 255];
const trainColour3 = [0, 255, 0];

function setup() {
    createCanvas(1000, 1000);
    background(backgroundColor);
    frameRate(1);
    noStroke();
}

function draw() {
    let url =
        'https://www.zugfinder.de/js/json.php?netz=deutschland|0|0|839|953';
    httpGet(url, 'json', false, function(response) {
        if (trains != response) {
            trains = response.array; //convert train data to an array of trains
            trains.shift(); //remove first entry which for some reason is always empty
        } else { console.log('No new data.') };
        drawTrains(trains);
    })
}

function drawTrains(trains) {
    background(backgroundColor);

    trains.forEach(trainDataEntry => {
        train = new Train(trainDataEntry);
        train.display();
        trainsOld = trains;
    });
}

function handleError(error) {
    console.log(error);
    setTimeout(perform, 1000);
}

class Train {
    constructor(trainDataEntry) {
        this.x = trainDataEntry.xpos;
        this.y = trainDataEntry.ypos;
        this.diameter = 10;
        this.color = extractColour(trainDataEntry.farbe);
        this.speed = 0;
    }

    move() {
        this.x += random(-this.speed, this.speed);
        this.y += random(-this.speed, this.speed);
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
                console.log('Unknown colour')
                return [0, 0, 0];
            }
        }
    }
}