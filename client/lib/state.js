window.changeState = function (newState) {
    console.log(`Change state: ${window.state} -> ${newState}`);
    window.state = newState;
};