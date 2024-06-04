class Unity {
    constructor (type) {
        let possibleTypes = ["cross", "circle"];
        let typeIdx = possibleTypes.indexOf(type);
        this.type = typeIdx >= 0 ? possibleTypes[typeIdx] : possibleTypes[0];
        this.turnFinished = false;
        Unity.winscore = 100000;
        Unity.losescore = -100000;
    }

    update() {
        this.play();
    }

    play() {
        throw Error('You need to implement play method!');
    }
}

export default Unity;