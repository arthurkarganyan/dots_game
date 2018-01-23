import GraphicalObject from "./graphical_object";

export default class GraphicalPoint {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 7;
        this.color = color;
    }

    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 0;
        ctx.fill();
        // this.ctx.stroke();
        ctx.closePath()
    }
}