import Game from "./Game.js";
import Evaluator from "./IA/Evaluator.js";
import Unity from "./Unity.js";

class Enemy extends Unity {
    constructor(dificulty = 1, type = "circle") {
        super(type);
        this.isPlaying = false;
        this.dificulty = dificulty;
        this.hasWon = false;
    }

    play() {
        this.evaluateMove();
    }

    evaluateMove() {
        let evaluator = new Evaluator(Game.grid, this.type === "circle" ? "cross" : "circle", this.dificulty);
        let move = evaluator.evaluate();
        
        Game.grid[move.i][move.j].mark(this.type);
        this.isPlaying = false;
        this.turnFinished = true;
    }
}

export default Enemy;