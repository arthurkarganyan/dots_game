import PlayerPoint from "./player_point";
import EscapeAlgorithm from "./../services/escape_algorithm";

export default class Board {
    constructor(width, height, playerList) {
        this.gridSize = 28;
        this.padding = 10;
        this.width = width;
        this.height = height;
        this.color = "#c4c4cc";
        this.xCells = this.yCells = 18;
        let playerPoints = [];
        this.getPlayerPoints = () => playerPoints;

        this.pointsMap = new Array(this.yCells);
        for (let i = 0; i < this.yCells; i++) {
            this.pointsMap[i] = new Array(this.xCells);
        }

        this.territories = {};
        this.playerList = playerList;

        let pointsCount = 0;
        this._incPointsCount = () => pointsCount++;
        let that = this;

        this.getTerritoryOccupied = () => Math.round(playerList.reduce((sum, i) => {
            return sum + 100 * (i.territoryOccupied() / (that.yCells * that.xCells));
        }, 0));
    }

    addPlayerPoint(x, y, player) {
        if (this.pointsMap[y][x] !== undefined)
            return false;

        const newPoint = new PlayerPoint(x, y, this.gridSize, this.padding, player);
        this.getPlayerPoints().push(newPoint);
        this.pointsMap[y][x] = newPoint;

        this.findDeadPoints(newPoint);

        this._incPointsCount();

        try {
            document.querySelector("#territory #percent").innerText = this.getTerritoryOccupied() + "%";
        } catch (e) {
        }

        player.livePointsCount++;

        return true;
    }

    findDeadPoints(newPoint) {
        if (new EscapeAlgorithm(this.xCells, this.yCells, this.pointsMap, this.territories, this.playerList).isDead(newPoint))
            newPoint.dead = true;

        for (let i = 0; i < this.getPlayerPoints().length; i++) {
            if (this.getPlayerPoints()[i].player === newPoint.player) continue;
            if (this.getPlayerPoints()[i].dead) continue;
            new EscapeAlgorithm(this.xCells, this.yCells, this.pointsMap, this.territories, this.playerList).isDead(this.getPlayerPoints()[i])
        }
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
        this.getPlayerPoints().forEach(i => {
            if (i.dead) i.draw(ctx)
        });

        for (let playerColor in this.territories) {
            ctx.save();
            this.territories[playerColor].forEach(territory => {
                territory.draw(ctx, this.gridSize, this.padding)
            });
            ctx.restore();
        }

        this.getPlayerPoints().forEach(i => {
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
                if (this.pointsMap[y][x]) {
                    str += this.pointsMap[y][x].textRepresentation();
                } else {
                    str += " ";
                }
            }
            str += "|\n";
        }

        return str;
    }
}
