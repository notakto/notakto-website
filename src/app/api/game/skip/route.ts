import { NextRequest, NextResponse } from 'next/server';
import { isBoardDead, updateBoards, findBestMove } from '@/services/ai';
import { calculateRewards } from '@/services/economyUtils';
import { gameSessions } from '@/lib/game-sessions';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    
    const uid = request.headers.get("x-user-uid");
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { sessionId } = await request.json();
    const gameState = gameSessions.get(sessionId);

    if (!gameState) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

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
        const r = await db(uid, rewards.coins - 200, rewards.xp, idToken);
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
    const charge = await db(uid, -200, 0, idToken);
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