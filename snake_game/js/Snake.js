import Entity from "./Entity.js";

class Snake {
    constructor(position) {
        this.entities = [
            new Entity(
                position,
                "green"
            )
        ];

        let direction = (Math.floor(Math.random() * 100) % 2 === 0) ? "x" : "y";

        let factor = (Math.floor(Math.random() * 100) % 2 === 0) ? 1 : -1;

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.velocity[direction] = 1 * factor;
        this.pressedKeys = null;
        window.addEventListener("keyup", this.keyBoardListener.bind(this));
    }

    update(game) {
        if (typeof this[this.pressedKeys + "Pressed"] === "function") {
            this[this.pressedKeys + "Pressed"]();
        }
        for (let i = this.entities.length - 1; i >= 0; i--) {
            if (i === 0) {
                this.entities[i].velocity = this.velocity;
            } else {
                this.entities[i].velocity = this.entities[i - 1].velocity;
            }
            this.entities[i].update(game);
        }
        this.checkAppleColision(game);
        this.checkPartColision(game);
    }

    checkAppleColision(game) {
        if (this.entities[0].hasColision(game.entities[0])) {
            game.renewApple();

            let lastEntity = this.entities[this.entities.length - 1];
            let newEntity = new Entity(
                { ...lastEntity.position },
                "green"
            );
            newEntity.velocity = { ...lastEntity.velocity };
            newEntity.velocity.x *= -1;
            newEntity.velocity.y *= -1;
            newEntity.updatePosition(game);
            newEntity.velocity = { ...lastEntity.velocity };


            this.entities.push(newEntity);
        }
    }

    checkPartColision(game) {
        for (let i = 1; i < this.entities.length; i++) {
            if (this.entities[0].position.x === this.entities[i].position.x 
                && this.entities[0].position.y === this.entities[i].position.y) {
                game.gameOver();
                break;
            }
        }
    }



    keyBoardListener(evt) {
        this.pressedKeys = evt.key;
    }

    ArrowUpPressed() {
        if (this.velocity.y === 1) return;
        this.velocity = {
            x: 0,
            y: -1
        };
    }

    ArrowDownPressed() {
        if (this.velocity.y === -1) return;
        this.velocity = {
            x: 0,
            y: 1
        };
    }

    ArrowLeftPressed() {
        if (this.velocity.x === 1) return;
        this.velocity = {
            x: -1,
            y: 0
        };
    }

    ArrowRightPressed() {
        if (this.velocity.x === -1) return;
        this.velocity = {
            x: 1,
            y: 0
        };
    }

    draw(game) {
        for (let entity of this.entities) {
            entity.draw(game);
        }
    }
}

export default Snake;