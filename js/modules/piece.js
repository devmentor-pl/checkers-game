import { Move } from './move.js';

export class Piece { // klasa abstrakcyjna
  _player; // pole chronione (zamierzamy wykorzystać w dziecku)

  constructor(playerIndex) {
    this.player = playerIndex;
  }

  get name() {
    return this.constructor.name.toLowerCase();
  }

  set player(value) { // wsteczna kompatybliność
    this._player = value;
  }

  get player() {
    return this._player;
  }

  set playerIndex(value) {
    this._player = value;
  }

  get playerIndex() {
    return this._player;
  }

  get availableMoves() {
    throw new Error('Implement this method!');
  }

  getMove(from, to, isCapture, inverse) { // SOLID: zasada podstawień Liskov
    const move = Move.calculateMove(from, to, isCapture, inverse);
    return this.availableMoves.find(avMove => {
      return Move.isMatch(avMove, move);
    });
  }
}