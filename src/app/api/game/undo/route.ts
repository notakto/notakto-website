import { NextRequest, NextResponse } from 'next/server';
import { gameSessions } from '@/lib/game-sessions';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    const gameState = gameSessions.get(sessionId);
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];
    
    if (!gameState) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    if (gameState.gameHistory.length < 3) {
      return NextResponse.json({ error: 'No moves to undo' }, { status: 400 });
    }
    
    gameState.boards = gameState.gameHistory[gameState.gameHistory.length - 3];
    // Instead of removing history, append-only snapshot for potential redo
    gameState.gameHistory = [
      ...gameState.gameHistory,
      gameState.gameHistory[gameState.gameHistory.length - 3],
    ];
    gameState.currentPlayer = 1;
    if (idToken) await db(idToken, -100, 0);
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