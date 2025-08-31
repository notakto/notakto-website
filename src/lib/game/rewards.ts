export const runtime = 'nodejs'; //By adding export const runtime = 'nodejs'; at the top of each API route file, we ensure that the routes are executed using the Node.js runtime, which is required for using Firebase Admin SDK in Next.js API routes. This prevents runtime errors and ensures the proper functioning of Firebase Admin SDK functionalities within your Next.js application.

import { calculateRewards } from '@/services/economyUtils';
import { gameSessions } from '@/lib/game-sessions';
import { GameState } from '@/services/types';
import { db } from '@/lib/db';

export async function handleRewards(gameState: GameState, idToken: string) {
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
  const dbResult = await db(idToken, rewards.coins, rewards.xp);
  if (!dbResult?.success) {
    return { error: 'Unauthorized', status: dbResult?.status ?? 403 };
  }
  return { success: true, gameState, gameOver: true, rewards, status: 200 };
}
