import GraphicalPoint from './models/graphical_point';
import Board from './models/board';
import Player from "./models/player";
import ScoreBoard from "./models/score_board";

// Initial Setup
const canvasForeground = document.querySelector('canvas.foreground');
const ctxForeground = canvasForeground.getContext('2d');

canvasForeground.width = innerWidth;
canvasForeground.height = innerHeight;

const canvasBackground = document.querySelector('canvas.background');
const ctxBackground = canvasBackground.getContext('2d');

canvasBackground.width = innerWidth;
canvasBackground.height = innerHeight;


// Variables
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

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    animate();
});

addEventListener('click', event => {
    if (board.addPlayerPoint(~~(mousePoint.x / board.gridSize), ~~(mousePoint.y / board.gridSize), currentPlayer)) {
        if (playerTurnIndex === players.length - 1) {
            playerTurnIndex = 0;
        } else {
            playerTurnIndex++;
        }
        currentPlayer = players[playerTurnIndex];
        mousePoint.color = currentPlayer.color;
        scoreBoard.refresh();
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
    init();
    animate();
});

// Implementation
let objects = [];
const board = new Board(canvasForeground.width, canvasForeground.height, players);
const mousePoint = new GraphicalPoint(-1, -1, currentPlayer.color, 4);

objects.push(board);
objects.push(mousePoint);

for (let i = 0; i < 50; i++) {
    board.addPlayerPoint(
        ~~(Math.random() * board.xCells),
        ~~(Math.random() * board.yCells),
        players[i % 3])
}

function init() {

    // board.addPlayerPoint(0, 1, currentPlayer);
    // board.addPlayerPoint(1, 0, currentPlayer);
    // board.addPlayerPoint(1, 2, currentPlayer);
    // board.addPlayerPoint(2, 1, currentPlayer);

    // for (let i = 0; i < 400; i++) {
    // objects.push();
    // }
    board.drawBackground(ctxBackground);
    // scoreBoard.refresh();
}

// Animation Loop
function animate() {
    mousePoint.x = Math.min(Math.round(mouse.x / board.gridSize) * board.gridSize + board.padding, board.maxWidth());
    mousePoint.y = Math.min(Math.round(mouse.y / board.gridSize) * board.gridSize + board.padding, board.maxHeight());

    ctxForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);

    // ctx.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);

    objects.forEach(object => {
        // board.drawBackground(ctxBackground);
        object.draw(ctxForeground);
    });
    // ctxBackground.rect(20,20,150,100);
    // ctxBackground.stroke();
}

scoreBoard.build();
init();
animate();





