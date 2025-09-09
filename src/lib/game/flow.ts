import { gameSessions } from '@/lib/game-sessions';
import { isValidMove } from './validators';
import { applyMove, isGameOver, switchPlayer } from '@/lib/game/state';
import { makeAIMove } from '@/lib/game/makeAImove';
import { handleRewards } from '@/lib/game/rewards';

export async function handlePlayerMove(sessionId: string, boardIndex: number, cellIndex: number, uid: string, idToken: string) {
  const gameState = gameSessions.get(sessionId);
  if (!gameState) return { error: 'Session not found', status: 404 };
  
  // Bounds checks to avoid OOB access in validators/state helpers
  const board = gameState.boards[boardIndex];
  if (!board || cellIndex < 0 || cellIndex >= board.length) {
    return { error: 'Invalid move', status: 400 };
  }


  if (!isValidMove(gameState, boardIndex, cellIndex)) {
    return { error: 'Invalid move', status: 400 };
  }

  applyMove(gameState, { boardIndex, cellIndex });

  if (isGameOver(gameState)) {
    const rewardsResult = await handleRewards(gameState, uid, idToken);
    return { ...rewardsResult, status: rewardsResult.status ?? 200 };
  }

  switchPlayer(gameState);

  if (gameState.currentPlayer === 2) {
    makeAIMove(gameState);
    if (isGameOver(gameState)) return handleRewards(gameState, uid, idToken);
    switchPlayer(gameState); // back to human
  }

  gameSessions.set(sessionId, gameState);
  return { success: true, gameState, status: 200 };
}
