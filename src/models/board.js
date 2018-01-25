import PlayerPoint from "./player_point";
import EscapeAlgorithm from "./escape_algorithm";

export default class Board {
    constructor(width, height, playerList) {
        this.gridSize = 30;
        this.padding = 10;
        this.width = width;
        this.height = height;
        this.color = "#c4c4cc";
        this.xCells = this.yCells = 18;
        this.playerPoints = [];

        this.playerPointsMap = new Array(this.yCells);
        for (let i = 0; i < this.yCells; i++) {
            this.playerPointsMap[i] = new Array(this.xCells);
        }
        this.territories = {};
        this.playerList = playerList;
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
        let t0 = performance.now();

        if (new EscapeAlgorithm(this.xCells, this.yCells, this.playerPointsMap, this.territories, this.playerList).isDead(newPoint))
            newPoint.dead = true;

        for (let i = 0; i < this.playerPoints.length; i++) {
            if (this.playerPoints[i].player === newPoint.player) continue;
            if (this.playerPoints[i].dead) continue;
            new EscapeAlgorithm(this.xCells, this.yCells, this.playerPointsMap, this.territories, this.playerList).isDead(this.playerPoints[i])
        }
        let t1 = performance.now();
        console.log("#findDeadPoints took " + (t1 - t0) + " milliseconds.");
    }

    drawBackground(ctx) {
        ctx.beginPath();
        for (let y = 1; y <= this.yCells; y++) {
            ctx.moveTo((y - 1) * this.gridSize + this.padding, this.padding);
            ctx.lineTo((y - 1) * this.gridSize + this.padding, (this.yCells - 1) * (this.gridSize) + this.padding);
        }

        for (let x = 1; x <= this.xCells; x++) {
            ctx.moveTo(this.padding, (x - 1) * this.gridSize + this.padding);
            ctx.lineTo((this.xCells - 1) * (this.gridSize) + this.padding, (x - 1) * this.gridSize + this.padding);
        }
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.closePath();
    }

    draw(ctx) {
        this.playerPoints.forEach(i => {
            if (i.dead) i.draw(ctx)
        });
        
        for (let playerColor in this.territories) {
            ctx.save();
            this.territories[playerColor].forEach(territory => {
                territory.draw(ctx, this.gridSize, this.padding)
            });
            ctx.restore();
        }

        this.playerPoints.forEach(i => {
            if (!i.dead) i.draw(ctx)
        });
    }

    maxWidth() {
        return (this.xCells - 1) * this.gridSize + this.padding;
    }

    maxHeight() {
        return (this.yCells - 1) * this.gridSize + this.padding;
    }

    toString() {
        let str = "";

        for (let y = 0; y < this.yCells; y++) {
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
