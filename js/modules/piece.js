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
}