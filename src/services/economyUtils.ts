import type { BoardSize, DifficultyLevel } from "@/services/types";

export const calculateRewards = (
	isWin: boolean,
	difficulty: DifficultyLevel,
	numberOfBoards: number,
	boardSize: BoardSize,
) => {
	const baseMultiplier = difficulty * numberOfBoards * boardSize;
	const coinMultiplier = Math.trunc(Math.random() * 5) + 1;
	const xpMultiplier = Math.trunc(Math.random() * 5) + 6;
	return {
		coins: isWin ? baseMultiplier * coinMultiplier : 0,
		xp: isWin ? baseMultiplier * xpMultiplier : baseMultiplier,
	};
};
