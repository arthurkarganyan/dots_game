window.onload = function () {
    window.playerNameModal = new RModal(document.getElementById('player-name'), {
        beforeOpen: next => next(),
        afterOpen: () => {
        },
        beforeClose: next => next(),
        afterClose: () => {
        }
    });

    window.playerNameModal.submit = function (e) {
        window.currentPlayerName = document.forms["player-name"]["playerName"].value;
        document.title = window.currentPlayerName;
        document.forms["player-name"]["playerName"].readOnly = true;
        document.querySelector("#player-name button[type='submit']").style.display = "none";
        document.querySelector("#player-name #ajax-loader").style.display = "block";
        let el = document.querySelector("#player-name #ajax-loader");
        el.classList += "animated fadeIn";

        window.state = "wait";
        window.sendWsMsg({type: "start_wait", msg: {playerName: window.currentPlayerName}});

        return false;
    };

    document.addEventListener('keydown', ev => window.playerNameModal.keydown(ev), false);

    window.playerNameModal.open();
};