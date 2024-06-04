import Game from "./game/Game.js";


let game = null;
//nivel de dificuldade 1 a 3.
[...document.querySelectorAll('.options button')].forEach((button) => {
    button.addEventListener('click', (evt) => {
        evt.preventDefault();
        let difficulty = evt.target.getAttribute('difficulty');
        difficulty = (difficulty < 0 ? 0 : (difficulty > 5 ? 5 : difficulty));
        game = new Game(difficulty);
        game.run();
    })
});