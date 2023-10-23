import { Piece } from './piece.js';
import { Checker } from './checker.js';
import { King } from './king.js';

export class Field {
    #piece;

    static factory(...params) {
        return new Field(...params);
    }

    static getDefaultPiece() {
        return new Checker()
    }

    constructor(piece = null) {
        this.piece = piece;
    }


    set piece(obj) {
        if (!obj instanceof Piece) { // 4. polimorfizm
            throw new Error(`Incorrect argument`)
        }

        this.#piece = obj;
    }

    get piece() {
        return this.#piece;
    }

    isEmpty() {
        return !this.piece;
    }

    setEmpty() {
        this.piece = null;
    }

    isPieceOwner(playerIndex) {
        if (this.piece) {
            return this.piece.playerIndex === playerIndex;
        }

        return false;
    }

    changeToKing() {
        this.piece = new King(this.piece.playerIndex);
    }
} 