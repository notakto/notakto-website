import { NextRequest, NextResponse } from 'next/server';
import { handlePlayerMove } from '@/lib/game/flow';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, boardIndex, cellIndex } = await request.json();
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = authHeader.split("Bearer ")[1];
    const result = await handlePlayerMove(sessionId, boardIndex, cellIndex, idToken);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Move error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
