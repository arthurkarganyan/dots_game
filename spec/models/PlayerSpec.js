import Player from "../../src/models/player";

describe("Player", function () {
    it("build", function () {
        let player = Player.build("red");
        expect(player.colorName).toEqual("red");
        expect(player.color).toEqual("rgba(231, 76, 60, 1.0)");
        expect(player.backColor).toEqual("rgba(231, 76, 60, 0.5)");
        expect(player.textRepresentation).toEqual("R");
        expect(player.textRepresentationDead).toEqual("r");
    });
});
