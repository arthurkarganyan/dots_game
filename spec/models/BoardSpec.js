import Board from "../../src/models/board";
import Player from "../../src/models/player";

require('jasmine-collection-matchers');

describe("Board", function () {
    let redPlayer;
    let bluePlayer;
    let board;

    beforeEach(function () {
        redPlayer = Player.build("red");
        bluePlayer = Player.build("blue");
        board = new Board(undefined, undefined);
    });

    let massPoints = (coordsArray, player) => {
        coordsArray.forEach(i => {
            board.addPlayerPoint(i[0], i[1], player);
        });
    };

    it("fastEscapeAlgorithm", function () {
        board.addPlayerPoint(1, 1, redPlayer);
        expect(board.playerPointsMap[1][1]).toBeDefined();

        expect(board.playerPointsMap[1][1].dead).toBe(false);
        board.addPlayerPoint(0, 1, bluePlayer);
        expect(board.playerPointsMap[1][1].dead).toBe(false);
        board.addPlayerPoint(1, 0, bluePlayer);
        expect(board.playerPointsMap[1][1].dead).toBe(false);
        board.addPlayerPoint(1, 2, bluePlayer);
        expect(board.playerPointsMap[1][1].dead).toBe(false);
        board.addPlayerPoint(2, 1, bluePlayer);
        expect(board.playerPointsMap[1][1].dead).toBe(true);

        console.log("\n" + board.toString());
    });

    it("slowEscapeAlgorithm", function () {
        board.addPlayerPoint(1, 1, redPlayer);
        expect(board.playerPointsMap[1][1]).toBeDefined();

        expect(board.playerPointsMap[1][1].dead).toBe(false);
        board.addPlayerPoint(0, 1, bluePlayer);
        expect(board.playerPointsMap[1][1].dead).toBe(false);
        board.addPlayerPoint(1, 0, bluePlayer);
        expect(board.playerPointsMap[1][1].dead).toBe(false);
        board.addPlayerPoint(1, 2, bluePlayer);
        expect(board.playerPointsMap[1][1].dead).toBe(false);
        board.addPlayerPoint(3, 1, bluePlayer);
        expect(board.playerPointsMap[1][1].dead).toBe(false);

        console.log("\n" + board.toString());
    });

    it("slowEscapeAlgorithm #2", function () {
        board.addPlayerPoint(2, 3, redPlayer);
        board.addPlayerPoint(3, 3, redPlayer);
        expect(board.playerPointsMap[3][2]).toBeDefined();
        expect(board.playerPointsMap[3][3]).toBeDefined();

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

        expect(board.playerPointsMap[3][2].dead).toBe(false);
        expect(board.playerPointsMap[3][3].dead).toBe(false);

        board.addPlayerPoint(5, 2, bluePlayer);

        console.log("\n" + board.toString());

        expect(board.playerPointsMap[3][2].dead).toBe(true);
        expect(board.playerPointsMap[3][3].dead).toBe(true);

        expect(board.areasLayers[bluePlayer][0]).toBeDefined();
        expect(board.areasLayers[bluePlayer][0].size()).not.toBe(0);

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
            // console.log(board.areasLayers[bluePlayer][0].coords()[i] + " | " + trace[i]);
        }

        expect(board.areasLayers[bluePlayer][0].coords()).toHaveSameItems(trace);
        expect(board.areasLayers[bluePlayer].length).toBe(1);
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

        expect(board.playerPointsMap[2][2].dead).toBe(true);
        expect(board.playerPointsMap[3][1].dead).toBe(false);

        console.log("\n" + board.toString());

        expect(board.areasLayers[bluePlayer][0]).toBeDefined();
        expect(board.areasLayers[bluePlayer][0].size()).not.toBe(0);

        for (let i = 0; i < trace.length; i++) {
            console.log(board.areasLayers[bluePlayer][0].coords()[i] + " | " + trace[i]);
        }

        expect(board.areasLayers[bluePlayer][0].coords()).toHaveSameItems(trace);
        expect(board.areasLayers[bluePlayer].length).toBe(1);
    });

    fit("slowEscapeAlgorithm #4", function () {
        // board.addPlayerPoint(1, 3, redPlayer);

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
        expect(board.playerPointsMap[2][2].dead).toBe(true);

        console.log("\n" + board.toString());

        // expect(board.areasLayers[bluePlayer][0]).toBeDefined();
        // expect(board.areasLayers[bluePlayer][0].size()).not.toBe(0);
        //
        // for (let i = 0; i < trace.length; i++) {
        //     console.log(board.areasLayers[bluePlayer][0].coords()[i] + " | " + trace[i]);
        // }
        //
        // expect(board.areasLayers[bluePlayer][0].coords()).toHaveSameItems(trace);
        // expect(board.areasLayers[bluePlayer].length).toBe(1);
    });
});
