class Cursor {
    constructor() {
        this.x = mouseX;
        this.y = mouseY;
        this.diameter = cursorDiameter;
        this.color = [255, 255, 255, 100];
    }

    updatePosition() {
        if (cursor) {
            this.oldX = cursor.x;
            this.oldY = cursor.y;
        }
        this.x = mouseX;
        this.y = mouseY;
        if (this.oldX != this.x || this.oldY != this.y) {
            this.positionDump();
        }
    }

    positionDump() {
        let trainArray = [];
        let vCursor = createVector(this.x, this.y);
        strecken.strecken.forEach(strecke => {
            if (strecke.zuege) {

                strecke.zuege.forEach(zug => {
                    let vZug = createVector(zug.xPosOnMap, zug.yPosOnMap);
                    let cursorToZug = vZug.sub(vCursor);
                    let cursorToZugMag = cursorToZug.mag()

                    if (cursorToZugMag <= audibleRadius) {
                        let relativeAudibility = 1 - (cursorToZugMag / audibleRadius);
                        let relativeAngle = cursorToZug.heading() * (180 / Math.PI);
                        let trainInfo = zug.ID + ' ' + relativeAudibility + ' ' + relativeAngle;
                        trainArray.push(trainInfo);
                    }
                })

            }
        })
        this.transmitData(trainArray.toString());
    }

    transmitData(data) {
        sendOsc('/positionDump', data);
    }

    display() {
        this.updatePosition();
        stroke(255);
        fill(this.color);
        ellipse(this.x, this.y, this.diameter, this.diameter);
        noStroke();
    }
}

function drawExplosions() {
    explosions.forEach((explosion, i) => {
        if (explosion.a <= 0) {
            explosions.splice(i, 1);
        } else  {
            explosion.drawExplosion();
        }
    })
}

function explode(trainDataEntry) {
    if (explosionNotPresent(trainDataEntry.ID) == true) {
        let explosion = new Explosion(trainDataEntry);
        explosions.push(explosion);
    }
}

function explosionNotPresent(trainId) {
    let notPresent = true;
    explosions.forEach(explosion => {
        if (trainId == explosion.id) {
            notPresent = false;
        }
    })
    return notPresent;
}

class Explosion {
    constructor(trainDataEntry) {
        this.lauf = trainDataEntry.lauf;
        this.x = trainDataEntry.xPosOnMap;
        this.y = trainDataEntry.yPosOnMap;
        this.id = trainDataEntry.ID;
        this.r = 10;
        this.a = 255;
        this.timeOut = 1000 / FPS
    }
    drawExplosion() {
        stroke(255, 255, 255, this.a);
        noFill();
        ellipse(this.x, this.y, this.r, this.r);
        this.drawExplosionText();
        this.r = this.r + (20 / FPS);
        this.a = this.a - (20 / FPS);
    }
    drawExplosionText() {
        textSize(1)
        fill(255, 255, 255, this.a);
        noStroke();
        textAlign(CENTER, BASELINE);
        push();
        translate(this.x, this.y);
        rotate(-PI / 2);
        [...this.lauf].forEach(letter => {
            translate(0, this.r * -1);
            let scl = this.r * 0.1;
            scale(scl);
            text(letter, 0, (this.r * 0.45) * (1 / scl));
            scale(1 / scl);
            translate(0, this.r * 1);
            rotate(0.12);
        })
        stroke(255, 255, 255, this.a);
        noFill();
        pop();
    }
}