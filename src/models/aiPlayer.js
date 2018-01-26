import Player from "./player";

export default class AiPlayer extends Player {
    constructor(colorName, color, backColor, textRepresentation, textRepresentationDead, name) {
        super(colorName, color, backColor, textRepresentation, textRepresentationDead);
        this.name = (name || "AiPlayer") + " " + colorName;
    }
}
