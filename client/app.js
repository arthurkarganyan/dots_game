import GraphicalPoint from './models/graphical_point';
import Board from './models/board';
import Player from "./models/player";
import ScoreBoard from "./models/score_board";

const canvasForeground = document.querySelector('canvas.foreground');
const ctxForeground = canvasForeground.getContext('2d');

canvasForeground.width = innerWidth;
canvasForeground.height = innerHeight;

const canvasBackground = document.querySelector('canvas.background');
const ctxBackground = canvasBackground.getContext('2d');

canvasBackground.width = innerWidth;
canvasBackground.height = innerHeight;


const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

let currentPlayer = Player.build("red");
const players = [];

players.push(currentPlayer);
players.push(Player.build("blue"));
players.push(Player.build("green"));

const scoreBoard = new ScoreBoard(document.querySelector('#score'), players);

let playerTurnIndex = 0;

addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    animate();
});

addEventListener('click', event => {
    if (board.addPlayerPoint(~~((mousePoint.x - board.padding) / board.gridSize), ~~((mousePoint.y - board.padding) / board.gridSize), currentPlayer)) {
        if (playerTurnIndex === players.length - 1) {
            playerTurnIndex = 0;
        } else {
            playerTurnIndex++;
        }
        currentPlayer = players[playerTurnIndex];
        mousePoint.color = currentPlayer.color;
        scoreBoard.refresh();

        ws.send(mousePoint.x + "," + mousePoint.y);
    }

    animate();
});

addEventListener('resize', () => {
    canvasForeground.width = innerWidth;
    canvasForeground.height = innerHeight;
    canvasBackground.width = innerWidth;
    canvasBackground.height = innerHeight;
    board.height = canvasForeground.height;
    board.width = canvasForeground.width;
    board.drawBackground(ctxBackground);
    animate();
});

let objects = [];
const board = new Board(canvasForeground.width, canvasForeground.height, players);
const mousePoint = new GraphicalPoint(-1, -1, currentPlayer.color, 4);

objects.push(board);
objects.push(mousePoint);

let t0 = performance.now();
for (let i = 0; i < 50; i++) {
    !board.addPlayerPoint(
        ~~(Math.random() * board.xCells),
        ~~(Math.random() * board.yCells),
        players[i % players.length]);
}
console.log("#findDeadPoints took " + (performance.now() - t0) + " milliseconds.");

function animate() {
    let xP = Math.round((mouse.x - board.padding) / board.gridSize) * board.gridSize + board.padding;
    mousePoint.x = Math.min(xP, board.maxWidth());

    let yP = Math.round((mouse.y - board.padding) / board.gridSize) * board.gridSize + board.padding;
    mousePoint.y = Math.min(yP, board.maxHeight());

    ctxForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);

    objects.forEach(object => {
        object.draw(ctxForeground);
    });
}

board.drawBackground(ctxBackground);
scoreBoard.build();
animate();

let url = 'ws://localhost:8080';
let ws = new WebSocket(url);
ws.onopen = function(evt) {
};
ws.onmessage = function(evt) {
    // handle this message
    console.log(evt.data);
};
ws.onclose = function(evt) {
    console.log("Connection Closed")
};
ws.onerror = function(evt) {
    console.log("Error occured")
    // handle this error
};

