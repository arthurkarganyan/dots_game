const WebSocket = require('ws');
const _ = require('underscore');
const dateTime = require('node-datetime');

let wss;

const TURN_DURATION = 25000;

const log = msg => {
    let dt = dateTime.create();
    let formatted = "" + dt.format('Y-m-d H:M:S');
    console.log(formatted + " | " + msg);
};

const endGameFor = (ws) => {
    clearTimeout(ws.game.timeoutTimer);
    clearInterval(ws.game.disconnectTimer);
    delete ws.game;
    delete ws.opponent;
    delete ws.drawOffers;
    delete ws.inviteCode;
};

const sendMsg = (ws, msg) => {
    if (ws.readyState === WebSocket.OPEN) {
        return ws.send(msg);
    }
};

const incomingMsg = (msg, ws, req) => {
    log('received: ' + msg + " from " + ws.playerName);

    let data = JSON.parse(msg);
    if (data.type === "new_point") {
        if (data.msg.territoryOccupied > 40) {
            sendMsg(ws, JSON.stringify({type: "full_board"}));
            sendMsg(ws.opponent, JSON.stringify({type: "full_board"}));

            endGameFor(ws.opponent);
            endGameFor(ws);
        } else {
            ws.game.nextTurn();

            sendMsg(ws.opponent, msg);
        }
    }

    if (data.type === "surrender" || data.type === "accept_draw") {
        sendMsg(ws.opponent, msg);
        endGameFor(ws)
    }

    if (data.type === "offer_draw") {
        if (!ws.drawOffers || ws.drawOffers < 3) {
            ws.drawOffers = ws.drawOffers ? ws.drawOffers + 1 : 1;
            sendMsg(ws.opponent, msg);
        }
    }

    if (data.type === "reject_draw")
        sendMsg(ws.opponent, msg);

    if (data.type === "send_chat_msg")
        sendMsg(ws.opponent, msg);

    if (data.type === "start_wait") {
        ws.state = "wait";
        ws.playerName = data.msg.playerName;
        ws.inviteCode = data.msg.inviteCode;

        let waitingClientsArray = wss.waitingClients().filter(i => i.inviteCode === ws.inviteCode);

        log("Number of waiting clients: " + wss.waitingClients().length);

        if (waitingClientsArray.length >= 2) {
            let shuffledColors = _.shuffle(["red", "blue"]);

            let a = waitingClientsArray.slice(0, 2);

            let turn = Math.floor(Math.random() * 2);
            let reply;
            reply = {
                you: {color: shuffledColors[0]},
                opponent: {
                    color: shuffledColors[1],
                    playerName: a[1].playerName
                },
                turn: turn === 0 ? "you" : "opponent",
                turnDuration: TURN_DURATION - 2000
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
                turn: turn === 1 ? "you" : "opponent",
                turnDuration: TURN_DURATION
            };

            a[1].send(JSON.stringify({type: 'start', msg: reply}));

            let game = {
                turn: turn,
                players: a,

                nextTurn: () => {
                    clearInterval(game.timeoutTimer);
                    game.turn = game.turn === 0 ? 1 : 0;
                    log("Turn for: " + game.currentPlayer().playerName);
                    game.startTimer()
                },

                currentPlayer: () => {
                    return game.players[game.turn];
                },

                startTimer: () => {
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
                },

                disconnectTimer: () => setInterval(() => {
                    game.players.forEach(i => {
                            if (i.opponent && i.opponent.readyState !== WebSocket.OPEN) {
                                i.send(JSON.stringify({type: "opponent_disconnect"}));
                                endGameFor(i);
                            }
                        }
                    );
                }, 10000)
            };

            game.startTimer();
            game.disconnectTimer();

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
        log('Listening websockets on ', +server.address().port);
    });
});

exports.startWss = startWss;