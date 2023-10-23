import { Field } from './field.js';

export class Board { // 1. enkapsulacja
  // 2. abstrakcja
  #fieldsList = [
    ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'],
    ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
    ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
    ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
    ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49'],
    ['50', '51', '52', '53', '54', '55', '56', '57', '58', '59'],
    ['60', '61', '62', '63', '64', '65', '66', '67', '68', '69'],
    ['70', '71', '72', '73', '74', '75', '76', '77', '78', '79'],
    ['80', '81', '82', '83', '84', '85', '86', '87', '88', '89'],
    ['90', '91', '92', '93', '94', '95', '96', '97', '98', '99'],
  ];

  get fieldsList() {
    // tworzę kopię danych tylko do odczytu
    // nie chce pozwolić na modyfikację danych
    // poza udostępnionym interfejsem tj. setField
    //
    // zabezpieczenie przed:
    // const fieldsList = board.fieldsList
    // fieldsList[0][0] = new Field();
    const fieldsList = this.#fieldsList.map(row => {
      return Object.freeze([...row]);
    });

    return Object.freeze([...fieldsList]);
  }

  static getDefaultPiece() {
    return Field.getDefaultPiece();
  }

  init() {
    // uzupełniam resztę pól
    for (let i = 0; i < this.#fieldsList.length; i++) {
      for (let j = 0; j < this.#fieldsList.length; j++) {
        const field = this.getField(i + '' + j);
        if (!(field instanceof Field)) { // jeśli nie zainicjonowano pola to zrób to
          this.setField(`${i}${j}`, new Field())
        }
      }
    }
  }

  // SOLID: zasada jednej odpowiedzialności (SRP)
  // createBoard() { 
  //   const boardGrid = document.createElement("div");
  //   boardGrid.id = "board";

  //   this.boardRef.appendChild(boardGrid);
  // }

  getField = function (coord) {
    if (!this.#isCorrectCoord(coord)) {
      throw new Error('Incorrect coords!');
    }

    const [rowIndex, colIndex] = coord;
    return this.#fieldsList[rowIndex][colIndex];
  }

  setField = function (coord, value) {
    if (!this.#isCorrectCoord(coord)) {
      throw new Error(`Incorrect coord!`);
    }

    const [rowIndex, colIndex] = coord;
    this.#fieldsList[rowIndex][colIndex] = value;
  }

  insertPieces(pieces, playerIndex) {
    const coords = Object.keys(pieces);
    coords.forEach(coord => {
      const piece = pieces[coord];
      piece.player = playerIndex;

      this.setField(coord, Field.factory(piece));
    })
  }

  #isCorrectCoord = function (coord) {
    return /^[0-9]{2}$/i.test(coord);
  }
}
