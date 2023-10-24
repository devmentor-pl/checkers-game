import { Piece } from './piece.js';
import { Move } from './move.js';

export class Checker extends Piece {
  get availableMoves() {
    return [
      Move.factory({ forwardLeft: 1 }),
      Move.factory({ forwardRight: 1 }),
    ];
  }
}