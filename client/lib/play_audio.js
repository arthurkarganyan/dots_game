export const playAudio = (id) => {
    let audioList = document.querySelector("div#audiolist");
    let el = audioList.querySelector("audio#" + id);
    if (el) {
        el.play();
    } else {
        audioList.innerHTML += `<audio id="${id}"><source src="audio/${id}.mp3" type="audio/mpeg"></audio>`;
        let el = audioList.querySelector("audio#" + id);
        el.play();
    }
};