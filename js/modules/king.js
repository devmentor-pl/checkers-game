import { Piece } from './piece.js';
import { Move } from './move.js'

export class King extends Piece {
  get availableMoves() {
    return [
      Move.factory({ forwardLeft: 0 }),
      Move.factory({ forwardRight: 0 }),
      Move.factory({ backwardLeft: 0 }),
      Move.factory({ backwardRight: 0 }),
    ];
  }
}