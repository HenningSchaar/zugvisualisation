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

function drawTrains(trainList) {
    trainList.forEach(trainDataEntry => {
        train = new Train(trainDataEntry);
        train.display();
    });
}