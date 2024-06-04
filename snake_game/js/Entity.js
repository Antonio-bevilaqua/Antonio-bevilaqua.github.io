class Entity {
    constructor(position, color) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.color = color;
    }

    update(game) {
        this.updatePosition(game);
    }

    updatePosition(game) {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.loopTroughGrid(game);
    }

    setPosition(newPosition) {
        this.position = newPosition;
    }

    hasColision(entity) {
        let xColides = entity.position.x === this.position.x;
        let yColides = entity.position.y === this.position.y;

        return (xColides && yColides);
    }

    loopTroughGrid(game) {
        if (this.position.x > game.grid.length - 1) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = game.grid.length - 1;
        }

        if (this.position.y > game.grid.length - 1) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = game.grid.length - 1;
        }
    }

    draw(game) {
        game.context.fillStyle = this.color;
        const { x, y } = game.getGridCoordinates(this.position);

        game.context.fillRect(
            x,
            y,
            game.cellSize,
            game.cellSize
        );
    }
}

export default Entity;