import Cell from "./Cell.js";
import Enemy from "./Enemy.js";
import Evaluator from "./IA/Evaluator.js";
import Player from "./Player.js";
import Unity from "./Unity.js";

class Game {
    constructor(difficulty = 6) {
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

        Game.actualTurn = Math.floor((Math.random() * 100)) % 2 === 0 ? "cross" : "circle";

        this.isFinished = false;
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
        alert("Parabéns, voce venceu!");
        this.isFinished = true;
    }

    lost() {
        alert("Essa não, você perdeu!");
        this.isFinished = true;
    }

    draw() {
        alert("Velha!");
        this.isFinished = true;
    }



    run() {
        if (this.isFinished) {
            return window.location.reload();
        }

        this.update();
        window.requestAnimationFrame(this.run.bind(this));
    }

}

export default Game;