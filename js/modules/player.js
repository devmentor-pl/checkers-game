export class Player {
    #name;

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
}