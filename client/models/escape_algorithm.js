import TerritoryBuilder from "./territory_builder";

export default class EscapeAlgorithm {
    constructor(xCells, yCells, playerPointsMap, territories, playerList) {
        this.yCells = yCells;
        this.xCells = xCells;
        this.pointsMap = playerPointsMap;
        this.territoryBuilder = new TerritoryBuilder(territories, playerPointsMap);
        this.playerList = playerList;
    }

    isDead(point) {
        let res;

        if (point.x === 0 || point.y === 0 || point.x === this.xCells - 1 || point.y === this.yCells - 1) {
            return false;
        }

        for (let player of this.playerList.filter((player) => player !== point.player)) {
            if (res = !this._tryFast(point) && !this._trySlow(point, player)) {
                player.setScore(player.score + 1);
                point.killedBy(player);
                return res;
            }
        }

        return res;
    }

    _trySlow(point, player) {
        let toVisit = [[point.x, point.y]];
        let slowEscapeMarkedMap = new Array(this.yCells);
        for (let i = 0; i < this.yCells; i++) {
            slowEscapeMarkedMap[i] = new Array(this.xCells);
        }
        slowEscapeMarkedMap[point.y][point.x] = 1;
        let territorySize = 1;
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

                if (slowEscapeMarkedMap[y][x] || this.pointsMap[y][x] && !this.pointsMap[y][x].dead && this.pointsMap[y][x].player === player) {
                    continue;
                } else {
                    // TODO possible bug
                    if (x === 0 || y === 0 || x === this.xCells - 1 || y === this.yCells - 1) {
                        return true;
                    } else {
                        slowEscapeMarkedMap[y][x] = 1;
                        toVisit.push([x, y]);
                        territorySize++;
                    }
                }
            }

            toVisit.shift();
        }

        this.territoryBuilder.createTerritoryAround(slowEscapeMarkedMap, player, territorySize);

        return false;
    }

    _tryFast(point) {
        let y = point.y;
        let x = point.x;

        let escaped = true;

        for (let x = point.x; x >= 0; x--) {
            if (this.pointsMap[y][x] && !this.pointsMap[y][x].dead && this.pointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let x = point.x; x < this.xCells; x++) {
            if (this.pointsMap[y][x] && !this.pointsMap[y][x].dead && this.pointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let y = point.y; y >= 0; y--) {
            if (this.pointsMap[y][x] && !this.pointsMap[y][x].dead && this.pointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let y = point.y; y < this.yCells; y++) {
            if (this.pointsMap[y][x] && !this.pointsMap[y][x].dead && this.pointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        return escaped;
    }


}