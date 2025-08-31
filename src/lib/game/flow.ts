import { gameSessions } from '@/lib/game-sessions';
import { isValidMove } from './validators';
import { applyMove, isGameOver, switchPlayer } from './state';
import { makeAIMove } from './ai';
import { handleRewards } from './rewards';

export async function handlePlayerMove(sessionId: string, boardIndex: number, cellIndex: number, idToken: string) {
  const gameState = gameSessions.get(sessionId);
  if (!gameState) return { error: 'Session not found', status: 404 };

  if (!isValidMove(gameState, boardIndex, cellIndex)) {
    return { error: 'Invalid move', status: 400 };
  }

  applyMove(gameState, { boardIndex, cellIndex });

  if (isGameOver(gameState)) {
    return handleRewards(gameState, idToken);
  }

  switchPlayer(gameState);

  if (gameState.currentPlayer === 2) {
    makeAIMove(gameState);
    if (isGameOver(gameState)) return handleRewards(gameState,idToken);
    switchPlayer(gameState); // back to human
  }

  gameSessions.set(sessionId, gameState);
  return { success: true, gameState };
}
