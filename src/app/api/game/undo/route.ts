export const runtime = 'nodejs'; //By adding export const runtime = 'nodejs'; at the top of each API route file, we ensure that the routes are executed using the Node.js runtime, which is required for using Firebase Admin SDK in Next.js API routes. This prevents runtime errors and ensures the proper functioning of Firebase Admin SDK functionalities within your Next.js application.

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
    const r = await db(idToken, -100, 0);
    if (!r?.success) return NextResponse.json({ error: 'Unauthorized' }, { status: r?.status ?? 403 });
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