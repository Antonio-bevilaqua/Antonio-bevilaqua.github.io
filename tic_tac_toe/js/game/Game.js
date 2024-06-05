import Cell from "./Cell.js?v=1.0.0";
import Enemy from "./Enemy.js?v=1.0.0";
import VirtualGrid from "./IA/VirtualGrid.js?v=1.0.0";
import Player from "./Player.js?v=1.0.0";

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
        Game.board.style.display = "none";
        this.clearAll();
        this.options.style.display = "flex";
        this.result.classList.remove('show');
    }

    update() {
        if (this.isFinished) {
            console.log("finished");
            return;
        }

        if (this.checkGameFinished()) {
            return;
        }

        if (this.playerMark === Game.actualTurn) {
            this.updatePlayer();
        } else {
            this.updateEnemy();
        }
    }

    checkGameFinished() {
        let virtualGrid = new VirtualGrid(Game.grid);

        let winner = virtualGrid.winner();
        if (winner === this.player.type) {
            this.won();
            return true;
        }

        if (winner === this.enemy.type) {
            this.lost();
            return true;
        }

        if (!virtualGrid.hasMoveAvailable()) {
            this.draw();
            return true;
        }

        return false;
    }

    updatePlayer() {
        this.player.update();
    }

    updateEnemy() {
        this.enemy.update();
        Game.actualTurn = this.player.type;
    }

    won() {
        this.topResult.innerHTML = `<i class="fa-solid fa-champagne-glasses icon"></i><h2>PARABÉNS VOCE VENCEU!</h2>`;
        this.topResult.classList.remove('danger');
        this.topResult.classList.add('success');
        this.result.classList.add('show');
        this.isFinished = true;
        Game.actualTurn = null;
    }

    lost() {
        this.topResult.innerHTML = `<i class="fa-solid fa-face-frown-open icon"></i><h2>VOCÊ PERDEU!</h2>`;
        this.topResult.classList.remove('success');
        this.topResult.classList.add('danger');
        this.result.classList.add('show');
        this.isFinished = true;
        Game.actualTurn = null;
    }

    draw() {
        this.topResult.innerHTML = `<i class="fa-solid fa-handshake icon"></i><h2>VELHA!</h2>`;
        this.topResult.classList.remove('success');
        this.topResult.classList.remove('danger');
        this.result.classList.add('show');
        this.isFinished = true;
        Game.actualTurn = null;
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