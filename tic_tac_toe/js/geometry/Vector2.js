class Vector2 {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
    }

    distance(vector) {
        let diffX = this.X - vector.X;
        let diffY = this.Y - vector.Y;

        return Math.sqrt(Math.pow(diffX) + Math.pow(diffY));
    }
}

export default Vector2;