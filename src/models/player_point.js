import GraphicalPoint from "./graphical_point";

export default class PlayerPoint {
    constructor(x, y, gridSize, padding, player) {
        this.player = player;
        this.graphicalPoint = new GraphicalPoint(padding + x * gridSize, padding + y * gridSize, player.color);
        this.x = x;
        this.y = y;
        this.dead = false;
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
        return this.player.textRepresentation;
    }
}
