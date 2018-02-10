import Board from './models/board';
import Player from "./models/player";
import ScoreBoard from "./ui/score_board";

import './lib/web_sockets';
import './lib/state';
import './lib/modal';
import {updateProgress} from './lib/progress';

import CursorPoint from "./models/cursor_point";
import Timer from "./ui/timer";
import {ws} from "./lib/web_sockets";

const css3 = require("./css/lumen.bootstrap.min.css");
const css = require("./css/animate.css");
const css2 = require("./css/style.css");

let currentPlayer;

const mover = () => players[playerTurnIndex];

let playerTurnIndex;

const timer = new Timer(() => console.log("Time is Up"));
let opponent;

ws.gameStartCallback = (data) => {
    window.changeState("play");
    window.playerNameModal.close();
    currentPlayer = Player.build(data.you.color, window.currentPlayerName);
    players.push(currentPlayer);
    opponent = Player.build(data.opponent.color, data.opponent.playerName);
    players.push(opponent);
    playerTurnIndex = data.turn === "you" ? 0 : 1;

    mousePoint = new CursorPoint(-1, -1, currentPlayer.color, 4, board);
    mousePoint.onChangeCall(animate);
    addEventListener('mousemove', event => mousePoint.mouseMoved(event.clientX, event.clientY));
    addEventListener('touchstart', event => mousePoint.mouseMoved(event.touches[0].clientX, event.touches[0].clientY));
    objects.push(mousePoint);
    scoreBoard.refresh();
    window.gameId = data.gameId;

    timer.activate(playerTurnIndex, mover());
    timer.setDuration(data.turnDuration);
};

const canvasForeground = document.querySelector('canvas.foreground');
const ctxForeground = canvasForeground.getContext('2d');

canvasForeground.width = innerWidth;
canvasForeground.height = innerHeight;

const canvasBackground = document.querySelector('canvas.background');
const ctxBackground = canvasBackground.getContext('2d');

canvasBackground.width = innerWidth;
canvasBackground.height = innerHeight;

const players = [];
window.waiting = true;

const scoreBoard = new ScoreBoard(document.querySelector('#score'), players).build();

let p = navigator.platform;
if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
    let el = document.querySelector("#mobile_help");
    el.style.display = 'block';
    el.addEventListener('click', e => {
        touchClick(e);
    })
}

const nextTurn = () => {
    if (playerTurnIndex === players.length - 1) {
        playerTurnIndex = 0;
    } else {
        playerTurnIndex++;
    }

    console.log("nextTurn is for " + mover().colorName);
    timer.activate(playerTurnIndex, mover());
    animate();
};

let addPoint = (x, y, player) => {
    if (!board.addPlayerPoint(x, y, player)) return false;
    scoreBoard.refresh();
    updateProgress(players, board);
    nextTurn();
    return true;
};

const addOpponentPoint = (x, y) => addPoint(x, y, opponent);

let addMyPoint = (x, y) => {
    if (!addPoint(x, y, currentPlayer))
        return false;

    window.sendWsMsg({type: "new_point", msg: {x: x, y: y}});
};

ws.pointAddCallback = addOpponentPoint;
ws.timeIsUpCallback = nextTurn;

let touchClick = event => {
    if (window.state !== "play") return;
    if (playerTurnIndex !== 0) return;
    let xCoord = ~~((mousePoint.x - board.padding) / board.gridSize);
    let yCoord = ~~((mousePoint.y - board.padding) / board.gridSize);

    addMyPoint(xCoord, yCoord);
};

addEventListener('click', touchClick);

addEventListener('resize', () => {
    canvasForeground.width = innerWidth;
    canvasForeground.height = innerHeight;
    canvasBackground.width = innerWidth;
    canvasBackground.height = innerHeight;
    // board.height = canvasForeground.height;
    // board.width = canvasForeground.width;
    board.drawBackground(ctxBackground);
    animate();
});

let objects = [];
const board = new Board(canvasForeground.width, canvasForeground.height, players);
let mousePoint;

objects.push(board);

function animate() {
    if (window.state !== "play") return;
    ctxForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);

    board.draw(ctxForeground);
    if (playerTurnIndex === 0)
        mousePoint.draw(ctxForeground);
    // objects.forEach(object => {
    //     // debugger;
    //     object.draw(ctxForeground);
    // });
}

board.drawBackground(ctxBackground);
animate();

updateProgress(players, board);

// states
// http://www.nomnoml.com/#view/%0A%0A%0A%5Bid%5D-%3E%5Bwait%5D%0A%5Bwait%5D-%3E%5Bplay%5D%0A%5Bplay%5D-%3E%5Bid%5D%0A

window.state = "id";

Array.prototype.sample = function () {
    return this[~~(Math.random() * this.length)];
};
