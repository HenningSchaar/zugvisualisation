function setup() {
    createCanvas(400, 400);
    background(200);
    frameRate(0.5);
}

let trains;

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

}

function handleError(error) {
    console.log(error);
    setTimeout(perform, 1000);
}

class Train {
    constructor(trainData) {
        this.x = trainData.xpos;
        this.y = trainData.ypos;
        this.diameter = 10;
        this.color = [random(0, 255), random(0, 255), random(0, 255)];
        this.speed = 0;
    }

    move() {
        this.x += random(-this.speed, this.speed);
        this.y += random(-this.speed, this.speed);
    }

    display() {
        ellipse(this.x, this.y, this.diameter, this.diameter);
    }
}