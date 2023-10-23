import { Field } from './field.js';
import { Move } from './move.js';

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

  #promotionRowByPlayerIndex = ['0', '9'];

  get fieldsList() {
    // tworzę kopię danych tylko do odczytu
    // nie chce pozwolić na modyfikację danych
    // poza udostępnionym interfejsem np:
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

  getAvailableMoves(coord, onlyCaptures = false) {
    const field = this.getField(coord);
    const { piece } = field;
    const { player: playerIndex } = piece;

    const coords = [];
    const moves = onlyCaptures ? piece.availableCaptures : piece.availableMoves;
    moves.forEach(move => {
      const path = this.#cutPathToFirstOwnPiece(Move.getPathByMove(coord, move, playerIndex), playerIndex);
      if (!move.isCapture || this.#getCoordsOponentForCapture(path, playerIndex).length > 0) {
        path.forEach(coord => {
          const field = this.getField(coord);
          if (field.isEmpty() && !coords.includes(coord)) {
            coords.push(coord);
          }
        })
      }
    });

    return coords;
  }

  move(notation, playerIndex, incrementScoreCallback) {
    const [from, to] = notation.split('-'); // 52-43 => from=52, to=43
    if (!this.#isCorrectCoord(from)) {
      throw new Error('Incorrect "from" coord');
    }

    if (!this.#isCorrectCoord(to)) {
      throw new Error(`Incorrect "to" coord`);
    }

    const fieldFrom = this.getField(from);
    const fieldTo = this.getField(to);

    if (fieldFrom.isEmpty()) {
      throw new Error('Field "from" is empty!');
    }

    if (!fieldFrom.isPieceOwner(playerIndex)) {
      throw new Error('You can\'t move this piece!');
    }

    if (!fieldTo.isEmpty()) {
      throw new Error('Field "to" is not empty!');
    }

    const path = Move.getPathByCoords(from, to);
    const coordsOponent = this.#getCoordsOponentForCapture(path, playerIndex)
    const isCapture = coordsOponent.length > 0;

    const { piece } = fieldFrom;
    const inverse = !!playerIndex; // !!0 => false, !!1 => true
    const move = piece.getMove(from, to, isCapture, inverse);
    if (!move) {
      throw new Error('This move is not correct!');
    }

    if (isCapture) {
      if (coordsOponent.length > 0) {
        coordsOponent.forEach(coord => {
          const field = this.getField(coord);
          field.setEmpty();
        });

        incrementScoreCallback(coordsOponent.length);
      } else {
        throw new Error('There is not oponent piece');
      }
    }

    fieldTo.piece = fieldFrom.piece;
    fieldFrom.setEmpty();

    const [rowTo] = to;
    if (this.#promotionRowByPlayerIndex[playerIndex] === rowTo && fieldTo.piece.name === 'checker') {
      fieldTo.changeToKing()
    }
  }

  countPlayerPieces(playerIndex) {
    let count = 0;
    for (let i = 0; i < this.#fieldsList.length; i++) { // DRY
      for (let j = 0; j < this.#fieldsList.length; j++) {
        const field = this.getField(i + '' + j);
        if (!field.isEmpty() && field.isPieceOwner(playerIndex)) {
          count++;
        }
      }
    }

    return count;
  }

  reset() {
    this.#forEachFields((row, col) => {
      this.setField(`${row}${col}`, null);
    });
  }

  #forEachFields(callback) { // callback(row, col) 
    for (let i = 0; i < this.#fieldsList.length; i++) {
      for (let j = 0; j < this.#fieldsList.length; j++) {
        callback(i, j);
      }
    }
  }

  #isCorrectCoord = function (coord) {
    return /^[0-9]{2}$/i.test(coord);
  }

  #cutPathToFirstOwnPiece(path, playerIndex) {
    //return path;
    const newPath = [];
    for (let i = 0; i < path.length; i++) { // potrzebuję przerwać działanie w odpowiednim momencie
      const coord = path[i];
      const field = this.getField(coord);
      if (!field.isEmpty() && field.isPieceOwner(playerIndex)) {
        break; // zakończ działanie jak znajdziesz własnego pionka
      }

      newPath.push(coord);
    }

    return newPath;
  }

  #getCoordsOponentForCapture(path, playerIndex) {
    const pathWithoutLast = path.slice(0, -1);

    const coords = []
    pathWithoutLast.forEach((coord, index) => {
      const field = this.getField(coord);
      if (!field.isEmpty() && !field.isPieceOwner(playerIndex)) {
        const nextField = pathWithoutLast[index + 1] && this.getField(pathWithoutLast[index + 1]);
        if (!nextField || nextField.isEmpty()) {
          coords.push(coord);
        }
      }
    });

    return coords;
  }
}
