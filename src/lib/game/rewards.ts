import { calculateRewards } from '@/services/economyUtils';
import { gameSessions } from '@/lib/game-sessions';
import { GameState } from '@/services/types';
import { db } from '@/lib/db';
export async function handleRewards(gameState: GameState, uid: string, idToken: string) {
  const loser = gameState.currentPlayer as 1 | 2;
  const winner = loser === 1 ? 2 : 1;
  const isHumanWinner = winner === 1;
  gameState.gameOver = true;

  const rewards = calculateRewards(
    isHumanWinner,
    gameState.difficulty,
    gameState.numberOfBoards,
    gameState.boardSize
  );

  gameState.winner = winner === 1 ? "You" : "Computer";
  gameSessions.set(gameState.sessionId, gameState);
  const dbResult = await db(uid, rewards.coins, rewards.xp, idToken);
  if (!dbResult?.success) {
    return { error: 'Database operation failed', status: dbResult?.status ?? 500 };
  }
  return { success: true, gameState, gameOver: true, rewards, status: 200 };
}
