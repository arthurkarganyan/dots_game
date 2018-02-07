const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
const __root = __dirname.split('/').slice(0, -1).join('/');

const server = http.createServer(app);
const wss = new WebSocket.Server({server});


function noop() {}

function heartbeat() {
    this.isAlive = true;
}

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
            console.log("terminated");
            wss.clients.delete(ws);
            console.log("Number of clients: " + wss.clients.size); // it's Set
            return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping(noop);
    });
}, 10000);

wss.on('connection', function connection(ws, req) {
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    // const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    // clients.push(ws);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        // JSON.parse(message)
        wss.clients.forEach(i => {
            if (i !== ws && i.readyState === WebSocket.OPEN)
                i.send(message);
        })
    });

    console.log("Number of clients: " + wss.clients.size); // it's Set

    if (wss.clients.size >= 2) {
        wss.clients.forEach(i => {
            if (i.readyState === WebSocket.OPEN)
                i.send(JSON.stringify({type: 'Start'}));
        })
    }
});

server.listen(8080, function listening() {
    console.log('Listening websockets on %d', server.address().port);
});

app.use('/', express.static(__root + '/public'));

app.listen(3000, () => console.log('listening on port 3000!'));

process.on('uncaughtException', function (err) {
    console.log('UNCAUGHT EXCEPTION - keeping process alive:', err);
});