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
		if (board[i] < 0 || board[i] >= maxi) continue;

		const boardIndex = Math.floor(board[i] / bs);
		const cellIndex = board[i] % bs;
		ans[boardIndex][cellIndex] = "X";
	}

	return ans;
}
