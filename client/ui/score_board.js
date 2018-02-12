export default class ScoreBoard {
    constructor(element, players) {
        this.element = element;
        this.players = players;
        this.tbody = this.element.querySelector("tbody");
    }

    refresh() {
        this.build();
    }

    build() {
        this.tbody.innerHTML = "";
        for (let player of this.players.slice(0).sort((a, b) => b.score - a.score)) {
            let tr = document.createElement("tr");

            tr.appendChild(this._createTd("", "circle", "color: " + player.color));
            tr.appendChild(this._createTd(player.name));

            player.scoreElement = this._createTd(player.score);
            tr.appendChild(player.scoreElement);

            this.tbody.appendChild(tr);
        }

        return this;
    }

    _createTd(text, cssClass, style) {
        let node = document.createElement("td");
        if(text !== undefined)
            node.appendChild(document.createTextNode(text));
        node.className += cssClass;
        if (style)
            node.style = style;
        return node;
    }
}
