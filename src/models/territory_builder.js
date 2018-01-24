// bug algorithm used (obstacle avoidance)
import Territory from "./territory";

export default class TerritoryBuilder {
    constructor(areasLayers, playerPointsMap) {
        this.areasLayers = areasLayers;
        this.playerPointsMap = playerPointsMap;
    }

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
}