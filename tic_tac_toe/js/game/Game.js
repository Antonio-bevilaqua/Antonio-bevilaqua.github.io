import Cell from "./Cell.js";
import Enemy from "./Enemy.js";
import Evaluator from "./IA/Evaluator.js";
import Player from "./Player.js";
import Unity from "./Unity.js";

class Game {
    constructor(difficulty) {
        console.log(difficulty);
        Game.board = document.querySelector(".game");
        let rows = [...Game.board.querySelectorAll('tr')];
        Game.grid = [];

        for (let row of rows) {
            let gridRow = [];
            let cells = [...row.querySelectorAll('td')];
            for (let cell of cells) {
                gridRow.push(new Cell(cell));
            }
            Game.grid.push(gridRow);
        }

        this.playerMark = Math.floor((Math.random() * 100) % 2) === 0 ? "cross" : "circle";

        this.player = new Player(this.playerMark);
        this.enemy = new Enemy(difficulty, this.playerMark === "cross" ? "circle" : "cross");
        this.result = document.querySelector('#result');
        this.topResult = this.result.querySelector('.top-result');
        this.options = document.querySelector('.options');

        this.result.querySelector("button").addEventListener("click", this.hidePlayAgain.bind(this));

        Game.actualTurn = Math.floor((Math.random() * 100)) % 2 === 0 ? "cross" : "circle";

        this.isFinished = false;

        this.options.style.display = "none";
        Game.board.style.display = "table";
    }

    hidePlayAgain() {
        console.log(this.result.classList);
        this.result.classList.remove('show');
    }

    update() {
        if (this.isFinished) {
            return;
        }

        if (this.checkPlayerWin()) {
            return;
        }

        if (this.checkDraw()) {
            return;
        }

        if (this.playerMark === Game.actualTurn) {
            this.updatePlayer();
        } else {
            this.updateEnemy();
        }
    }

    checkDraw() {
        for (let i = 0; i < Game.grid.length; i++) {
            for (let j = 0; j < Game.grid.length; j++) {
                if (Game.grid[i][j].type === null) {
                    return false;
                }
            }
        }

        this.draw();
        return true;
    }

    checkPlayerWin() {
        let evaluator = new Evaluator(Game.grid, this.player.type, 1);
        if (evaluator.evaluateScore(Game.grid, this.player.type) >= Unity.winscore) {
            this.won();
            return true;
        }

        return false;
    }

    updatePlayer() {
        this.player.update();
        if (this.player.hasWon) {
            return this.won();
        }
    }

    updateEnemy() {
        this.enemy.update();
        let evaluator = new Evaluator(Game.grid, this.enemy.type, 1);
        if (evaluator.evaluateScore(Game.grid, this.enemy.type) >= Unity.winscore) {
            return this.lost();
        }
        Game.actualTurn = this.player.type;
    }

    won() {
        this.topResult.innerHTML = `<i class="fa-solid fa-champagne-glasses icon"></i><h2>PARABÉNS VOCE VENCEU!</h2>`;
        this.topResult.classList.remove('danger');
        this.topResult.classList.add('success');
        this.result.classList.add('show');
        this.isFinished = true;
        this.options.style.display = "flex";
        Game.board.style.display = "none";
        this.clearAll();
    }

    lost() {
        this.topResult.innerHTML = `<i class="fa-solid fa-face-frown-open icon"></i><h2>VOCÊ PERDEU!</h2>`;
        this.topResult.classList.remove('success');
        this.topResult.classList.add('danger');
        this.result.classList.add('show');
        this.isFinished = true;
        this.options.style.display = "flex";
        Game.board.style.display = "none";
        this.clearAll();
    }

    draw() {
        this.topResult.innerHTML = `<i class="fa-solid fa-handshake icon"></i><h2>VELHA!</h2>`;
        this.topResult.classList.remove('success');
        this.topResult.classList.remove('danger');
        this.result.classList.add('show');
        this.isFinished = true;
        this.options.style.display = "flex";
        Game.board.style.display = "none";
        this.clearAll();
    }

    clearAll() {
        for (let i = 0; i < Game.grid.length; i++) {
            for (let j = 0; j < Game.grid.length; j++) {
                if (Game.grid[i][j].type !== null) {
                    Game.grid[i][j].clear();
                }
            }
        }
    }

    run() {
        if (this.isFinished) {
            return;
        }

        this.update();
        window.requestAnimationFrame(this.run.bind(this));
    }

}

export default Game;