import { CheckersGame } from './modules/game.js';
import { Board } from './modules/board.js';
import { CheckersDOMPrinter } from './modules/printer.js';
import { Player } from './modules/player.js';
import { Field } from './modules/field.js';
import { Checker } from './modules/checker.js';
import { King } from './modules/king.js';

document.addEventListener("DOMContentLoaded", function () {
  const appContainerRef = document.getElementById("app");

  if (!appContainerRef) {
    throw new Error("App container not found!");
  }

  const board = new Board();
  const printer = new CheckersDOMPrinter({ appContainerRef });
  const game = new CheckersGame({ board, printer });

  const player1 = new Player('Mateusz');
  const player2 = new Player('Anna');

  // game.addPlayer(player1, CheckersGame.getStartingPositionForWhite());
  // game.addPlayer(player2, CheckersGame.getStartingPositionForBlack());

  const player1Index = game.addPlayer(player1);
  const player2Index = game.addPlayer(player2);

  board.setField('21', Field.factory(new Checker(player1Index)));
  board.setField('12', Field.factory(new Checker(player2Index)));
  board.setField('23', Field.factory(new Checker(player2Index)));
  board.setField('54', Field.factory(new King(player1Index)));
  board.setField('43', Field.factory(new King(player2Index)));

  game.init();

  // docelowo zamieścic w CheckersDOMPrinter
  appContainerRef.addEventListener('click', e => {
    if (e.target.classList.contains('piece')) {
      // zaznacz pionek
      const { coord } = e.target.parentElement.dataset;
      const { player: playerIndex } = e.target.dataset

      game.selectPiece(coord, +playerIndex); // znak + oznacza zamień na Number 
    } else if (e.target.classList.contains('cell') && e.target.classList.contains('selected')) {
      // wykonaj ruch
      const { coord } = e.target.dataset;
      game.move(`${game.selectedPiece}-${coord}`);

      if (game.isGameOver()) {
        alert(`Wygrywa gracz: ${game.getLastActivePlayer().name}!`)
      }
    }
  })


});