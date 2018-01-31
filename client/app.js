import Board from './models/board';
import Player from "./models/player";
import ScoreBoard from "./ui/score_board";

import './lib/web_sockets';
import './lib/modal';
import { updateProgress } from './lib/progress';
import CursorPoint from "./models/cursor_point";
import { ws } from "./lib/web_sockets";

const canvasForeground = document.querySelector('canvas.foreground');
const ctxForeground = canvasForeground.getContext('2d');

canvasForeground.width = innerWidth;
canvasForeground.height = innerHeight;

const canvasBackground = document.querySelector('canvas.background');
const ctxBackground = canvasBackground.getContext('2d');

canvasBackground.width = innerWidth;
canvasBackground.height = innerHeight;

let currentPlayer = Player.build("red");
const players = [];

players.push(currentPlayer);
players.push(Player.build("blue"));
// players.push(Player.build("green"));

const scoreBoard = new ScoreBoard(document.querySelector('#score'), players).build();

let playerTurnIndex = 0;

let p = navigator.platform;
if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
    let el = document.querySelector("#mobile_help");
    el.style.display = 'block';
    el.addEventListener('click', e => {
        touchClick(e);
    })
}

let t = (x, y) => {
    if (board.addPlayerPoint(x, y, currentPlayer)) {
        if (playerTurnIndex === players.length - 1) {
            playerTurnIndex = 0;
        } else {
            playerTurnIndex++;
        }
        currentPlayer = players[playerTurnIndex];
        mousePoint.color = currentPlayer.color;
        scoreBoard.refresh();

        let msg = JSON.stringify({"x": x, "y": y, "player": currentPlayer.getName()});
        ws.send(msg);
        animate();
        updateProgress(players, board);
    }
};

let touchClick = event => {
    let xCoord = ~~((mousePoint.x - board.padding) / board.gridSize);
    let yCoord = ~~((mousePoint.y - board.padding) / board.gridSize);

    t(xCoord, yCoord);
};

addEventListener('click', touchClick);

addEventListener('resize', () => {
    // canvasForeground.width = innerWidth;
    // canvasForeground.height = innerHeight;
    // canvasBackground.width = innerWidth;
    // canvasBackground.height = innerHeight;
    // board.height = canvasForeground.height;
    // board.width = canvasForeground.width;
    // board.drawBackground(ctxBackground);
    animate();
});

let objects = [];
const board = new Board(canvasForeground.width, canvasForeground.height, players);
const mousePoint = new CursorPoint(-1, -1, currentPlayer.color, 4, board);
addEventListener('mousemove', event => mousePoint.mouseMoved(event.clientX, event.clientY));
addEventListener('touchstart', event => mousePoint.mouseMoved(event.touches[0].clientX, event.touches[0].clientY) );
mousePoint.onChangeCall(animate);

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
    ctxForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);

    objects.forEach(object => {
        object.draw(ctxForeground);
    });
}

board.drawBackground(ctxBackground);
animate();

updateProgress(players, board);
