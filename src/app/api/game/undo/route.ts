import { NextRequest, NextResponse } from 'next/server';
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

    if (gameState.gameHistory.length < 3) {
      return NextResponse.json({ error: 'No moves to undo' }, { status: 400 });
    }

    const target = gameState.gameHistory[gameState.gameHistory.length - 3];
    gameState.gameHistory = gameState.gameHistory.slice(0, -2);
    gameState.boards = target;
    gameState.currentPlayer = 1;
    gameState.winner = '';
    gameState.gameOver = false;
    const r = await db(uid, -100, 0, idToken);
    if (!r?.success) return NextResponse.json({ error: 'Database operation failed' }, { status: r?.status ?? 500 });
    gameSessions.set(sessionId, gameState);
    return NextResponse.json({ success: true, gameState });
  } catch (error) {
    console.error('Undo move error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
