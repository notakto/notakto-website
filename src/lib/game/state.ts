import { updateBoards, isBoardDead } from '@/services/ai';
import { BoardState, GameState } from '@/services/types';

export function applyMove(gameState: GameState, move: { boardIndex: number; cellIndex: number }) {
  const newBoards = updateBoards(gameState.boards, move);
  gameState.boards = newBoards;
  gameState.gameHistory.push(newBoards);
}

export function isGameOver(gameState: GameState) {
  return gameState.boards.every((board: BoardState) => isBoardDead(board, gameState.boardSize));
}

export function switchPlayer(gameState: GameState) {
  gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
}
