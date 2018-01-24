import TerritoryBuilder from "./territory_builder";

export default class EscapeAlgorithm {
    constructor(xCells, yCells, playerPointsMap, areasLayers) {
        this.yCells = yCells;
        this.xCells = xCells;
        this.playerPointsMap = playerPointsMap;
        this.territoryBuilder = new TerritoryBuilder(areasLayers, playerPointsMap)
    }

    isDead(point) {
        return !this._tryFast(point) && !this._trySlow(point);
    }

    _trySlow(point) {
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

        this.territoryBuilder.createTerritoryAround(slowEscapeMarkedMap, player);

        return false;
    }

    _tryFast(point) {
        let y = point.y;
        let x = point.x;

        let escaped = true;

        for (let x = point.x; x >= 0; x--) {
            if (this.playerPointsMap[y][x] && !this.playerPointsMap[y][x].dead && this.playerPointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let x = point.x; x < this.xCells; x++) {
            if (this.playerPointsMap[y][x] && !this.playerPointsMap[y][x].dead && this.playerPointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let y = point.y; y >= 0; y--) {
            if (this.playerPointsMap[y][x] && !this.playerPointsMap[y][x].dead && this.playerPointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        if (escaped) return true;

        escaped = true;

        for (let y = point.y; y < this.yCells; y++) {
            if (this.playerPointsMap[y][x] && !this.playerPointsMap[y][x].dead && this.playerPointsMap[y][x].player !== point.player) {
                escaped = false;
                break;
            }
        }

        return escaped;
    }


}