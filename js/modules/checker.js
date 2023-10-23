import { Piece } from './piece.js';
import { Move } from './move.js';

export class Checker extends Piece {
  get availableMoves() {
    return [
      Move.factory({ forwardLeft: 1 }),
      Move.factory({ forwardRight: 1 }),
      Move.factory({ forwardLeft: 2, isCapture: true }),
      Move.factory({ forwardRight: 2, isCapture: true }),
      Move.factory({ backwardLeft: 2, isCapture: true }),
      Move.factory({ backwardRight: 2, isCapture: true }),
    ];
  }
}