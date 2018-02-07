window.onload = function () {
    window.playerNameModal = new RModal(document.getElementById('player-name'), {
        beforeOpen: function (next) {
            next();
        }
        , afterOpen: function () {
        }

        , beforeClose: function (next) {
            next();
        }
        , afterClose: function () {
        }
        // , bodyClass: 'modal-open' // , dialogClass: 'modal-dialog' // , dialogOpenClass: 'animated fadeIn' // , dialogCloseClass: 'animated fadeOut'

        // , focus: true
        // , focusElements: ["#player-name button[type='submit']", 'textarea', 'button.btn-primary']
        // , escapeClose: true

    });

    window.playerNameModal.submit = function (e) {
        window.currentPlayerName = document.forms["player-name"]["playerName"].value;
        document.forms["player-name"]["playerName"].readOnly = true;
        // window.playerNameModal.close();
        document.querySelector("#player-name button[type='submit']").style.display = "none";
        document.querySelector("#player-name #ajax-loader").style.display = "block";
        let el = document.querySelector("#player-name #ajax-loader");
        el.classList += "animated fadeIn";
        window.changeState("wait");

        return false;
    };

    document.addEventListener('keydown', (ev) => window.playerNameModal.keydown(ev), false);

    // document.getElementById('showModal').addEventListener("click", function (ev) {
    //     ev.preventDefault();
    // modal.open();
    // }, false);

    // let btns = document.querySelectorAll(".btn-group-toggle .btn");
    // btns.forEach((btn) => {
    //     btn.addEventListener('click', event => {
    //         btns.forEach(i => i.classList.remove("active"));
    //
    //         btn.classList.add("active");
    //     })
    // });


    window.playerNameModal.open();
};