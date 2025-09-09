import { NextRequest, NextResponse } from 'next/server';
import { gameSessions } from '@/lib/game-sessions';

export async function POST(request: NextRequest) {
  try {
    const { numberOfBoards, boardSize, difficulty } = await request.json();
    const sessionId = Math.random().toString(36).substring(2);
    
    const initialBoards = Array(numberOfBoards).fill(null)
      .map(() => Array(boardSize * boardSize).fill(''));
    
    const gameState = {
      boards: initialBoards,
      currentPlayer: 1 as 1 | 2,
      winner: '',
      boardSize,
      numberOfBoards,
      difficulty,
      gameHistory: [initialBoards],
      sessionId: sessionId,
      gameOver: false
    };
    
    gameSessions.set(sessionId, gameState);
    
    return NextResponse.json({ 
      success: true, 
      sessionId, 
      gameState 
    });
  } catch (error) {
    console.error('Create game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}