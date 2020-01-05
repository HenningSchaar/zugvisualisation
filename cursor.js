class Cursor {
    constructor(trainDataEntry) {
        this.x = mouseX;
        this.y = mouseY;
        this.diameter = cursorDiameter;
        this.color = [255, 255, 255, 100];
    }

    updatePosition() {
        this.x = mouseX;
        this.y = mouseY;
    }

    display() {
        this.updatePosition();
        stroke(255);
        fill(this.color);
        ellipse(this.x, this.y, this.diameter, this.diameter);
        noStroke();
    }
}