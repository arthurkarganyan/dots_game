import Board from './models/board';
import Player from "./models/player";
import ScoreBoard from "./ui/score_board";

import './lib/web_sockets';
import './lib/state';

import {createModal} from './lib/modal';
import {updateProgress} from './lib/progress';

import CursorPoint from "./models/cursor_point";
import Timer from "./ui/timer";
import {createWs} from "./lib/web_sockets";
import {createEventBus} from "./lib/event_bus";
import {createInviteLinkJoint} from "./joints/invite_link_joint";
import {generateHexString} from "../utils/hex";
import {createChatJoint} from "./joints/chat_joint";

const eventBus = createEventBus();

window.eventBus = eventBus;

const ws = createWs(eventBus);
const modal = createModal(eventBus);
const inviteLinkJoint = createInviteLinkJoint(eventBus, document, generateHexString, window);
const chatJoint = createChatJoint(eventBus, {document: document, window: window});

window.onload = () => {
    eventBus.pub("page_load")
};

let currentPlayerName;

eventBus.sub("change_current_player_name", name => {
    currentPlayerName = name;
});

// const lumen = require("./css/lumen.bootstrap.css");
// const css = require("./css/animate.css");
const css2 = require("./css/style.css");

let currentPlayer;

const mover = () => players[playerTurnIndex];

let playerTurnIndex;

const timer = new Timer();
let opponent;

const canvasForeground = document.querySelector('canvas.foreground');
const ctxForeground = canvasForeground.getContext('2d');

canvasForeground.width = innerWidth;
canvasForeground.height = innerHeight;

const canvasBackground = document.querySelector('canvas.background');
const ctxBackground = canvasBackground.getContext('2d');

canvasBackground.width = innerWidth;
canvasBackground.height = innerHeight;

let players;
let board = new Board(canvasForeground.width, canvasForeground.height);
let scoreBoard;

const gameStart = (data) => {
    window.changeState("play");
    window.playerNameModal.close();

    currentPlayer = Player.build(data.you.color, currentPlayerName);
    opponent = Player.build(data.opponent.color, data.opponent.playerName);
    players = [currentPlayer, opponent];
    playerTurnIndex = data.turn === "you" ? 0 : 1;
    board = new Board(canvasForeground.width, canvasForeground.height, players);
    mousePoint = new CursorPoint(-1, -1, currentPlayer.color, 4, board);
    mousePoint.onChangeCall(animate);
    scoreBoard = new ScoreBoard(document.querySelector('#score'), players).build();


    addEventListener('mousemove', event => mousePoint.mouseMoved(event.clientX, event.clientY));
    addEventListener('touchstart', event => mousePoint.mouseMoved(event.touches[0].clientX, event.touches[0].clientY));

    objects.push(mousePoint);
    scoreBoard.refresh();

    timer.activate(playerTurnIndex, mover());
    timer.setDuration(data.turnDuration);

    animate();
    updateProgress(players, board);

    document.querySelector("audio#connected").play();

    eventBus.pub("game_start");
};


window.onhashchange = () => {
    eventBus.pub("onhashchange", location.hash)
};

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

    window.sendWsMsg({type: "new_point", msg: {x: x, y: y, territoryOccupied: board.getTerritoryOccupied()}});
};

const showTimeIsUpAlert = () => {
    const inAnimation = "fadeInLeft";
    let alertDiv = document.querySelector(".alert");
    alertDiv.style = "display: block";
    alertDiv.classList += " " + inAnimation;

    const fadedOut = () => {
        alertDiv.classList.remove("flipOutX");
        alertDiv.style = "display: none";
        alertDiv.removeEventListener("animationend", fadedOut)
    };

    const fadedIn = () => {
        alertDiv.classList.remove(inAnimation);

        setTimeout(() => {
            alertDiv.classList += " flipOutX";
            alertDiv.addEventListener("animationend", fadedOut);
        }, 3000);

        console.log(this);
        alertDiv.removeEventListener("animationend", fadedIn)
    };

    alertDiv.addEventListener("animationend", fadedIn)
};

