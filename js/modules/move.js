export class Move {
  #forwardRight;    // ↗
  #forwardLeft;     // ↖
  #backwardRight;  // ↘
  #backwardLeft;   // ↙
  #isCapture;

  static factory(settings) { // YAGNI (Nie będziesz tego potrzebować, ang. You aren't gonna need it)
    return new Move(settings)
  }

  static calculateMove(coordFrom, coordTo, isCapture = false, inverse = 0) {
    const [rowFrom, colFrom] = coordFrom;
    const [rowTo, colTo] = coordTo;

    const row = inverse ? rowFrom - rowTo : rowTo - rowFrom;
    const col = inverse ? colFrom - colTo : colTo - colFrom;

    if (Math.abs(row) !== Math.abs(col)) {
      throw new Error('Invalid move');
    }

    const distance = {};

    if (row > 0) {
      if (col > 0) {
        distance.backwardRight = Math.abs(row);
      } else {
        distance.backwardLeft = Math.abs(row);
      }
    } else {
      if (col > 0) {
        distance.forwardRight = Math.abs(row);
      } else {
        distance.forwardLeft = Math.abs(row);
      }
    }

    return new Move(distance)
  }

  static isMatch(origin, move) {
    // Object.keys(origin) // => nie zwróci prywatnych pól
    const originKeys = Object.keys(origin.get());
    return originKeys.every(key => {
      const item = origin[key];

      if (typeof item === 'boolean') {
        if (item === move[key]) {
          return true;
        }
      }

      if (typeof item === 'number') {
        if (item === 0 || item === move[key]) {
          return true;
        }
      }

      return false;
    });
  }

  static getPathByCoords(coordFrom, coordTo) {
    let rowDirection = +1; // to to samo co 1, ale IMO jest czytelniejsze
    let colDirection = +1;
    const [rowFrom, colFrom] = coordFrom;
    const [rowTo, colTo] = coordTo;

    if (rowFrom > rowTo) {
      rowDirection = -1;
    }

    if (colFrom > colTo) {
      colDirection = -1;
    }

    const path = [];
    path.push(coordFrom); // tylko do obliczenia następnych współrzędnych

    for (let i = 0; i < Math.abs(rowFrom - rowTo); i++) {
      const [cordLast] = path.slice(-1); // ['62'] => cordLast = '62'
      const [rowLast, colLast] = cordLast;

      const rowCurr = Number(rowLast) + rowDirection;
      const colCurr = Number(colLast) + colDirection
      path.push(rowCurr + '' + colCurr);
    }

    path.shift(); // usuwam pierwszy element tablicy

    return path;
  }

  static getPathByMove(coordFrom, move, inverse = false, limit = 10) { // sporo tych parametrów :(
    const directions = {
      forwardRight: [-1, +1], // podobnie jak wcześniej + IMO jest czytelniejszy
      forwardLeft: [-1, -1],
      backwardRight: [+1, +1],
      backwardLeft: [+1, -1],
    }

    const path = [coordFrom]; // potrzebuję punktu startowego do obliczeń (jak wcześniej)
    for (const key of Object.keys(directions)) {
      if (typeof move[key] !== 'undefined') {
        // DRY!!!
        const count = move[key] || limit; // jeśli `move[key]=0` to ustaw `limit`
        for (let i = 0; i < count; i++) {
          const [cordLast] = path.slice(-1); // ['62'] => cordLast = '62'
          const [rowLast, colLast] = cordLast;

          let [rowDirection, colDirection] = directions[key]
          if (inverse) {
            rowDirection *= -1; // zmiana kierunku dla czarnych
            colDirection *= -1;
          }

          const rowCurr = Number(rowLast) + rowDirection;
          const colCurr = Number(colLast) + colDirection;

          if (rowCurr < 0 || rowCurr >= limit || colCurr < 0 || colCurr >= limit) {
            break; // zakończ pętle for, przekroczyliśmy zakres
          }

          path.push(rowCurr + '' + colCurr);
        }

        break;
        // uznaję, że ruch może być tylko w jedną stronę
        // po pierwszym trafieniu nie potrzebuję kolejnych 
      }
    }

    path.shift(); // usuwam pierwszy element tablicy
    return path;
  }

  constructor({ forwardRight, forwardLeft, backwardRight, backwardLeft, isCapture = false }) {
    this.#forwardRight = forwardRight;
    this.#forwardLeft = forwardLeft;
    this.#backwardRight = backwardRight;
    this.#backwardLeft = backwardLeft;
    this.#isCapture = isCapture;
  }

  get forwardRight() {
    return this.#forwardRight;
  }

  get forwardLeft() {
    return this.#forwardLeft;
  }

  get backwardRight() {
    return this.#backwardRight;
  }

  get backwardLeft() {
    return this.#backwardLeft;
  }

  get isCapture() {
    return this.#isCapture;
  }

  get() {
    const keys = ['forwardRight', 'forwardLeft', 'backwardLeft', 'backwardRight', 'isCapture']
    const distance = {};
    keys.forEach(key => {
      if (typeof this[key] !== 'undefined') { // na polach prywatnych to nie zadziała!
        distance[key] = this[key];
      }
    });


    return distance;
  }
}