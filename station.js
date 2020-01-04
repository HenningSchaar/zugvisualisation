class Station {
    constructor(stationEntry) {
        this.name = stationEntry.name;
        this.lat = stationEntry.coordinates.lat;
        this.lng = stationEntry.coordinates.lng;
        this.x = (stationEntry.coordinates.lng - lngOffset) * (height / coordRange) + (width / 2 - height / 2);
        this.y = height - ((stationEntry.coordinates.lat - latOffset) * (height / coordRange));
        this.diameter = 10;
        this.color = 100; //[random(50, 255), random(50, 255), random(50, 255)];
    }

    display(arg) {
        fill(this.color)
        ellipse(this.x, this.y, this.diameter, this.diameter);
        if (arg == text) {
            text(this.name, this.x + 5, this.y + 5)
        }
    }
}

function addPixelData(stationList) {
    stationList.forEach(stationEntry => {
        station = new Station(stationEntry);
        stationEntry.coordinates["x"] = station.x;
        stationEntry.coordinates["y"] = station.y;
    })

}

function drawMap(stationList) {
    background(backgroundColor);
    stationList.forEach(stationEntry => {
        station = new Station(stationEntry);
        station.display(text);
    });
}