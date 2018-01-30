import GraphicalPoint from './models/graphical_point';
import Board from './models/board';
import Player from "./models/player";
import ScoreBoard from "./ui/score_board";

import './lib/web_sockets';

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
// players.push(Player.build("green"));

const scoreBoard = new ScoreBoard(document.querySelector('#score'), players);

let playerTurnIndex = 0;

let iOS = false;
let p = navigator.platform;
if (p === 'iPad' || p === 'iPhone' || p === 'iPod') {
    iOS = true;
    let el = document.querySelector("#mobile_help");
    el.style.display = 'block';
    el.addEventListener('click', e => {
        touchClick(e);
    })
}
// if (iOS === false) {
//     // $("input[type=button]").hide();
// }

addEventListener('mousemove', event => {
    let clientX = event.clientX;
    let clientY = event.clientY;

    if (clientX < board.maxWidth() + board.gridSize && clientY < board.maxHeight() + board.gridSize) {
        mouse.x = clientX;
        mouse.y = clientY;
        animate();
    }
});

addEventListener('touchstart', event => {
    let clientX = event.touches[0].clientX;
    let clientY = event.touches[0].clientY;

    // ws.send(clientX + "," + board.maxWidth());
    if (clientX < board.maxWidth() && clientY < board.maxHeight()) {
        mouse.x = clientX;
        mouse.y = clientY;
        animate();
    }
});

let prog = document.querySelector(".progress");
let terr = () => {
    prog.innerHTML = "";
    players.forEach(i => {
        prog.innerHTML += "<div class='progress-bar' role='progressbar' style='width: " + 100 * (i.territoryOccupied() / (board.yCells * board.xCells)) + "%; background-color:" + i.color + "' aria-valuenow='15' aria-valuemin='0' aria-valuemax='100'></div>"
    });
};

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
        terr();
    }
};

let touchClick = event => {
    // ws.send(JSON.stringify(event));
    let xCoord = ~~((mousePoint.x - board.padding) / board.gridSize);
    let yCoord = ~~((mousePoint.y - board.padding) / board.gridSize);
    // alert(xCoord + ',' + yCoord);

    t(xCoord, yCoord);
};

// addEventListener("touchend", touchClick);
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

window.onload = function () {
    let modal = new RModal(document.getElementById('modal'), {
        //content: 'Abracadabra'
        beforeOpen: function (next) {
            next();
        }
        , afterOpen: function () {
        }

        , beforeClose: function (next) {
            next();
        }
        , afterClose: function () {
        }
        // , bodyClass: 'modal-open'
        // , dialogClass: 'modal-dialog'
        // , dialogOpenClass: 'animated fadeIn'
        // , dialogCloseClass: 'animated fadeOut'

        // , focus: true
        // , focusElements: ['input.form-control', 'textarea', 'button.btn-primary']

        // , escapeClose: true
    });

    document.addEventListener('keydown', function (ev) {
        modal.keydown(ev);
    }, false);

    // document.getElementById('showModal').addEventListener("click", function (ev) {
    //     ev.preventDefault();
    // modal.open();
    // }, false);

    window.modal = modal;

    let btns = document.querySelectorAll(".btn-group-toggle .btn");
    btns.forEach((btn) => {
        btn.addEventListener('click', event => {
            btns.forEach(i => i.classList.remove("active"));

            btn.classList.add("active");
        })
    });
};


terr();


const url = 'ws://192.168.0.105:8080';
const ws = new WebSocket(url);

ws.onopen = function (evt) {
    ws.send("START!");
};

ws.onmessage = function (evt) {
    // handle this message
    console.log(evt.data);
};

ws.onclose = function (evt) {
    console.log("Connection Closed")
};

ws.onerror = function (evt) {
    console.log("Error occured")
    // handle this error
};
