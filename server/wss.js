const WebSocket = require('ws');
const _ = require('underscore');
const dateTime = require('node-datetime');

let wss;

const games = [];
const TURN_DURATION = 25000;

function generateHexString(length) {
    let ret = "";
    while (ret.length < length) {
        ret += Math.random().toString(16).substring(2);
    }
    return ret.substring(0, length);
}

const log = msg => {
    let dt = dateTime.create();
    let formatted = "" + dt.format('Y-m-d H:M:S');
    console.log(formatted + " | " + msg);
};

const incomingMsg = (msg, ws, req) => {
    log('received: ' + msg + " from " + ws.playerName);
    // log(req.headers['sec-websocket-key']);

    let data = JSON.parse(msg);
    if (data.type === "new_point") {
        ws.game.nextTurn();
        // if (ws.timeoutTimer)
        //     clearInterval(ws.timeoutTimer);
        // let opponent = wss.activeClients().find(i => {
        //     return i !== ws && i.gameId === ws.gameId;
        // });

        if (ws.opponent) {
            ws.opponent.send(msg)
        } else {
            log("Opponent not found!GameId: " + ws.gameId);
        }
    }

    if (data.type === "start_wait") {
        ws.state = "wait";
        ws.playerName = data.msg.playerName;

        let waitingClientsArray = wss.waitingClients();

        log("Number of waiting clients: " + waitingClientsArray.length);
        if (waitingClientsArray.length >= 2) {
            let shuffledColors = _.shuffle(["red", "blue"]);

            let a = waitingClientsArray.slice(0, 2);

            let turn = Math.floor(Math.random() * 2);
            let gameId = generateHexString(36);
            let reply;
            reply = {
                you: {color: shuffledColors[0]},
                opponent: {
                    color: shuffledColors[1],
                    playerName: a[1].playerName
                },
                gameId: gameId,
                turn: turn === 0 ? "you" : "opponent",
                turnDuration: TURN_DURATION
            };

            a[0].opponent = a[1];
            a[1].opponent = a[0];

            a[0].send(JSON.stringify({type: 'start', msg: reply}));

            reply = {
                you: {color: shuffledColors[1]},
                opponent: {
                    color: shuffledColors[0],
                    playerName: a[0].playerName
                },
                gameId: gameId,
                turn: turn === 1 ? "you" : "opponent",
                turnDuration: TURN_DURATION
            };

            a[1].send(JSON.stringify({type: 'start', msg: reply}));

            let game = {gameId: gameId, turn: turn, players: a};

            game.nextTurn = () => {
                clearInterval(game.timeoutTimer);
                game.turn = game.turn === 0 ? 1 : 0;
                log("Turn for: " + game.currentPlayer().playerName);
                game.startTimer()
            };

            game.timeIsUp = () => {
                game.turn = game.turn === 0 ? 1 : 0;
            };

            game.currentPlayer = () => {
                return game.players[game.turn];
            };

            game.startTimer = () => {
                log("startTimer");
                clearTimeout(game.timeoutTimer);
                game.timeoutTimer = setTimeout(function () {
                    if (a[0].isAlive && a[1].isAlive &&
                        a[0].readyState === WebSocket.OPEN && a[1].readyState === WebSocket.OPEN) {
                        log("Time is up for " + game.currentPlayer().playerName);
                        game.nextTurn();
                        a.forEach((i) => {
                            i.send(JSON.stringify({type: "time_is_up"}));
                        })
                    }
                }, TURN_DURATION);
            };

            game.startTimer();

            // ws.addTimeoutTimer = () => {
            //     ws.timeoutTimer = setTimeout(function () {
            //         log("Time is up for " + ws.playerName);
            //         ws.send(JSON.stringify({type: "time_is_up"}));
            //         ws.opponent.send(JSON.stringify({type: "time_is_up"}));
            //         ws.opponent.addTimeoutTimer();
            //     }, 15000);
            // };

            a.forEach(i => {
                i.state = "play";
                i.game = game;
            })
        }
    }
};

const startWss = (function (server) {
    noop = () => {
    };

    function heartbeat() {
        this.isAlive = true;
    }

    wss = new WebSocket.Server({server});
    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                log("terminated");
                wss.clients.delete(ws);
                log("Number of clients: " + wss.clients.size); // it's Set
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping(noop);
        });
    }, 10000);

    wss.activeClients = () => [...wss.clients].filter(i => i.readyState === WebSocket.OPEN);
    wss.waitingClients = () => wss.activeClients().filter(i => i.state === "wait");

    wss.on('connection', function connection(ws, req) {
        ws.isAlive = true;
        ws.on('pong', heartbeat);


        ws.on('message', msg => incomingMsg(msg, ws, req));

        log("Number of clients: " + wss.activeClients().length); // it's Set
    });


    server.listen(8080, function listening() {
        log('Listening websockets on ', + server.address().port);
    });
});

exports.startWss = startWss;