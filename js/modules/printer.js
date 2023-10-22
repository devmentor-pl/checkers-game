export class Printer { // umowny interfejs (w JS nie ma takiej struktury)
    init(settings) {
        this.#throwError();
    }

    renderBoard(data) {
        this.#throwError();
    }

    #throwError(message = 'Implement this method') {
        throw new Error(message)
    }
}


export class CheckersDOMPrinter extends Printer {
    #developerMode = true; // Feature Flag

    #boardRef;

    constructor(settings) {
        super();
        this.settings = settings;
    }

    init({ boardData }) {
        const { appContainerRef } = this.settings;

        this.#boardRef = this.#createBoard();
        appContainerRef.appendChild(this.#boardRef);

        this.renderBoard(boardData);
    }

    renderBoard(data) {
        console.log(data);
        this.#boardRef.innerHTML = '';

        data.forEach((row, rowIndex) => {
            row.forEach((field, colIndex) => {
                const fieldRef = this.#createField(rowIndex, colIndex);
                if (field && !field.isEmpty()) {
                    const pieceRef = this.#createPiece(field.piece);
                    fieldRef.appendChild(pieceRef);
                }

                this.#boardRef.appendChild(fieldRef)
            })
        })
    }



    #createBoard() {
        const div = document.createElement('div');
        div.id = 'board';

        return div;
    }

    #createField(row, col) {
        const fieldRef = document.createElement('div');
        fieldRef.dataset.coord = `${row}${col}`;

        fieldRef.className = 'cell';
        fieldRef.classList.add(`c${fieldRef.dataset.coord}`);

        if (this.#developerMode) {
            const coordRef = document.createElement('div');
            coordRef.className = 'coord';
            coordRef.innerText = fieldRef.dataset.coord;

            fieldRef.appendChild(coordRef);

        }

        return fieldRef;
    }

    #createPiece(piece) {
        const div = document.createElement('div');
        div.classList.add('piece', piece.name);
        div.classList.add(`p${piece.player}`)

        div.dataset.player = piece.player;

        return div;
    }
}


