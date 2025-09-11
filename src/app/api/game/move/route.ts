import { NextRequest, NextResponse } from 'next/server';
import { handlePlayerMove } from '@/lib/game/flow';

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
    const body = await request.json().catch(() => null);
    if (!body || typeof body.sessionId !== "string" || !Number.isInteger(body.boardIndex) || body.boardIndex < 0 || !Number.isInteger(body.cellIndex) || body.cellIndex < 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { sessionId, boardIndex, cellIndex } = body as { sessionId: string; boardIndex: number; cellIndex: number; };
    
    const result = await handlePlayerMove(sessionId, boardIndex, cellIndex, uid, idToken);
    const { status = 200, ...payload } = result as { status?: number };
    return NextResponse.json(payload, { status });
  } catch (error) {
    console.error('Move error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
