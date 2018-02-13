const RModal = require("../rmodal.js");

export const createModal = (eventBus) => {
    eventBus.sub("page_load", () => {
        window.playerNameModal = new RModal(document.getElementById('player-name'), {
            beforeOpen: next => next(),
            afterOpen: () => {
            },
            beforeClose: next => next(),
            afterClose: () => {
                document.forms["player-name"]["playerName"].readOnly = false;
                document.querySelector("#player-name button[type='submit']").style.display = "block";
                document.querySelector("#player-name #ajax-loader").style.display = "none";
            }
        });

        window.playerNameModal.submit = function (e) {
            eventBus.pub("change_current_player_name", document.forms["player-name"]["playerName"].value);
            document.forms["player-name"]["playerName"].readOnly = true;
            document.querySelector("#player-name button[type='submit']").style.display = "none";


            return false;
        };

        document.addEventListener('keydown', ev => window.playerNameModal.keydown(ev), false);

        window.playerNameModal.open();
    })
};
