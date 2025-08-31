import { NextRequest, NextResponse } from 'next/server';
import { handlePlayerMove } from '@/lib/game/flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.sessionId !== "string" || !Number.isInteger(body.boardIndex) || body.boardIndex < 0 || !Number.isInteger(body.cellIndex) || body.cellIndex < 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { sessionId, boardIndex, cellIndex } = body as { sessionId: string; boardIndex: number; cellIndex: number; };
    const authHeader = request.headers.get("authorization") ?? "";
    const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!tokenMatch)return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const idToken = tokenMatch[1].trim();
    const result = await handlePlayerMove(sessionId, boardIndex, cellIndex, idToken);
    const { status = 200, ...payload } = result as { status?: number };
    return NextResponse.json(payload, { status });
  } catch (error) {
    console.error('Move error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
