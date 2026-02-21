import type { BoardState } from "@/services/types";

/** Count total X marks across all boards */
export default function countTotalMoves(boards: BoardState[]): number {
	let count = 0;
	for (const board of boards) {
		for (const cell of board) {
			if (cell === "X") count++;
		}
	}
	return count;
}
