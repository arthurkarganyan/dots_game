import GraphicalPoint from "./graphical_point";

export default class CursorPoint extends GraphicalPoint {
    constructor(x, y, color, radius, board) {
        super(x, y, color, radius);
        this.board = board;
    }

    mouseMoved(clientX, clientY) {
        if (window.state !== "play") return;
        if (!(clientX < this.board.maxWidth() && clientY < this.board.maxHeight())) return;
        let playerPointX = Math.round((clientX - this.board.padding) / this.board.gridSize);
        let playerPointY = Math.round((clientY - this.board.padding) / this.board.gridSize);

        if (this.board.pointsMap[playerPointY][playerPointX]) {
            this.x = -100;
            this.y = -100;
        } else {
            let xP = playerPointX * this.board.gridSize + this.board.padding;
            let yP = playerPointY * this.board.gridSize + this.board.padding;

            this.x = Math.min(xP, this.board.maxWidth());
            this.y = Math.min(yP, this.board.maxHeight());
        }

        this.callback()
    }

    onChangeCall(func) {
        this.callback = func;
    }
}

