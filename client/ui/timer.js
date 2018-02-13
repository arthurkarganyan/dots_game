export default class Timer {
    constructor() {
        this.header = document.querySelector("#timer h4");
        this.wrapper = document.querySelector("#timer .wrapper");
        this.filler = this.wrapper.querySelector(".filler");
        this.mask = this.wrapper.querySelector(".mask");
        this.spinner = this.wrapper.querySelector(".spinner");
    }

    activate(turnIndex, mover) {
        this.stop();
        document.querySelector("#timer").style.visibility = "visible";
        this.header.innerText = turnIndex === 0 ? "Your Turn" : "Opponent's Turn";

        let timePassed = 0;
        let step = 500;
        let that = this;
        let tickPlayed = false;

        this.tick = setInterval(() => {
            timePassed += step;
            let grad = (timePassed / this.duration) * 360;
            if (grad <= 360) {
                that.spinner.style.transform = 'rotate(' + grad + 'deg)';
                if (grad > 180) {
                    that.mask.style.opacity = 0;
                    that.filler.style.opacity = 1;
                }

                if (grad > 300 && !tickPlayed && turnIndex === 0) {
                    document.querySelector("audio#tick").play();
                    tickPlayed = true;
                }
            }
        }, step);

        document.querySelector(".wrapper .filler").style.background = mover.color;
        document.querySelector(".wrapper .spinner").style.background = mover.color;
    }

    stop() {
        this.spinner.style.transform = 'rotate(' + 0 + 'deg)';
        this.mask.style.opacity = 1;
        this.filler.style.opacity = 0;
        window.clearInterval(this.tick);
    }

    setDuration(duration) {
        this.duration = duration;
    }

}
