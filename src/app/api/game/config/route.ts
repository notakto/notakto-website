import { NextRequest, NextResponse } from 'next/server';
import { gameSessions } from '@/lib/game-sessions';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, numberOfBoards, boardSize, difficulty } = await request.json();
    const gameState = gameSessions.get(sessionId);
    
    if (!gameState) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    gameState.numberOfBoards = numberOfBoards;
    gameState.boardSize = boardSize;
    gameState.difficulty = difficulty;
    
    // Reset with new configuration
    const initialBoards = Array(numberOfBoards).fill(null)
      .map(() => Array(boardSize * boardSize).fill(''));
    
    gameState.boards = initialBoards;
    gameState.currentPlayer = 1;
    gameState.winner = '';
    gameState.gameHistory = [initialBoards];
    gameSessions.set(sessionId, gameState);
    return NextResponse.json({ success: true, gameState });
  } catch (error) {
    console.error('Config game error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}