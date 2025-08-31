import { isBoardDead } from '@/services/ai';

export function isValidMove(gameState: any, boardIndex: number, cellIndex: number) {
  return (
    gameState.boards[boardIndex][cellIndex] === '' &&
    !isBoardDead(gameState.boards[boardIndex], gameState.boardSize)
  );
}
