// https://www.kirupa.com/html5/creating_simple_html5_canvas_animation.htm
var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var canvas = canvas.getContext('2d');

var angle = 0;

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

function drawCircle() {
    canvas.clearRect(0, 0, canvas.width, canvas.height);

    // color in the background
    canvas.fillStyle = "#EEEEEE";
    canvas.fillRect(0, 0, canvas.width, canvas.height);

    // draw the circle
    canvas.beginPath();

    var radius = 25 + 150 * Math.abs(Math.cos(angle));
    canvas.arc(225, 225, radius, 0, Math.PI * 2, false);
    canvas.closePath();

    // color in the circle
    canvas.fillStyle = "#006699";
    canvas.fill();

    angle += Math.PI / 64;

    requestAnimationFrame(drawCircle);
}

drawCircle();