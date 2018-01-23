export default class GraphicalObject {
    constructor(ctx) {
        this.ctx = ctx;
    }

    update() {
        this.draw()
    };

    draw() {
        throw "Should be overriden!";
    }
}
