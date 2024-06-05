import Vector2 from "../../geometry/Vector2.js?v=1.0.0";
import Unity from "../Unity.js?v=1.0.0";
import VirtualGrid from "./VirtualGrid.js?v=1.0.0";

class Evaluator {
    constructor(grid, enemyType = "cross", steps = 4) {
        this.type = enemyType === "cross" ? "circle" : "cross";
        this.enemyType = enemyType;
        this.vg = new VirtualGrid(grid);
        this.steps = steps;
        this.maxScore = 0;
        this.foundWin = false;
    }

    evaluate() {
        this.possiblePositions = [];

        for (let i = 0; i < this.vg.grid.length; i++) {
            for (let j = 0; j < this.vg.grid[i].length; j++) {
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

        return this.possiblePositions[randomIdx].vector;
    }

    evaluatePosition(i, j) {
        if (this.vg.grid[i][j].type !== null) {
            return false;
        }

        let position = new Vector2(i, j);
        //dificuldade mínima, jogo é randomico
        if (this.steps === 0) {
            return this.easyEvaluation(position);
        }

        this.stepEvaluation(position);
    }

    easyEvaluation(position) {
        return this.possiblePositions.push({
            score: 100,
            vector: position
        });
    }

    stepEvaluation(position) {
        let stepVirtualGrid = this.vg.clone();
        stepVirtualGrid.setType(this.type, position);
        let winner = stepVirtualGrid.winner();
        let score = this.getScoreByWinner(stepVirtualGrid, position, winner);

        if (this.steps <= 1 || score === Unity.winscore || score === Unity.losescore) {
            return this.possiblePositions.push({
                score: score,
                vector: position
            });
        }

        let newEvaluator = new Evaluator(this.vg.grid, this.type, this.steps - 1);
        newEvaluator.vg.setType(this.type, position);
        newEvaluator.evaluate();
        let evalScore = newEvaluator.maxScore;
        switch (evalScore) {
            case Unity.winscore:
                return this.possiblePositions.push({
                    score: Unity.losescore,
                    vector: position
                });
            case Unity.losescore:
                return this.possiblePositions.push({
                    score: Unity.winscore,
                    vector: position
                });
            default:
                return this.possiblePositions.push({
                    score: score - evalScore,
                    vector: position
                });
        }
    }

    getScoreByWinner(stepVirtualGrid, position, winner) {
        if (winner === null) {
            return stepVirtualGrid.getScore(this.type, position);
        }

        if (winner === this.type) {
            return Unity.winscore;
        }
        return Unity.losescore;
    }
}

export default Evaluator;