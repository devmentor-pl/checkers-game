export class Player {
    #name;
    #score = 0;

    constructor(name) {
        this.name = name;
    }

    // metody/właściwości dostępowe
    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }

    get score() {
        return this.#score;
    }

    set score(value) {
        this.#score = value
    }
}