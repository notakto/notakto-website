import type { BoardState } from "@/services/types";

export const isBoardDead = (board: BoardState, boardSize: number) => {
	const size = boardSize;
	for (let i = 0; i < size; i++) {
		const row = board.slice(i * size, (i + 1) * size);
		const col = Array.from({ length: size }, (_, j) => board[i + j * size]);
		if (row.every((c) => c === "X") || col.every((c) => c === "X")) return true;
	}
	const diag1 = Array.from({ length: size }, (_, i) => board[i * (size + 1)]);
	const diag2 = Array.from(
		{ length: size },
		(_, i) => board[(i + 1) * (size - 1)],
	);
	return diag1.every((c) => c === "X") || diag2.every((c) => c === "X");
};
/**
 * Convert the flat boards + isAiMove arrays into per-board cell ownership maps.
 * Player = 1, AI = 2. Returns Record<boardIndex, Record<cellIndex, 1 | 2>>.
 */
export function convertCellOwners(
	boards: number[],
	isAiMove: boolean[],
	numberOfBoards: number,
	boardSize: number,
): Record<number, Record<number, 1 | 2>> {
	const bs = boardSize * boardSize;
	const maxi = numberOfBoards * bs;
	const result: Record<number, Record<number, 1 | 2>> = {};

	for (let i = 0; i < boards.length; i++) {
		if (boards[i] < 0 || boards[i] >= maxi) continue;
		const boardIndex = Math.floor(boards[i] / bs);
		const cellIndex = boards[i] % bs;
		if (!result[boardIndex]) {
			result[boardIndex] = {};
		}
		result[boardIndex][cellIndex] = isAiMove[i] ? 2 : 1;
	}

	return result;
}

export function convertBoard(
	board: number[],
	numberOfBoards: number,
	boardSize: number,
): string[][] {
	const n = board.length;
	const bs = boardSize * boardSize;
	const maxi = numberOfBoards * bs;

	// initialize ans[numberOfBoards][bs] with ""
	const ans: string[][] = Array.from({ length: numberOfBoards }, () =>
		Array(bs).fill(""),
	);

	for (let i = 0; i < n; i++) {
		// Skip invalid indices; -1 is used as a placeholder for skipped moves
		if (board[i] < 0 || board[i] >= maxi) continue;

		const boardIndex = Math.floor(board[i] / bs);
		const cellIndex = board[i] % bs;
		ans[boardIndex][cellIndex] = "X";
	}

	return ans;
}
