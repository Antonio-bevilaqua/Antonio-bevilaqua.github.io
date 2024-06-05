import Game from "./game/Game.js?v=2.0.0";


let game = null;
//nivel de dificuldade 1 a 3.
[...document.querySelectorAll('.options button')].forEach((button) => {
    button.addEventListener('click', (evt) => {
        evt.preventDefault();
        let difficulty = evt.target.getAttribute('difficulty');
        difficulty = (difficulty < 0 ? 0 : (difficulty > 6 ? 6 : difficulty));
        game = new Game(difficulty);
        game.run();
    })
});