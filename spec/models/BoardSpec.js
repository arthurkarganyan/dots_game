import Board from "../../client/models/board";
import Player from "../../client/models/player";

require('jasmine-collection-matchers');

describe("Board", function () {
    let redPlayer;
    let bluePlayer;
    let players;
    let board;

    beforeEach(function () {
        redPlayer = Player.build("red");
        bluePlayer = Player.build("blue");
        players = [redPlayer, bluePlayer];
        board = new Board(undefined, undefined, players);
    });

    afterEach(() => console.log("\n" + board.toString()));

    let massPoints = (coordsArray, player) => {
        coordsArray.forEach(i => {
            board.addPlayerPoint(i[0], i[1], player);
        });
    };

    describe("two players", function () {

        it("fastEscapeAlgorithm", function () {
            board.addPlayerPoint(1, 1, redPlayer);
            expect(board.pointsMap[1][1]).toBeDefined();

            expect(board.pointsMap[1][1].dead).toBe(false);
            board.addPlayerPoint(0, 1, bluePlayer);
            expect(board.pointsMap[1][1].dead).toBe(false);
            board.addPlayerPoint(1, 0, bluePlayer);
            expect(board.pointsMap[1][1].dead).toBe(false);
            board.addPlayerPoint(1, 2, bluePlayer);
            expect(board.pointsMap[1][1].dead).toBe(false);
            board.addPlayerPoint(2, 1, bluePlayer);
            expect(board.pointsMap[1][1].dead).toBe(true);

            expect(bluePlayer.score).toBe(1);
            expect(redPlayer.score).toBe(0);
        });

        it("slowEscapeAlgorithm", function () {
            board.addPlayerPoint(1, 1, redPlayer);
            expect(board.pointsMap[1][1]).toBeDefined();

            expect(board.pointsMap[1][1].dead).toBe(false);
            board.addPlayerPoint(0, 1, bluePlayer);
            expect(board.pointsMap[1][1].dead).toBe(false);
            board.addPlayerPoint(1, 0, bluePlayer);
            expect(board.pointsMap[1][1].dead).toBe(false);
            board.addPlayerPoint(1, 2, bluePlayer);
            expect(board.pointsMap[1][1].dead).toBe(false);
            board.addPlayerPoint(3, 1, bluePlayer);
            expect(board.pointsMap[1][1].dead).toBe(false);
        });

        it("slowEscapeAlgorithm #2", function () {
            board.addPlayerPoint(2, 3, redPlayer);
            board.addPlayerPoint(3, 3, redPlayer);
            expect(board.pointsMap[3][2]).toBeDefined();
            expect(board.pointsMap[3][3]).toBeDefined();

            massPoints([
                [2, 1],
                [1, 2],
                [1, 3],
                [2, 4],
                [3, 5],
                [4, 4],
                [3, 1],
                [4, 1],
                [4, 3]], bluePlayer
            );

            expect(board.pointsMap[3][2].dead).toBe(false);
            expect(board.pointsMap[3][3].dead).toBe(false);

            board.addPlayerPoint(5, 2, bluePlayer);

            expect(board.pointsMap[3][2].dead).toBe(true);
            expect(board.pointsMap[3][3].dead).toBe(true);

            expect(board.territories[bluePlayer.colorName][0]).toBeDefined();
            expect(board.territories[bluePlayer.colorName][0].size()).not.toBe(0);

            let trace = [
                [3, 1],
                [4, 1],
                [5, 2],
                [4, 3],
                [4, 4],
                [3, 5],
                [2, 4],
                [1, 3],
                [1, 2],
                [2, 1]];


            for (let i = 0; i < trace.length; i++) {
                console.log(board.territories[bluePlayer.colorName][0].coords()[i] + " | " + trace[i]);
            }

            expect(board.territories[bluePlayer.colorName][0].coords()).toHaveSameItems(trace);
            expect(board.territories[bluePlayer.colorName].length).toBe(1);
            expect(bluePlayer.score).toBe(2);
            expect(board.territories[bluePlayer.colorName][0].getInnerSize()).toBe(6);
        });

        it("slowEscapeAlgorithm #3", function () {
            board.addPlayerPoint(2, 2, redPlayer);
            board.addPlayerPoint(1, 3, redPlayer);

            massPoints([
                [1, 1],
                [2, 1],
                [3, 2],
                [2, 3],
                [1, 2],
            ], bluePlayer);

            let trace = [
                [3, 2],
                [2, 3],
                [1, 2],
                [1, 1],
                [2, 1],
            ];

            expect(board.pointsMap[2][2].dead).toBe(true);
            expect(board.pointsMap[3][1].dead).toBe(false);

            expect(board.territories[bluePlayer.colorName][0]).toBeDefined();
            expect(board.territories[bluePlayer.colorName][0].size()).not.toBe(0);

            for (let i = 0; i < trace.length; i++) {
                console.log(board.territories[bluePlayer.colorName][0].coords()[i] + " | " + trace[i]);
            }

            expect(board.territories[bluePlayer.colorName][0].coords()).toHaveSameItems(trace);
            expect(board.territories[bluePlayer.colorName].length).toBe(1);
        });

        it("slowEscapeAlgorithm #4", function () {
            massPoints([
                [2, 1],
                [3, 2],
                [2, 3],
                [1, 2],
            ], redPlayer);

            massPoints([
                [3, 1],
                [4, 2],
                [3, 3],
            ], bluePlayer);

            board.addPlayerPoint(2, 2, bluePlayer);
            expect(board.pointsMap[2][2].dead).toBe(true);
            expect(board.pointsMap[2][3].dead).toBe(false);
            expect(Object.values(board.territories).length).toBe(1);
            expect(board.territories[redPlayer.colorName].length).toBe(1);
        });

        it("slowEscapeAlgorithm #4 uniq", function () {
            massPoints([
                [3, 1],
                [4, 1],
                [5, 2],
                [1, 3],
                [5, 3],
                [2, 4],
                [4, 4],
                [5, 3],
                [3, 3],
            ], redPlayer);

            massPoints([
                [3, 2],
                [4, 2],
                [2, 3],
                [4, 3],
                [3, 4],
            ], bluePlayer);

            board.addPlayerPoint(3, 5, redPlayer);
            board.addPlayerPoint(2, 2, redPlayer);
            // expect(Object.values(board.territories).length).toBe(1);
            expect(board.territories[redPlayer.colorName].length).toBe(1);

            expect(bluePlayer.score).toBe(1);
            expect(redPlayer.score).toBe(5);
        });

        it("slowEscapeAlgorithm #4 uniq #2", function () {
            board.addPlayerPoint(3, 3, redPlayer);
            massPoints([
                [3, 2],
                [2, 3],
                [3, 4],
                [4, 3],
            ], bluePlayer);

            massPoints([
                [3, 1],
                [4, 2],
                [5, 3],
                [1, 3],
                [2, 4],
                [3, 5],
                [2, 2],
                [4, 4],
            ], redPlayer);

            expect(board.territories[redPlayer.colorName].length).toBe(1);
            // console.log(board.territories[redPlayer.colorName].map((i) => i.firstPoint()))
        });
    });

    describe("3 players", function () {
        let greenPlayer;

        beforeEach(function () {
            greenPlayer = Player.build("green");
            players = [redPlayer, greenPlayer, bluePlayer];
            board = new Board(undefined, undefined, players); // FIXME dirty hack
        });

        it("3 players", function () {
            board.addPlayerPoint(2, 2, bluePlayer);
            massPoints([
                [2, 1],
                [1, 2],
                [2, 3],
            ], redPlayer);
            board.addPlayerPoint(3, 2, greenPlayer);

            expect(board.pointsMap[2][2].dead).toBe(false);

            massPoints([
                [3, 1],
                [4, 2],
                [3, 3],
            ], redPlayer);

            expect(board.pointsMap[2][2].dead).toBe(true);
            expect(board.pointsMap[2][3].dead).toBe(true);

            expect(board.territories[redPlayer.colorName][0].getInnerSize()).toBe(2);
            // console.log(board.territories[redPlayer.colorName].map((i) => i.firstPoint()))
        });
    })
});