const timeIsUp = () => {
    if (window.state !== "play") return;
    if (playerTurnIndex === 0) showTimeIsUpAlert();
    nextTurn();
};

const quitGame = () => {
    timer.stop();
    window.state = "id";

    eventBus.pub("quit_game");
    window.playerNameModal.open();
};

const opponentSurrendered = () => {
    // FIXME sound expected
    alert("Your opponent surrendered!");
    quitGame();
};

const drawOffered = () => {
    if (confirm('Your opponent offers you draw. Do you agree?')) {
        window.sendWsMsg({type: "accept_draw"});
        alert("Draw accepted");
        quitGame();
    } else {
        window.sendWsMsg({type: "reject_draw"});
    }
};

const drawAccepted = () => {
    alert("Draw!");
    quitGame();
};

const drawRejected = () => {
    alert("Draw rejected!");
};

const opponentDisconnect = () => {
    if (window.state !== "play") return;
    document.querySelector("audio#win").play();
    alert("Your oppenent disconnected. Win!");
    quitGame();
};

const fullBoard = () => {
    let score = players.map(i => i.score);

    if (score[0] > score[1]) {
        document.querySelector("audio#win").play();
        alert("The game is over. You Won!")
    }

    if (score[0] === score[1]) {
        alert("The game is over. Draw!")
    }

    if (score[0] < score[1]) {
        document.querySelector("audio#lose").play();
        alert("The game is over. You Lost!")
    }

    quitGame();
};

ws.onmessage = function (evt) {
    console.log("recieved: " + evt.data);
    let msg = JSON.parse(evt.data);

    if (msg.type === "start" && window.state === "wait") return gameStart(msg.msg);
    if (msg.type === "new_point") return addOpponentPoint(msg.msg.x, msg.msg.y);
    if (msg.type === "time_is_up") return timeIsUp();
    if (msg.type === "surrender") return opponentSurrendered();
    if (msg.type === "offer_draw") return drawOffered();
    if (msg.type === "accept_draw") return drawAccepted();
    if (msg.type === "reject_draw") return drawRejected();
    if (msg.type === "opponent_disconnect") return opponentDisconnect();
    if (msg.type === "full_board") return fullBoard();

    eventBus.pub(msg.type + ".server", msg.msg);
    // throw("Unknown msg type: " + msg.type);
};


let touchClick = event => {
    if (window.state !== "play") return;
    if (playerTurnIndex !== 0) return;
    let xCoord = ~~((mousePoint.x - board.padding) / board.gridSize);
    let yCoord = ~~((mousePoint.y - board.padding) / board.gridSize);

    addMyPoint(xCoord, yCoord);
};

window.askSurrender = () => {
    if (confirm('Are you sure you want to surrender?')) {
        window.sendWsMsg({type: "surrender"});
        alert("You've surrendered :(");
        quitGame();
    }
};

window.askOfferDraw = () => {
    if (confirm('Are you sure you want to offer draw to your opponent?')) {
        window.sendWsMsg({type: "offer_draw"});
        // alert("You've surrendered :(");
        // quitGame();
    }
};

canvasForeground.addEventListener('click', touchClick);

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
let mousePoint;

objects.push(board);

function animate() {
    if (window.state !== "play") return;
    ctxForeground.clearRect(0, 0, canvasForeground.width, canvasForeground.height);

    board.draw(ctxForeground);
    if (playerTurnIndex === 0)
        mousePoint.draw(ctxForeground);
}

board.drawBackground(ctxBackground);
animate();


// states
// http://www.nomnoml.com/#view/%0A%0A%0A%5Bid%5D-%3E%5Bwait%5D%0A%5Bwait%5D-%3E%5Bplay%5D%0A%5Bplay%5D-%3E%5Bid%5D%0A

window.state = "id";

Array.prototype.sample = function () {
    return this[~~(Math.random() * this.length)];
};
