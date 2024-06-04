import Unity from "../Unity.js";

class Evaluator {
    constructor(grid, enemyType = "cross", steps = 4, log = true, name = "test") {
        this.type = enemyType === "cross" ? "circle" : "cross";
        this.enemyType = enemyType;
        this.grid = grid;
        this.steps = steps;
        this.maxScore = 0;
        this.foundWin = false;
        this.log = log;
        this.name = name;
    }

    evaluate() {
        this.possiblePositions = [];

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                this.evaluatePosition(i, j);
            }
        }

        this.possiblePositions.sort((a, b) => {
            return b.score - a.score;
        });

        if (this.possiblePositions.length === 0) {
            return [];
        }
        this.maxScore = this.possiblePositions[0].score;

        let maxLength = 0;
        for (let i = 1; i < this.possiblePositions.length; i++) {
            if (this.possiblePositions[i].score === this.maxScore) {
                maxLength = i;
            }
        }

        let randomIdx = Math.floor(Math.random() * maxLength);

        return this.possiblePositions[randomIdx];
    }

    evaluatePosition(i, j) {
        if (this.grid[i][j].type !== null) {
            return false;
        }

        //dificuldade mínima, jogo é randomico
        if (this.steps === 0) {
            return this.possiblePositions.push({
                score: 1,
                i: i,
                j: j
            });
        }

        this.createVirtualGrid();
        this.virtualGrid[i][j].type = this.type;

        
        let score = this.evaluateScore(this.virtualGrid, this.type);

        if (score >= Unity.winscore) {
            return this.possiblePositions.push({
                score: Unity.winscore,
                i: i,
                j: j
            });
        }

        if (this.steps > 1) {
            score = this.evaluateSteps(score);
        }

        this.possiblePositions.push({
            score: score,
            i: i,
            j: j
        });
    }

    evaluateSteps(score) {
        let nextEnemyMoveScore = this.evaluateNextEnemyMove();
        if (nextEnemyMoveScore === null) {
            return score;
        }
        if (nextEnemyMoveScore >= Unity.winscore) {
            return Unity.losescore;
        }
        score -= nextEnemyMoveScore;

        score = this.evaluateFutureSteps(score);

        return score;
    }

    evaluateFutureSteps(actualScore) {
        if (this.steps <= 1) {
            return actualScore;
        }

        let weight = 2;
        for (let k = 1; k < this.steps; k++) {
            let nextMoveScore = this.evaluateNextMove();
            if (nextMoveScore === null) {
                break;
            }
            if (nextMoveScore >= Unity.winscore) {
                return Unity.winscore / weight;
            }
            actualScore += nextMoveScore / weight;

            let nextEnemyMoveScore = this.evaluateNextEnemyMove();
            if (nextEnemyMoveScore === null) {
                break;
            }
            if (nextEnemyMoveScore >= Unity.winscore) {
                return Unity.losescore / weight;
            }
            actualScore -= nextEnemyMoveScore / weight;
            weight++;
        }

        return actualScore;
    }

    evaluateNextMove() {
        if (!this.isVirtualGridMoveAvailable()) {
            return null;
        }

        let nextEvaluation = new Evaluator(this.virtualGrid, this.enemyType, 1, false);
        nextEvaluation.evaluate();

        if (nextEvaluation.maxScore >= Unity.winscore) {
            return Unity.winscore;
        }
        this.virtualGrid = nextEvaluation.getVirtualGrid();

        return nextEvaluation.maxScore;
    }

    evaluateNextEnemyMove() {
        if (!this.isVirtualGridMoveAvailable()) {
            return null;
        }
        let enemyEvaluator = new Evaluator(this.virtualGrid, this.type, 1, false);
        enemyEvaluator.evaluate();

        if (enemyEvaluator.maxScore >= Unity.winscore) {
            return Unity.winscore;
        }

        this.virtualGrid = enemyEvaluator.getVirtualGrid();
        return enemyEvaluator.maxScore;
    }

    createVirtualGrid() {
        this.virtualGrid = [];
        for (let k = 0; k < this.grid.length; k++) {
            let virtualRow = [];
            for (let l = 0; l < this.grid[k].length; l++) {
                virtualRow[l] = this.grid[k][l].clone();
            }

            this.virtualGrid[k] = virtualRow;
        }
    }

    getVirtualGrid() {
        return this.virtualGrid;
    }

    isVirtualGridMoveAvailable() {
        for (let i = 0; i < this.virtualGrid.length; i++) {
            for (let j = 0; j < this.virtualGrid.length; j++) {
                if (this.virtualGrid[i][j].type === null) {
                    return true;
                }
            }
        }

        return false;
    }

    evaluateScore(grid, type) {
        let totalScore = 0;
        for (let i = 0; i < grid.length; i++) {
            let horizontalEval = this.evaluateHorizontally(grid, i, type);
            if (horizontalEval === 3) {
                return Unity.winscore;
            }
            totalScore += horizontalEval;
            let verticalEval = this.evaluateVertically(grid, i, type);
            if (verticalEval === 3) {
                return Unity.winscore;
            }
            totalScore += verticalEval;
        }

        let diagonalEval = this.evaluateDiagonalOne(grid, type);
        if (diagonalEval >= 3) {
            return Unity.winscore;
        }
        totalScore += diagonalEval;

        let diagonalTwoEval = this.evaluateDiagonalTwo(grid, type);
        if (diagonalTwoEval >= 3) {
            return Unity.winscore;
        }
        totalScore += diagonalTwoEval;
        return totalScore;
    }

    evaluateHorizontally(grid, i, type) {
        let score = 0;
        for (let k = 0; k < grid.length; k++) {
            if (grid[i][k].type === type) {
                score++;
            }
        }
        return score;
    }

    evaluateVertically(grid, i, type) {
        let score = 0;
        for (let k = 0; k < grid.length; k++) {
            if (grid[k][i].type === type) {
                score++;
            }
        }
        return score;
    }

    evaluateDiagonalOne(grid, type) {
        let score = 0;
        for (let i = 0; i < grid.length; i++) {
            if (grid[i][i].type === type) {
                score++;
            }
        }
        return score;
    }

    evaluateDiagonalTwo(grid, type) {
        let score = 0;
        for (let i = 0; i < grid.length; i++) {
            let j = grid.length - 1 - i;
            if (grid[i][j].type === type) {
                score++;
            }
        }
        return score;
    }
}

export default Evaluator;