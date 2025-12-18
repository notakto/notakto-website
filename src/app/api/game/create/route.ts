import { type NextRequest, NextResponse } from "next/server";
import { gameSessions } from "@/lib/game-sessions";

export async function POST(request: NextRequest) {
	try {
		//VULNERABILITY: type safety needed here else it can be violated by recieving long/big numbers, maybe use zod
		const { sessionId, boards, numberOfBoards, boardSize, difficulty } =
			await request.json();

		const gameState = {
			boards: boards,
			currentPlayer: 1 as 1 | 2,
			winner: "",
			boardSize,
			numberOfBoards,
			difficulty,
			gameHistory: [boards],
			sessionId: sessionId,
			gameOver: false,
		};

		gameSessions.set(sessionId, gameState);

		return NextResponse.json({
			success: true,
		});
	} catch (error) {
		console.error("Create game error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
