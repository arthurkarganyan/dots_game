import {playAudio} from "../lib/play_audio";

export const createChatJoint = (eventBus, browser) => {
    let currentPlayerName;
    let ul = browser.document.querySelector(".chat ul");

    eventBus.sub("change_current_player_name", name => currentPlayerName = name);
    eventBus.sub("game_start", () => ul.innerHTML = "");
    eventBus.sub("send_chat_msg.server", data => {
        playAudio("chat");
        eventBus.pub("new_chat_msg", data);
    });
    eventBus.sub("new_chat_msg", (msg) => {
        ul.innerHTML += `<li><span><strong>[${msg.playerName}]</strong> ${msg.text}</span></li>`;
    });

    eventBus.sub("chat_send_button_click", () => {
        let textEl = browser.document.querySelector(".chat input[type=\"text\"]");
        let text = textEl.value;
        eventBus.pub("new_chat_msg", {playerName: currentPlayerName, text: text});
        eventBus.pub("send_ws_msg", {type: "send_chat_msg", msg: {text: text, playerName: currentPlayerName}}); // FIXME
        textEl.value = "";
    });

};