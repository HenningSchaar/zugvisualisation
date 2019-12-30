class Train {
    constructor(trainDataEntry) {
        this.x = trainDataEntry.xpos * (trainCanvas.height / 1000) + (trainCanvas.width / 2 - trainCanvas.height / 2);
        this.y = trainDataEntry.ypos * (trainCanvas.height / 1000);

        this.diameter = 10;
        this.color = extractColour(trainDataEntry.farbe);
        this.speed = 0;
        if (trainDataEntry.progressInfo) {
            let xy = calculateInBetweenPoint(trainDataEntry)
            this.xPosOnMap = xy[0]
            this.yPosOnMap = xy[1]
        }
    }

    display() {
        fill(this.color)
        ellipse(this.xPosOnMap, this.yPosOnMap, this.diameter, this.diameter);
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

function calculateProgress(zug, strecke) {
    stationPair = getTwoNearestStations(zug, strecke);
    if (stationPair) {
        stationPairPositions = [strecke.stations[stationPair[0]].position, strecke.stations[stationPair[1]].position];
        progress = (zug.ypos - stationPairPositions[0]) / (stationPairPositions[1] - stationPairPositions[0]);
        stationName0 = strecke.stations[stationPair[0]].station;
        stationName1 = strecke.stations[stationPair[1]].station;
        stationPosition0 = getPositionOnMap(stationName0);
        stationPosition1 = getPositionOnMap(stationName1);
        progressInfo = {
            "stations": [{
                "name": stationName0,
                "position": stationPosition0
            }, {
                "name": stationName1,
                "position": stationPosition1
            }],
            "progress": progress
        };
        return progressInfo;
    }
}

function getTwoNearestStations(zug, strecke) {
    let twoNearestStations = [0, 1];
    strecke.stations.forEach((station, i) => {
        if (zug.ypos >= station.position) {
            if (strecke.stations[i + 1]) {
                if (strecke.stations[i + 1].position >= zug.ypos) {
                    twoNearestStations = [i, i + 1];
                }
            } else { twoNearestStations = [i, null] }
        }
    })
    if (twoNearestStations) {
        return twoNearestStations;
    } else {
        errorString = 'Couldn\'t get two nearest stations of '
        zug.zugnr + ' in ' + strecke.url
        handleError(errorString);
    }
}

function getPositionOnMap(stationName) {
    stationList.forEach(station => {
        if (station.name == stationName) {
            xyPositionOnMap = [station.coordinates.x, station.coordinates.y];
        }
    })
    return xyPositionOnMap;
}

function calculateInBetweenPoint(trainDataEntry) {
    let v0 = createVector(trainDataEntry.progressInfo.stations[0].position[0], trainDataEntry.progressInfo.stations[0].position[1]);
    let v1 = createVector(trainDataEntry.progressInfo.stations[1].position[0], trainDataEntry.progressInfo.stations[1].position[1]);
    v2 = v1.sub(v0);
    v2 = v2.mult(trainDataEntry.progressInfo.progress);
    v2 = v2.add(v0);
    return [v2.x, v2.y]
}

function writePrevPosition() {
    timeCounter = 0;
    if (streckenOld) {
        if (JSON.stringify(streckenOld) != JSON.stringify(strecken)) {
            strecken.strecken.forEach(strecke => {
                if (strecke.zuege) {
                    strecke.zuege.forEach(zug => {

                        streckenOld.strecken.forEach(streckeOld => {
                            if (streckeOld.zuege) {
                                streckeOld.zuege.forEach(zugOld => {
                                    if (zugOld.zugnr == zug.zugnr) {
                                        zug.xOld = zugOld.xpos;
                                        zug.yOld = zugOld.ypos;
                                    }
                                })
                            }
                        })

                    })
                }
            })
        }
        streckenOld = JSON.parse(JSON.stringify(strecken));
    } else console.log('data is the same');
}