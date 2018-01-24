import GraphicalPoint from './models/graphical_point';
import Board from './models/board';
import Player from "./models/player";

// Initial Setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

CanvasRenderingContext2D.prototype.fillPolygon = function (pointsArray, fillColor, strokeColor) {
    if (pointsArray.length <= 0) return;
    this.moveTo(pointsArray[0][0], pointsArray[0][1]);
    for (var i = 0; i < pointsArray.length; i++) {
        this.lineTo(pointsArray[i][0], pointsArray[i][1]);
    }
    if (strokeColor != null && strokeColor !== undefined)
        this.strokeStyle = strokeColor;

    if (fillColor != null && fillColor !== undefined) {
        this.fillStyle = fillColor;
        this.fill();
    }
};

canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

let currentPlayer = Player.build("red");
const players = [];

players.push(currentPlayer);
players.push(Player.build("blue"));

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    animate();
});

addEventListener('click', event => {
    if(board.addPlayerPoint(~~(mousePoint.x / board.gridSize), ~~(mousePoint.y / board.gridSize), currentPlayer)) {
        currentPlayer = players.filter(i => i !== currentPlayer)[0];
        mousePoint.color = currentPlayer.color;
    }

    animate();
});

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    board.height = canvas.height;
    board.width = canvas.width;
    // init();
    animate();
});

// Implementation
let objects = [];
const board = new Board(canvas.width, canvas.height);
const mousePoint = new GraphicalPoint(100, 100, currentPlayer.color, 5);

objects.push(board);
objects.push(mousePoint);

function init() {
    for (let i = 0; i < 0; i++) {
        board.addPlayerPoint(
            ~~(Math.random() * board.xCells),
            ~~(Math.random() * board.yCells),
            players[1])
    }

    // board.addPlayerPoint(0, 1, currentPlayer);
    // board.addPlayerPoint(1, 0, currentPlayer);
    // board.addPlayerPoint(1, 2, currentPlayer);
    // board.addPlayerPoint(2, 1, currentPlayer);

    // for (let i = 0; i < 400; i++) {
    // objects.push();
    // }
}

// Animation Loop
function animate() {
    mousePoint.x = Math.min(Math.round(mouse.x / board.gridSize) * board.gridSize + board.padding, board.maxWidth());
    mousePoint.y = Math.min(Math.round(mouse.y / board.gridSize) * board.gridSize + board.padding, board.maxHeight());

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.fillText('HTML CANVAS BOILERPLATE', mouse.x, mouse.y);

    objects.forEach(object => {
        object.draw(ctx);
    });
}

init();
animate();





