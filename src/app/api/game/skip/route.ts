export const runtime = 'nodejs'; //By adding export const runtime = 'nodejs'; at the top of each API route file, we ensure that the routes are executed using the Node.js runtime, which is required for using Firebase Admin SDK in Next.js API routes. This prevents runtime errors and ensures the proper functioning of Firebase Admin SDK functionalities within your Next.js application.

import { NextRequest, NextResponse } from 'next/server';
import { isBoardDead, updateBoards, findBestMove } from '@/services/ai';
import { calculateRewards } from '@/services/economyUtils';
import { gameSessions } from '@/lib/game-sessions';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    const gameState = gameSessions.get(sessionId);

    if (!gameState) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];

    // Skip the player's turn - let AI move immediately
    gameState.currentPlayer = 2;

    // Make AI move
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

      // Check for game end after AI move
      if (aiBoards.every(board => isBoardDead(board, gameState.boardSize))) {
        const loser = gameState.currentPlayer as 1 | 2;
        const winner = loser === 1 ? 2 : 1;
        const isHumanWinner = winner === 1;
        const rewards = calculateRewards(isHumanWinner, gameState.difficulty,
          gameState.numberOfBoards, gameState.boardSize);

        gameState.winner = winner === 1 ? "You" : "Computer";
        const r = await db(idToken, rewards.coins - 200, rewards.xp);
        if (!r?.success) return NextResponse.json({ error: 'Unauthorized' }, { status: r?.status ?? 403 }); 
        gameSessions.set(sessionId, gameState);
        return NextResponse.json({
          success: true,
          gameState,
          gameOver: true
        });
      }

      gameState.currentPlayer = 1;
    }

    gameSessions.set(sessionId, gameState);
    const charge = await db(idToken, -200, 0);
    if (!charge?.success) return NextResponse.json({ error: 'Unauthorized' }, { status: charge?.status ?? 403 });
    return NextResponse.json({ success: true, gameState, gameOver: false, status: 200 });
  } catch (error) {
    console.error('Skip move error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}