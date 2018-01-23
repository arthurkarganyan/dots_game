export default class Player {
    static build(colorName) {
        let obj = this.presets()[colorName];
        if (!obj)
            throw `Incorrect color name: ${colorName}`;

        return new Player(colorName, obj['color'], obj['backColor'], obj['textRepresentation'])
    }

    static colorNames() {
        let presetsTemp = this.presets();
        let keys = [];
        for(let k in presetsTemp)
            keys.push(k);

        return keys;
        // colorName = keys[Math.floor(Math.random()*keys.length)];
    }

    static presets() {
        return {
            aquamarine: {
                color: "rgba(26, 188, 156, 1.0)",
                backColor: "rgba(26, 188, 156, 0.5)",
                textRepresentation: '!',
            },

            green: {
                color: "rgba(46, 204, 113, 1.0)",
                backColor: "rgba(46, 204, 113, 0.5)",
                textRepresentation: '@',
            },

            blue: {
                color: "rgba(52, 152, 219, 1.0)",
                backColor: "rgba(52, 152, 219, 0.3)",
                textRepresentation: '#',
            },

            violet: {
                color: "rgba(155, 89, 182,1.0)",
                backColor: "rgba(155, 89, 182,0.5)",
                textRepresentation: '$',
            },

            black: {
                color: "rgba(52, 73, 94, 1.0)",
                backColor: "rgba(52, 73, 94, 0.5)",
                textRepresentation: '%',
            },

            yellow: {
                color: "rgba(241, 196, 15,1.0)",
                backColor: "rgba(241, 196, 15, 0.5)",
                textRepresentation: '^',
            },

            orange: {
                color: "rgba(230, 126, 34,1.0)",
                backColor: "rgba(230, 126, 34, 0.5)",
                textRepresentation: '&',
            },

            red: {
                color: "rgba(231, 76, 60, 1.0)",
                backColor: "rgba(231, 76, 60, 0.5)",
                textRepresentation: '&',
            },
        };
    }

    constructor(colorName, color, backColor, textRepresentation) {
        this.color = color;
        this.backColor = backColor;
        this.colorName = colorName;
        this.textRepresentation = textRepresentation;
    }
}
