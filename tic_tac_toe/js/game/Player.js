import Game from "./Game.js";
import Evaluator from "./IA/Evaluator.js";
import Unity from "./Unity.js";

class Player extends Unity {
    constructor(type = "cross") {
        super(type);
        this.isPlaying = false;
        this.hasWon = false;
        this.addListeners();
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
        }
    }

    addListeners() {
        window.addEventListener('click', this.onClick.bind(this))
    }

    onClick(evt) {
        if (Game.actualTurn !== this.type) {
            return;
        }
        evt.preventDefault();
        for (let i = 0; i < Game.grid.length; i++) {
            for (let j = 0; j < Game.grid[i].length; j++) {
                if (Game.grid[i][j].element === evt.target) {
                    this.markIj(i, j);
                    break;
                }
            }
        }
    }

    markIj(i, j) {
        Game.grid[i][j].mark(this.type);
        Game.grid[i][j].type = this.type;
        this.isPlaying = false;
        this.turnFinished = true;
        
        Game.actualTurn = this.type === "cross" ? "circle" : "cross";
    }
}

export default Player;