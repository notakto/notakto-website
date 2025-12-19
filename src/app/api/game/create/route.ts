import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { gameSessions } from "@/lib/game-sessions";

const CreateGameRequestSchema = z.object({
	sessionId: z.string().min(1).max(256),
	boards: z.array(z.array(z.string())).min(1).max(5),
	numberOfBoards: z.union([
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5),
	]),
	boardSize: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
	difficulty: z.union([
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5),
	]),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const parsed = CreateGameRequestSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: parsed.error.issues },
				{ status: 400 },
			);
		}
		const { sessionId, boards, numberOfBoards, boardSize, difficulty } =
			parsed.data;

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
