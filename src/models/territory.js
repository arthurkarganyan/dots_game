export default class Territory {
    constructor(player) {
        this.player = player;
        this.points = []
    }

    size() {
        return this.points.length;
    }

    forEach(f) {
        this.points.forEach(f);
    }

    clone() {
        let t = new Territory(this.player);
        t.points = this.points.slice(0);
        return t;
    }

    at(index) {
        return this.points[index];
    }

    push(point) {
        return this.points.push(point);
    }

    toString() {
        return `${this.player.toString()}: (size: ${this.size()})`;
    }

    coords() {
        return this.points.map((point) => [point.x, point.y]);
    }

    firstPoint() {
        return this.points[0];
    }

    draw(ctx, gridSize, padding) {
        ctx.strokeStyle = this.player.color;
        ctx.fillStyle = this.player.backColor;
        ctx.lineWidth = 3;

        ctx.beginPath();

        ctx.moveTo(gridSize * this.at(0).x + padding, gridSize * this.at(0).y + padding);

        this.points.slice(1).forEach(i => {
            ctx.lineTo(gridSize * i.x + padding, gridSize * i.y + padding);
        });

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}