export default class Timer {
    constructor(timeIsUpFunc) {
        this.header = document.querySelector("#timer h4");
        this.wrapper = document.querySelector("#timer .wrapper");
        this.filler = this.wrapper.querySelector(".filler");
        this.mask = this.wrapper.querySelector(".mask");
        this.spinner = this.wrapper.querySelector(".spinner");
    }

    activate(turnIndex, currentPlayerTurn) {
        this.stop();
        document.querySelector("#timer").style.visibility = "visible";
        this.header.innerText = turnIndex === 0 ? "Your Turn" : "Opponent's Turn";

        let timePassed = 0;
        let step = 500;
        let that = this;

        this.tick = setInterval(() => {
            timePassed += step;
            let grad = (timePassed / this.duration) * 360;
            if (grad <= 360) {
                that.spinner.style.transform = 'rotate(' + grad + 'deg)';
                if (grad > 180) {
                    that.mask.style.opacity = 0;
                    that.filler.style.opacity = 1;
                }
            }
        }, step);

        // if (turnIndex === 0) {
        //     setTimeout(() => {
        //         that.stop();
        //         that.timeIsUpFunc();
        //     }, DURATION);
        // }

        document.querySelector(".wrapper .filler").style.background = currentPlayerTurn.color;
        document.querySelector(".wrapper .spinner").style.background = currentPlayerTurn.color;
        // this.wrapper.classList += " active";
    }

    stop() {
        // this.wrapper.classList.remove("active");
        this.spinner.style.transform = 'rotate(' + 0 + 'deg)';
        this.mask.style.opacity = 1;
        this.filler.style.opacity = 0;
        window.clearInterval(this.tick);
    }

    setDuration(duration) {
        this.duration = duration;
    }
}
