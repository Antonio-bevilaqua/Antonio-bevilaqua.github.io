import Vector2 from "../../geometry/Vector2.js?v=2.0.0";

class VirtualGrid {
    constructor(baseGrid) {
        this.grid = [];
        for (let k = 0; k < baseGrid.length; k++) {
            let virtualRow = [];
            for (let l = 0; l < baseGrid[k].length; l++) {
                virtualRow[l] = baseGrid[k][l].clone();
            }

            this.grid[k] = virtualRow;
        }
        this.diagonals = [
            [new Vector2(0, 0), new Vector2(1, 1), new Vector2(2, 2)],
            [new Vector2(0, 2), new Vector2(1, 1), new Vector2(2, 0)]
        ];
    }

    hasMoveAvailable() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid.length; j++) {
                if (this.grid[i][j].type === null) {
                    return true;
                }
            }
        }

        return false;
    }

    setType(type, position) {
        this.grid[position.X][position.Y].type = type;
    }

    winner() {
        let diagonal1Type = null;
        let diagonal1Score = 0;
        let diagonal2Type = null;
        let diagonal2Score = 0;
        for (let i = 0; i < this.grid.length; i++) {
            let horizontalType = null;
            let horizontalScore = 0;
            let verticalType = null;
            let verticalScore = 0;

            if (this.grid[i][i].type !== diagonal1Type) {
                diagonal1Type = this.grid[i][i].type;
                diagonal1Score = 1;
            } else {
                diagonal1Score++;
            }
            if (diagonal1Score >= 3 && diagonal1Type !== null) {
                return diagonal1Type;
            }

            let k = this.grid.length - 1 - i;
            if (this.grid[i][k].type !== diagonal2Type) {
                diagonal2Type = this.grid[i][k].type;
                diagonal2Score = 1;
            } else {
                diagonal2Score++;
            }
            if (diagonal2Score >= 3 && diagonal2Type !== null) {
                return diagonal2Type;
            }

            for (let j = 0; j < this.grid.length; j++) {
                if (this.grid[i][j].type !== horizontalType) {
                    horizontalType = this.grid[i][j].type;
                    horizontalScore = 1;
                } else {
                    horizontalScore++;
                }
    
                if (horizontalScore >= 3 && horizontalType !== null) {
                    return horizontalType;
                }

                if (this.grid[j][i].type !== verticalType) {
                    verticalType = this.grid[j][i].type;
                    verticalScore = 1;
                } else {
                    verticalScore++;
                }

                if (verticalScore >= 3 && verticalType !== null) {
                    return verticalType;
                }
            }
        }

        return null;
    }

    getScore(type, position) {
        let score = 0;
        let isDiagonal = this.isDiagonal(position);

        for (let i = 0; i < this.grid.length; i++) {
            if (i !== position.Y && this.grid[position.X][i].type === type) {
                score += 100;
            }

            if (i !== position.X && this.grid[i][position.X].type === type) {
                score += 100;
            }
        }

        if (isDiagonal) {
            for (let diagonals of this.diagonals) {
                for (let diag of diagonals) {
                    if (position.X === diag.X && position.Y === diag.Y) {
                        continue;
                    }

                    if (this.grid[diag.X][diag.Y].type === type) {
                        score += 100;
                    }
                }
            }
        }
    
        return score;
    }

    isDiagonal(candidate) {
        for (let positions of this.diagonals) {
            for (let position of positions) {
                if (candidate.X === position.X && candidate.Y === position.Y) {
                    return true;
                }
            }
        }

        return false;
    }


    clone() {
        return new VirtualGrid(this.grid);
    }
}

export default VirtualGrid;