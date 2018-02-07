export const ws = (function () {
    const url = 'ws://192.168.0.106:8080';
    let ws = new WebSocket(url);

    ws.onmessage = function (evt) {
        console.log(evt.data);
        let msg = JSON.parse(evt.data);
        if (msg.type === "Start" && window.state === "wait") {
            window.changeState("play");
            return ws.gameStartCallback(msg.data);
        }

        // ws.pointAddCallback(obj.x, obj.y);
    };

    ws.onopen = function (evt) {
        console.log("Connection Opened");
    };

    ws.onclose = function (evt) {
        console.log("Connection Closed");

        function tryConnect(timeout) {
            setTimeout(function () {
                if (ws.readyState !== WebSocket.OPEN) {
                    console.log("reconnecting: " + timeout);
                    ws = new WebSocket(url);
                    tryConnect(timeout * 2);
                }
            }, timeout);
        }

        tryConnect(2000);
    };
    ws.onerror = function (evt) {
        console.log("Error occured")
    };

    window.sendWsMsg = function (msg) {
        ws.send(msg);
    };

    return ws;
})();
