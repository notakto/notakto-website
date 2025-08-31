import { calculateRewards } from '@/services/economyUtils';
import { gameSessions } from '@/lib/game-sessions';
import { GameState } from '@/services/types';
import { db } from '@/lib/db';

export async function handleRewards(gameState: GameState, idToken: string) {
  const loser = gameState.currentPlayer as 1 | 2;
  const winner = loser === 1 ? 2 : 1;
  const isHumanWinner = winner === 1;

  const rewards = calculateRewards(
    isHumanWinner,
    gameState.difficulty,
    gameState.numberOfBoards,
    gameState.boardSize
  );

  gameState.winner = winner === 1 ? "You" : "Computer";
  gameSessions.set(gameState.sessionId, gameState);
  await db(idToken,rewards.coins, rewards.xp);
  return { success: true, gameState, gameOver: true, rewards };
}
