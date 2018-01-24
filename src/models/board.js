import PlayerPoint from "./player_point";
import Territory from "./territory";

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

    // TODO refactoring
    findDeadPoints(newPoint) {
        if (!this.fastEscapeAlgorithm(newPoint)) {
            if (!this.slowEscapeAlgorithm(newPoint)) {
                newPoint.dead = true;
            }
        }

        for (let i = 0; i < this.playerPoints.length; i++) {
            if (this.playerPoints[i].player === newPoint.player) continue;
            if (this.playerPoints[i].dead) continue;

            if (!this.fastEscapeAlgorithm(this.playerPoints[i])) {

                if (!this.slowEscapeAlgorithm(this.playerPoints[i])) {
                    this.playerPoints[i].dead = true;
                }
            }
        }
    }

    // bug algorithm used (obstacle avoidance)
    createTerritoryAround(failedEscapeMap, player) {
        if (!this.areasLayers[player.colorName]) this.areasLayers[player.colorName] = [];

        let territory = new Territory(player);
        let bug = {xStart: -1, yStart: -1, x: -1, y: -1, direction: "right"};

        outerLoop:
            for (let y = 0; y < failedEscapeMap.length; y++) {
                for (let x = 0; x < failedEscapeMap.length; x++) {
                    if (failedEscapeMap[y][x]) {
                        bug.y = bug.yStart = y - 1;
                        bug.xStart = x;
                        bug.x = x + 1;
                        break outerLoop;
                    }
                }
            }

        let atCornerCheck = () => {
            if (bug.direction === "down" && !failedEscapeMap[bug.y][bug.x - 1]) return bug.direction = "left";
            if (bug.direction === "right" && !failedEscapeMap[bug.y + 1][bug.x]) return bug.direction = "down";
            if (bug.direction === "up" && !failedEscapeMap[bug.y][bug.x + 1]) return bug.direction = "right";
            if (bug.direction === "left" && !failedEscapeMap[bug.y - 1][bug.x]) return bug.direction = "up";
        };

        let obstacleCheck = () => {
            if (bug.direction === "down" && failedEscapeMap[bug.y + 1][bug.x]) return bug.direction = "right";
            if (bug.direction === "right" && failedEscapeMap[bug.y][bug.x + 1]) return bug.direction = "up";
            if (bug.direction === "up" && failedEscapeMap[bug.y - 1][bug.x]) return bug.direction = "left";
            if (bug.direction === "left" && failedEscapeMap[bug.y][bug.x - 1]) return bug.direction = "down";
        };

        let move = () => {
            if (bug.direction === "down") return bug.y++;
            if (bug.direction === "right") return bug.x++;
            if (bug.direction === "up") return bug.y--;
            if (bug.direction === "left") return bug.x--;
        };

        while (bug.yStart !== bug.y || bug.xStart !== bug.x) {
            // TODO possible bug when is another dot owned by 3rd player

            if (this.playerPointsMap[bug.y][bug.x] && this.playerPointsMap[bug.y][bug.x].player === player &&
                territory.points.slice(-1)[0] !== this.playerPointsMap[bug.y][bug.x] // uniqueness check
            ) {
                if (territory.size() === 0) {
                    for (let i = 0; i < this.areasLayers[player.colorName].length; i++) {
                        if (this.areasLayers[player.colorName][i].firstPoint().x === bug.x &&
                            this.areasLayers[player.colorName][i].firstPoint().y === bug.y) return;
                    }
                }
                territory.push(this.playerPointsMap[bug.y][bug.x]);
            }

            atCornerCheck();
            obstacleCheck();
            move();
        }

        territory.push(this.playerPointsMap[bug.yStart][bug.xStart]);

        this.areasLayers[player.colorName].push(territory);
    }

    slowEscapeAlgorithm(point) {
        let toVisit = [[point.x, point.y]];

        let slowEscapeMarkedMap = new Array(this.yCells);
        for (let i = 0; i < this.yCells; i++) {
            slowEscapeMarkedMap[i] = new Array(this.xCells);
        }

        slowEscapeMarkedMap[point.y][point.x] = 1;
        let player;

        while (toVisit.length) { // While there are still squares to visit
            let arr = [
                [toVisit[0][0] - 1, toVisit[0][1]],
                [toVisit[0][0] + 1, toVisit[0][1]],
                [toVisit[0][0], toVisit[0][1] - 1],
                [toVisit[0][0], toVisit[0][1] + 1]
            ];

            for (let i = 0; i < arr.length; i++) {
                let x;
                let y;
                [x, y] = arr[i];

                if (slowEscapeMarkedMap[y][x] || this.playerPointsMap[y][x] && !this.playerPointsMap[y][x].dead && this.playerPointsMap[y][x].player !== point.player) {
                    if (this.playerPointsMap[y][x] && !this.playerPointsMap[y][x].dead && this.playerPointsMap[y][x].player !== point.player) {
                        player = this.playerPointsMap[y][x].player
                    }
                    continue;
                } else {
                    toVisit.push([x, y]);
                }

                // TODO possible bug
                if (x === 0 || y === 0 || x === this.xCells - 1 || y === this.yCells) {
                    return true;
                }

                slowEscapeMarkedMap[y][x] = 1;
            }

            toVisit.shift();
        }

        this.createTerritoryAround(slowEscapeMarkedMap, player);

        return false;
    }

    fastEscapeAlgorithm(point) {
        let y = point.y;
        let x = point.x;

        let escaped = true;

        for (let x = point.x; x >= 0; x--) {
            if (this.playerPointsMap[y][x] && this.playerPointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let x = point.x; x < this.xCells; x++) {
            if (this.playerPointsMap[y][x] && this.playerPointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let y = point.y; y >= 0; y--) {
            if (this.playerPointsMap[y][x] && this.playerPointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let y = point.y; y < this.yCells; y++) {
            if (this.playerPointsMap[y][x] && this.playerPointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        return escaped;
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

        // TODO refactoring to Territory

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
