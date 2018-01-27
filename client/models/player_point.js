import GraphicalPoint from "./graphical_point";

const colors = require('colors');

export default class PlayerPoint {
    constructor(x, y, gridSize, padding, player) {
        this.player = player;
        this.graphicalPoint = new GraphicalPoint(padding + x * gridSize, padding + y * gridSize, player.color, 5);
        this.x = x;
        this.y = y;
        this.dead = false;
    }

    killedBy(player) {
        this.dead = true;
        this.killedBy = player;
    }

    color() {
        return this.player.color;
    }

    draw(ctx) {
        this.graphicalPoint.draw(ctx);
    }

    toString() {
        return `Point(${this.player.toString()}, x: ${this.x}, y: ${this.y})`;
    }

    textRepresentation() {
        if (this.dead) {
            return this.player.textRepresentationDead[this.player.colorName];
        } else {
            return this.player.textRepresentation[this.player.colorName];
        }
    }
}
