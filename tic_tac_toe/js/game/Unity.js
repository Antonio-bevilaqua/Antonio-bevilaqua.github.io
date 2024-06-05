class Unity {
    constructor (type) {
        let possibleTypes = ["cross", "circle"];
        let typeIdx = possibleTypes.indexOf(type);
        this.type = typeIdx >= 0 ? possibleTypes[typeIdx] : possibleTypes[0];
        this.turnFinished = false;
        Unity.winscore = 9999999;
        Unity.losescore = -99999999;
    }

    update() {
        this.play();
    }

    play() {
        throw Error('You need to implement play method!');
    }
}

export default Unity;