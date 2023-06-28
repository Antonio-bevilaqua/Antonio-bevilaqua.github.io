import Game from "./core/Game.js";
const game = new Game(document.querySelector('canvas'));

const animate = () => {
    game.update();
    requestAnimationFrame(animate);
}

window.onload = function () {
    console.log('loaded');
    animate();
}