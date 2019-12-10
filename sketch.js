let trains;
let trainsOld;
let trainsNew = [];
const backgroundColor = 50;
const trainColour1 = [255, 0, 0];
const trainColour2 = [255, 0, 255];
const trainColour3 = [0, 255, 0];
const trainColour4 = [0, 255, 0];
const size = 1440;

function setup() {
    createCanvas(size * (16 / 9), size);
    background(backgroundColor);
    frameRate(60);
    textSize(32);
    noStroke();
}

function draw() {
    frameCountThisSecond = frameCount % 60;
    if (frameCountThisSecond % 60 == 0) {
        getData();
    }
    if (trains) {
        compareTrains();
        drawTrains(trains);
        console.log(trains[1].zugnr + ' ' + trains[1].xDispPos + ' ' + trains[1].yDispPos)
    }
    text(frameCountThisSecond, 10, 30);
}

function getData() {
    let url =
        'https://www.zugfinder.de/js/json.php?netz=deutschland|0|0|839|953';
    httpGet(url, 'json', false, function(response) {
        if (trains != response) {
            trainsOld = trains;
            trains = response.array; //convert train data to an array of trains
            trains.shift(); //remove first entry which for some reason is always empty
        } else { console.log('No new data.') };
    })
}

function drawTrains(trains) {
    background(backgroundColor);

    trainsNew.forEach(trainsNewDataEntry => {
        train = new Train(trainsNewDataEntry);
        train.display();
    });
}

function compareTrains() {
    trainsNew = [];
    if (trainsOld && trains) {
        trainsOld.forEach((oldTrainDataEntry, i) => {
            trains.forEach(trainDataEntry => {
                if (oldTrainDataEntry.zugnr == trainDataEntry.zugnr) {
                    if (frameCountThisSecond != 0) {
                        trainDataEntry.xDispPos = trainDataEntry.xpos - ((oldTrainDataEntry.xpos - trainDataEntry.xpos) * (frameCountThisSecond / 60));
                        trainDataEntry.yDispPos = trainDataEntry.ypos - ((oldTrainDataEntry.ypos - trainDataEntry.ypos) * (frameCountThisSecond / 60));
                    }
                    trainsNew.push(trainDataEntry);
                }
            })
        })
    }
}


class Train {
    constructor(trainDataEntry) {
        this.x = trainDataEntry.xpos * (height / 1000) + (width / 2 - height / 2);
        this.y = trainDataEntry.ypos * (height / 1000);
        this.xDispPos = trainDataEntry.xDispPos * (height / 1000) + (width / 2 - height / 2);
        this.yDispPos = trainDataEntry.yDispPos * (height / 1000);
        this.diameter = 10;
        this.color = extractColour(trainDataEntry.farbe);
        this.speed = 0;
    }

    display(trainOld) {
        fill(this.color)
        ellipse(this.xDispPos, this.yDispPos, this.diameter, this.diameter);
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