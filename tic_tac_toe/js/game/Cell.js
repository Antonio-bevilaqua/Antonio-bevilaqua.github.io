class Cell {
    constructor(element) {
        this.element = element;
        this.span = element.querySelector('span');
        this.type = null;
        this.types = ["circle", "cross"];
    }

    mark(type) {
        if (this.type !== null) {
            return;
        }

        let typeIdx = this.types.indexOf(type);
        if (typeIdx === -1) {
            typeIdx = 0;
        }
        let removeTypeIdx = typeIdx === 0 ? 1 : 0;
        
        this.span.classList.remove(this.types[removeTypeIdx]);
        this.span.classList.add("marked");
        this.type = this.types[typeIdx];
    }

    clone() {
        let newCell = new Cell(this.element);
        newCell.type = this.type;
        return newCell;
    }
}

export default Cell;