// const express = require('express');
// const app = express();
//
//

const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const app = express();
const __root = __dirname.split('/').slice(0, -1).join('/');

// app.use(function (req, res) {
//     res.send({ msg: "hello" });
// });

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', function connection(ws, req) {
    // const location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    // clients.push(ws);

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        // JSON.parse(message)
        wss.clients.forEach( i => {
            if(i !== ws)
                i.send(message);
        })
    });

    console.log("Number of clients: " + wss.clients.size); // it's Set

    if (wss.clients.size >= 2) {
        wss.clients.forEach( i => {
            i.send("Start");
        })
    }

    // ws.send('something');

    // console.log(wss.clients);
    // wss.clients.forEach(function each(ws) {
    //
    //     ws.send('something');
    // });
});

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});

app.use('/', express.static(__root + '/public'));

// app.get('/', (req, res) => {
//     // console.log(__dirname+'/sitemap.html');
//     // res.send('Hello World!')
//     return res.sendFile('../index.html');
// });


app.listen(3000, () => console.log('listening on port 3000!'));

process.on('uncaughtException', function (err) {
    console.log('UNCAUGHT EXCEPTION - keeping process alive:', err);
});