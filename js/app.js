import { CheckersGame } from './modules/game.js';
import { Board } from './modules/board.js';
import { CheckersDOMPrinter } from './modules/printer.js';
import { Player } from './modules/player.js';

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

  game.addPlayer(player1, CheckersGame.getStartingPositionForWhite());
  game.addPlayer(player2, CheckersGame.getStartingPositionForBlack());

  game.init();

});