import GraphicalObject from "./graphical_object";
import PlayerPoint from "./player_point";
import _ from 'underscore';

class Territory {
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

    containingRect() {
        if (this.containingRectValue)
            return this.containingRectValue;

        let minX = 1000;
        let minY = 1000;
        let maxX = -1;
        let maxY = -1;

        this.points.forEach(point => {
            if (point.x < minX) minX = point.x;
            if (point.y < minY) minY = point.y;
            if (point.x > maxX) maxX = point.x;
            if (point.y > maxY) maxY = point.y;
        });

        this.containingRectValue = [minX, minY, maxX, maxY];
        return this.containingRectValue;
    }

    toString() {
        return `${this.player.toString()}:${this.containingRect()} (size: ${this.size()})`;
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

        // this.calculateCapturedArea(newPoint.x, newPoint.y, newPoint, new Territory(player));
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

        for (let i = 0; i < this.areasLayers[player.colorName].length; i++) {
            if (this.areasLayers[player.colorName][i].firstPoint().x === bug.x &&
                this.areasLayers[player.colorName][i].firstPoint().y === bug.y) return;
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
            )
                territory.push(this.playerPointsMap[bug.y][bug.x]);

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

            // let str = "";
            //
            // for (let y = 0; y < this.xCells; y++) {
            //     str += '|';
            //     for (let x = 0; x < this.xCells; x++) {
            //         if (slowEscapeMarkedMap[y][x]) {
            //             str += slowEscapeMarkedMap[y][x];
            //         } else {
            //             str += " ";
            //         }
            //     }
            //     str += "|\n";
            // }
            //
            // console.log(str);


            toVisit.shift();
        }

        this.createTerritoryAround(slowEscapeMarkedMap, player);

        return false;
        // let distance = slowEscapeMarkedMap[x2][y2];
        // return [slowEscapeMarkedMap, distance];
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

    remapArea() {
        for (let player in this.areasLayers) {
            for (let i = 0; i < this.areasLayers[player.colorName].length; i++) {
                let territory = this.areasLayers[player.colorName][i];

                // array.splice(index, 1);
            }
        }
    }

    // Uniqness check
    addLayer(territory) {
        let player = territory.player;
        let playerLayer = this.areasLayers[player.colorName];

        if (playerLayer === undefined) {
            return this.areasLayers[player.colorName] = [territory];
        }

        for (let i = 0; i < playerLayer.length; i++) {
            let a = JSON.stringify(_.sortBy(playerLayer[i].points, (x) => 1000 * x.x + x.y));
            let b = JSON.stringify(_.sortBy(territory.points, (x) => 1000 * x.x + x.y));

            if (a === b) {
                console.log("Filtered!");
                return;
            }
        }

        // debugger;
        for (let i = 0; i < playerLayer.length; i++) {
            if (playerLayer[i].containingRect().toString() === territory.containingRect().toString() && playerLayer[i].size() <= territory.size()) {
                playerLayer.splice(i, 1);
            }
        }

        return playerLayer.push(territory);
    }

    calculateCapturedArea(x, y, newPoint, territory) {
        if (x === newPoint.x && y === newPoint.y && territory.size() >= 1 && territory.size() <= 3) {
            console.log("???");
            return;
        }

        let coordinates = [
            {x: x - 1, y: y - 1},
            {x: x, y: y - 1},
            {x: x + 1, y: y - 1},
            {x: x - 1, y: y},
            {x: x + 1, y: y},
            {x: x - 1, y: y + 1},
            {x: x, y: y + 1},
            {x: x + 1, y: y + 1}
        ].filter(point => point.x > -1 && point.x <= this.xCells && point.y > -1 && point.y <= this.yCells &&
            this.playerPointsMap[point.y][point.x] && this.playerPointsMap[point.y][point.x].player === newPoint.player);

        if (territory.size() >= 3) {
            coordinates.forEach((i) => {
                if (i.x === territory.at(0).x && i.y === territory.at(0).y) {
                    territory.push({x: x, y: y});
                    console.log(`Found: ${territory.size()}!`);
                    this.addLayer(territory);

                    return territory;
                }
            });
        }

        territory.forEach(i => {
            coordinates = coordinates.filter(j => j.x !== i.x || j.y !== i.y)
        });

        if (coordinates.length === 0) return;

        territory.push({x: x, y: y});

        for (let i = 0; i < coordinates.length; i++) {
            let a = coordinates[i];

            this.calculateCapturedArea(a.x, a.y, newPoint, territory.clone());
        }

        return false
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

        this.playerPoints.forEach(i => i.draw(ctx));
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
