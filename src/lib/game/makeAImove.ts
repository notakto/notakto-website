import { updateBoards, findBestMove } from '@/services/ai';

export function makeAIMove(gameState: any) {
  const move = findBestMove(
    gameState.boards,
    gameState.difficulty,
    gameState.boardSize,
    gameState.numberOfBoards
  );

  if (move) {
    const aiBoards = updateBoards(gameState.boards, move);
    gameState.boards = aiBoards;
    gameState.gameHistory.push(aiBoards);
  }
}
