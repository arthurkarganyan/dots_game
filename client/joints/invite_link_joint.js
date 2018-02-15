export const createInviteLinkJoint = (eventBus, doc, generateHexFunc, window) => {
    let inviteLinkJoint = {};
    let inviteCode;
    let currentPlayerName;

    const detectInviteLink = () => {
        if (location.href.slice(-1) === "#") return;

        let index = location.href.indexOf("#");
        if (index !== -1)
            inviteCode = location.href.substr(index + 1);
    };

    eventBus.sub("copy_invite_link", () => {
        let copyText = doc.querySelector("#inviteUrl");
        copyText.select();
        doc.execCommand("Copy");

        let copyBtn = doc.querySelector("#copyBtn");
        copyBtn.innerText = "Copied!";
    });

    eventBus.sub("change_current_player_name", name => {
        currentPlayerName = name;

        if (!inviteCode) {
            inviteCode = generateHexFunc(6);
            let domain = doc.location.href.replace("http://", "").split("/")[0];
            doc.querySelector("input#inviteUrl").value = domain + '/#' + inviteCode;

            let inviteDiv = doc.querySelector("div#invite");
            inviteDiv.style.display = "block";
            inviteDiv.classList += "animated fadeIn";
        }

        let ajaxLoader = doc.querySelector("#player-name #ajax-loader");
        ajaxLoader.style.display = "block";
        ajaxLoader.classList += "animated fadeIn";

        window.state = "wait";

        startWait();
    });

    const startWait = (data) => {
        eventBus.pub("send_ws_msg", {
            type: "start_wait",
            msg: {
                playerName: currentPlayerName,
                inviteCode: inviteCode
            }
        });
    };

    const removeMark = () => {
        inviteCode = null;
        let hash = location.hash.replace('#', '');

        if (hash !== '') {
            location.hash = '';
        }
    };

    eventBus.sub("after.page_load", detectInviteLink);
    eventBus.sub("before.game_start", removeMark);
    eventBus.sub("game_start", function hideInviteDiv() {
        let inviteDiv = doc.querySelector("div#invite");
        inviteDiv.style.display = "none";

        let copyBtn = doc.querySelector("#copyBtn");
        copyBtn.innerText = "Copy";
    });

    return inviteLinkJoint;
};