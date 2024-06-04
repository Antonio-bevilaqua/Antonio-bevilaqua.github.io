import Entity from "./Entity.js";
import Snake from "./Snake.js";

class Game {
    constructor(canvas, cellSize, gameVelocity, maxScore) {
        this.gameOverDiv = document.getElementById("lose");
        this.winDiv = document.getElementById("win");
        this.scoreSpan = document.getElementById("score");
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.grid = [];
        this.cellSize = cellSize;
        this.score = 0;
        this.velocityCounter = 0;
        this.gameVelocity = gameVelocity;
        this.counter = 0;
        this.running = true;
        this.maxScore = maxScore;

        for (let i = 0; i < 600; i += this.cellSize) {
            let element = [];
            for (let j = 0; j < 600; j += this.cellSize) {
                element.push({
                    x: i,
                    y: j
                });
            }
            this.grid.push(element);
        }

        const { snakePos, applePos } = this.getInitialPositions();

        this.entities = [];
        this.entities.push(
            new Entity(
                applePos,
                "red"
            )
        );
        this.entities.push(
            new Snake(snakePos)
        );
        this.canvas.style.display = "block";
        this.winDiv.style.display = "none";
        this.gameOverDiv.style.display = "none";
        this.scoreSpan.innerText = this.score;
    }

    renewApple() {
        let applePos = null;
        while (applePos === null) {
            applePos = this.getRandomPos();
            for (let part of this.entities[1].entities) {
                if (applePos.x === part.position.x && applePos.y === part.position.y) {
                    applePos = null;
                    break;
                }
            }
        }
        this.entities[0].position = applePos;
        this.velocityCounter++;
        this.score += this.velocityCounter;
        this.scoreSpan.innerText = this.score;
        if (this.score >= this.maxScore) {
            this.win();
            return;
        }
        if (this.velocityCounter % 5 === 0) {
            this.gameVelocity -= 1;
        }
        if (this.gameVelocity <= 1) {
            this.gameVelocity = 1;
        }
    }

    getInitialPositions() {
        let snakePos = this.getRandomPos();
        let applePos = this.getRandomPos();
        while (applePos.x === snakePos.x && applePos.y === snakePos.y) {
            applePos = this.getRandomPos();
        }

        return {
            snakePos,
            applePos
        };
    }

    getRandomPos() {
        return {
            x: Math.floor(Math.random() * this.grid.length),
            y: Math.floor(Math.random() * this.grid.length)
        };
    }

    getGridCoordinates(position) {
        return {
            x: this.grid[position.x][position.y].x,
            y: this.grid[position.x][position.y].y
        }
    }

    update() {
        this.context.reset();
        for (let entity of this.entities) {
            entity.update(this);
        }
    }

    draw() {
        this.entities.forEach((entity) => entity.draw(this));
    }

    run() {
        if (!this.running) {
            return;
        }

        if (this.counter % this.gameVelocity === 0) {
            this.update();
            this.draw();
        }
        this.counter++;
        window.requestAnimationFrame(this.run.bind(this));
    }

    gameOver() {
        this.running = false;
        this.canvas.style.display = "none";
        this.winDiv.style.display = "none";
        this.gameOverDiv.style.display = "flex";
    }

    win() {
        this.running = false;
        this.canvas.style.display = "none";
        this.winDiv.style.display = "flex";
        this.gameOverDiv.style.display = "none";
    }
}


const startGame = () => {
    let snakeGame = new Game(
        document.getElementById("canvas"),
        20,
        20,
        1000
    );
    snakeGame.run();
}

[...document.querySelectorAll('button')].forEach((btn) => {
    btn.addEventListener('click', () => startGame());
})

export default startGame;