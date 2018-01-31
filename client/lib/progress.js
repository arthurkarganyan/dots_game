let prog = document.querySelector(".progress");
export const updateProgress = (players, board) => {
    prog.innerHTML = "";
    players.forEach(i => {
        prog.innerHTML += "<div class='progress-bar' role='progressbar' style='width: " + 100 * (i.territoryOccupied() / (board.yCells * board.xCells)) + "%; background-color:" + i.color + "' aria-valuenow='15' aria-valuemin='0' aria-valuemax='100'></div>"
    });
};