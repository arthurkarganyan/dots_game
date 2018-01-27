export default class Player {
    static build(colorName) {
        let obj = this.presets()[colorName];
        if (!obj)
            throw `Incorrect color name: ${colorName}`;

        return new Player(colorName, obj['color'], obj['backColor'], obj['textRepresentation'], obj['textRepresentationDead'])
    }

    static colorNames() {
        let presetsTemp = this.presets();
        let keys = [];
        for (let k in presetsTemp)
            keys.push(k);

        return keys;
        // colorName = keys[Math.floor(Math.random()*keys.length)];
    }

    static presets() {
        return {
            // pink: {
            //     color: "rgba(232, 67, 147, 1.0)",
            //     backColor: "rgba(232, 67, 147, 1.0)",
            //     textRepresentation: 'P',
            //     textRepresentationDead: 'p',
            // },

            green: {
                color: "rgba(46, 204, 113, 1.0)",
                backColor: "rgba(46, 204, 113, 0.5)",
                textRepresentation: 'G',
                textRepresentationDead: 'g',
            },

            blue: {
                color: "rgba(52, 152, 219, 1.0)",
                backColor: "rgba(52, 152, 219, 0.3)",
                textRepresentation: 'B',
                textRepresentationDead: 'b',
            },

            violet: {
                color: "rgba(155, 89, 182,1.0)",
                backColor: "rgba(155, 89, 182,0.5)",
                textRepresentation: 'V',
                textRepresentationDead: 'v',
            },

            black: {
                color: "rgba(52, 73, 94, 1.0)",
                backColor: "rgba(52, 73, 94, 0.5)",
                textRepresentation: 'K',
                textRepresentationDead: 'k',
            },

            yellow: {
                color: "rgba(241, 196, 15,1.0)",
                backColor: "rgba(241, 196, 15, 0.5)",
                textRepresentation: 'Y',
                textRepresentationDead: 'y',
            },

            orange: {
                color: "rgba(230, 126, 34,1.0)",
                backColor: "rgba(230, 126, 34, 0.5)",
                textRepresentation: 'O',
                textRepresentationDead: 'o',
            },

            red: {
                color: "rgba(231, 76, 60, 1.0)",
                backColor: "rgba(231, 76, 60, 0.5)",
                textRepresentation: 'R',
                textRepresentationDead: 'r',
            },
        };
    }

    constructor(colorName, color, backColor, textRepresentation, textRepresentationDead, name) {
        this.color = color;
        this.backColor = backColor;
        this.colorName = colorName;
        this.textRepresentation = textRepresentation;
        this.textRepresentationDead = textRepresentationDead;
        this.score = 0;
        this.name = (name || "Player") + " " + colorName;
        this.emptyTerritoryOccupied = 0;
        this.livePointsCount = 0;
    }

    territoryOccupied() {
        return this.emptyTerritoryOccupied + this.livePointsCount;
    }

    getName() {
        return this.name;
    }


    setScore(score) {
        this.score = score;
    }
}
