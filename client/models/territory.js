export default class Territory {
    constructor(player, innerSize) {
        // this.getPlayer() = player;
        this.points = [];

        let _player = player;
        this.getPlayer = function() { return _player; };
        this.getInnerSize = function() { return innerSize; }
    }

    size() {
        return this.points.length;
    }

    forEach(f) {
        this.points.forEach(f);
    }

    clone() {
        let t = new Territory(this.getPlayer());
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
        return `${this.getPlayer().toString()}: (size: ${this.size()})`;
    }

    coords() {
        return this.points.map((point) => [point.x, point.y]);
    }

    firstPoint() {
        return this.points[0];
    }

    draw(ctx, gridSize, padding) {
        ctx.strokeStyle = this.getPlayer().color;
        ctx.fillStyle = this.getPlayer().backColor;
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