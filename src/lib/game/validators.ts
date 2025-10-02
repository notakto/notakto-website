import { isBoardDead } from '@/services/ai';
import type { GameState } from '@/services/types';
export function isValidMove(
  gameState: GameState,
  boardIndex: number,
  cellIndex: number
): boolean {
  const boards = gameState?.boards;
  const size = gameState?.boardSize;
  if (!Array.isArray(boards)) return false;
  if (!Number.isInteger(boardIndex) || boardIndex < 0 || boardIndex >= boards.length) return false;
  const board = boards[boardIndex];
  const expectedLen = size * size;
  if (!Array.isArray(board) || board.length !== expectedLen) return false;
  if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex >= expectedLen) return false;
  return board[cellIndex] === '' && !isBoardDead(board, size);
}