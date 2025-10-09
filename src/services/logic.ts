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
