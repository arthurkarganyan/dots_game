const express = require('express');
const http = require('http');
// require('import-export');

const app = express();
const __root = __dirname.split('/').slice(0, -1).join('/');

const server = http.createServer(app);

const redis = require("redis");
const client = redis.createClient(6379, process.env.REDIS_HOST);
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const _ = require('underscore');

const sessionStore = new RedisStore({port: 6379, host: process.env.REDIS_HOST});

// import {startWss} from './wss.js';
const wssModule = require(__root + "/server/wss.js");

wssModule.startWss(server);

app.use(session({
    store: sessionStore,
    secret: 'keyboard catzzzz _918htlh17t3h2j3dt82du4nthe3hc',
    resave: false,
    name: 'sessionId'
}));

client.on("error", err => console.log("Error " + err));

// app.get('/a', function (req, res) {
//     if (req.session.page_views) {
//         req.session.page_views++;
//         res.send("You visited this page " + req.session.page_views + " times. SessionID:" + req.sessionID);
//     } else {
//         req.session.page_views = 1;
//         res.send("Welcome to this page for the first time!");
//     }
// });
//
// app.get('/b', function (req, res) {
//     console.log("b: " + req.sessionID);
//     res.sendFile(__root + '/public/index.html');
// });


app.use('/', express.static(__root + '/public'));

const serverPost = process.env.SERVER_PORT;
app.listen(serverPost, () => console.log('listening on port ' + serverPost + ' !'));

process.on('uncaughtException', function (err) {
    console.log('UNCAUGHT EXCEPTION - keeping process alive:', err);
});
