export const ws = (function () {
    const url = 'ws://' + DOMAIN_NAME + ':8080';
    console.log("Websocket URL: " + url);
    let ws = new WebSocket(url);


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
                    tryConnect(timeout);
                }
            }, timeout);
        }

        tryConnect(5000);
    };
    ws.onerror = function (evt) {
        console.log("Error occured")
    };

    window.sendWsMsg = function (msg) {
        ws.send(JSON.stringify(msg));
    };

    return ws;
})();
