import type { BoardNumber, BoardSize, BoardState } from "@/services/types";

export const createInitialBoards = (
	num: BoardNumber,
	size: BoardSize,
): BoardState[] => {
	return Array(num)
		.fill(null)
		.map(() => Array(size * size).fill(""));
};

export const applyMove = (
	boards: BoardState[],
	boardIndex: number,
	cellIndex: number,
): BoardState[] => {
	return boards.map((board, idx) =>
		idx === boardIndex
			? [...board.slice(0, cellIndex), "X", ...board.slice(cellIndex + 1)]
			: [...board],
	);
};
