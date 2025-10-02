import { NextRequest, NextResponse } from 'next/server';
import { gameSessions } from '@/lib/game-sessions';


export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    const gameState = gameSessions.get(sessionId);
    
    if (!gameState) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    const initialBoards = Array(gameState.numberOfBoards).fill(null)
      .map(() => Array(gameState.boardSize * gameState.boardSize).fill(''));
    
    gameState.boards = initialBoards;
    gameState.currentPlayer = 1;
    gameState.winner = '';
    gameState.gameHistory = [initialBoards];
    
    gameSessions.set(sessionId, gameState);
    return NextResponse.json({ success: true, gameState });
  } catch (error) {
    console.error('Reset game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}