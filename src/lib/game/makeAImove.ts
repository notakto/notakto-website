import { findBestMove, updateBoards } from "@/services/ai";
import type { GameState } from "@/services/types";

export function makeAIMove(gameState: GameState) {
	const move = findBestMove(
		gameState.boards,
		gameState.difficulty,
		gameState.boardSize,
		gameState.numberOfBoards,
	);

	if (move) {
		const aiBoards = updateBoards(gameState.boards, move);
		gameState.boards = aiBoards;
		gameState.gameHistory.push(aiBoards);
	}
}
