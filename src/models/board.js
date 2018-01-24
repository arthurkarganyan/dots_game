import PlayerPoint from "./player_point";
import EscapeAlgorithm from "./escape_algorithm";

export default class Board {
    constructor(width, height) {
        this.gridSize = 40;
        this.padding = 15;
        this.width = width;
        this.height = height;
        this.color = "#3366cc";
        this.xCells = this.yCells = 15;
        this.playerPoints = [];

        this.playerPointsMap = new Array(this.yCells);
        for (let i = 0; i < this.yCells; i++) {
            this.playerPointsMap[i] = new Array(this.xCells);
        }
        this.areasLayers = {};
    }

    addPlayerPoint(x, y, player) {
        if (this.playerPointsMap[y][x] !== undefined)
            return false;

        const newPoint = new PlayerPoint(x, y, this.gridSize, this.padding, player);
        this.playerPoints.push(newPoint);
        this.playerPointsMap[y][x] = newPoint;

        this.findDeadPoints(newPoint);

        return true;
    }

    findDeadPoints(newPoint) {
        if (new EscapeAlgorithm(this.xCells, this.yCells, this.playerPointsMap, this.areasLayers).isDead(newPoint))
            newPoint.dead = true;

        for (let i = 0; i < this.playerPoints.length; i++) {
            if (this.playerPoints[i].player === newPoint.player) continue;
            if (this.playerPoints[i].dead) continue;
            if (new EscapeAlgorithm(this.xCells, this.yCells, this.playerPointsMap, this.areasLayers).isDead(this.playerPoints[i]))
                this.playerPoints[i].dead = true;
        }
    }


    draw(ctx) {
        ctx.beginPath();
        for (let y = 0; y <= this.yCells; y++) {
            ctx.moveTo(0.5 + y * this.gridSize + this.padding, this.padding);
            ctx.lineTo(0.5 + y * this.gridSize + this.padding, this.yCells * (this.gridSize + 0.5));
        }

        for (let x = 0; x <= this.xCells; x++) {
            ctx.moveTo(this.padding, 0.5 + x * this.gridSize + this.padding);
            ctx.lineTo(this.xCells * (this.gridSize + 0.5), 0.5 + x * this.gridSize + this.padding);
        }

        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();

        for (let playerColor in this.areasLayers) {
            ctx.save();
            this.areasLayers[playerColor].forEach(territory => {
                territory.draw(ctx, this.gridSize, this.padding)
            });
            ctx.restore();
        }

        this.playerPoints.forEach(i => {
            if (i.dead) i.draw(ctx)
        });
        this.playerPoints.forEach(i => {
            if (!i.dead) i.draw(ctx)
        });
    }

    maxWidth() {
        return this.xCells * this.gridSize + this.padding;
    }

    maxHeight() {
        return this.yCells * this.gridSize + this.padding;
    }

    toString() {
        let str = "";

        for (let y = 0; y < this.xCells; y++) {
            str += '|';
            for (let x = 0; x < this.xCells; x++) {
                if (this.playerPointsMap[y][x]) {
                    str += this.playerPointsMap[y][x].textRepresentation();
                } else {
                    str += " ";
                }
            }
            str += "|\n";
        }

        return str;
    }
}
