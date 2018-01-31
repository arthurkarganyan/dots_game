export const ws = (function () {
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

    return ws;
})();
