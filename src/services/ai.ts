// ai.ts
import type { BoardSize, BoardState, DifficultyLevel } from "@/services/types";

//
// ——— Helpers for win detection —————————————————————————————————————
//
const winPatternsCache = new Map<number, number[][]>();

function getWinPatterns(size: number): number[][] {
	if (winPatternsCache.has(size)) {
		const cached = winPatternsCache.get(size);
		if (cached) return cached;
		return [];
	}
	const patterns: number[][] = [];

	// rows & cols
	for (let i = 0; i < size; i++) {
		patterns.push(
			Array.from({ length: size }, (_, j) => i * size + j),
			Array.from({ length: size }, (_, j) => i + j * size),
		);
	}
	// diags
	patterns.push(
		Array.from({ length: size }, (_, i) => i * (size + 1)),
		Array.from({ length: size }, (_, i) => (i + 1) * (size - 1)),
	);

	winPatternsCache.set(size, patterns);
	return patterns;
}

export function isBoardDead(board: BoardState, boardSize: number): boolean {
	const patterns = getWinPatterns(boardSize);
	return patterns.some((pat) => pat.every((i) => board[i] === "X"));
}

//
// ——— Cell‑value heuristic for move ordering —————————————————————————
//
const cellValueCache = new Map<number, Map<number, number>>();

function getCellValue(cellIndex: number, boardSize: number): number {
	if (!cellValueCache.has(boardSize)) {
		const m = new Map<number, number>();
		const center = (boardSize - 1) / 2;
		for (let i = 0; i < boardSize * boardSize; i++) {
			const r = Math.floor(i / boardSize),
				c = i % boardSize;
			m.set(i, -(Math.abs(r - center) + Math.abs(c - center)));
		}
		cellValueCache.set(boardSize, m);
	}
	const boardMap = cellValueCache.get(boardSize);
	if (!boardMap) {
		throw new Error(`No cell value map found for board size ${boardSize}`);
	}
	const value = boardMap.get(cellIndex);
	if (value === undefined) {
		throw new Error(
			`No cell value found for cell index ${cellIndex} on board size ${boardSize}`,
		);
	}
	return value;
}

//
// ——— Valid moves & board updates ———————————————————————————————
//
export function getValidMoves(
	boards: BoardState[],
	boardSize: number,
): { boardIndex: number; cellIndex: number }[] {
	const moves: { boardIndex: number; cellIndex: number }[] = [];
	for (let b = 0; b < boards.length; b++) {
		if (isBoardDead(boards[b], boardSize)) continue;
		boards[b].forEach((cell, i) => {
			if (cell === "") moves.push({ boardIndex: b, cellIndex: i });
		});
	}
	// order by center‑bias
	return moves.sort(
		(a, b) =>
			getCellValue(b.cellIndex, boardSize) -
			getCellValue(a.cellIndex, boardSize),
	);
}

export function updateBoards(
	boards: BoardState[],
	move: { boardIndex: number; cellIndex: number },
): BoardState[] {
	const copy = boards.map((b) => [...b] as BoardState);
	copy[move.boardIndex][move.cellIndex] = "X";
	return copy;
}

//
// ——— Main AI: misère Nim strategy + difficulty —————————————————————
//
export function findBestMove(
	boards: BoardState[],
	difficulty: DifficultyLevel, // 1 (dumb) … 5 (perfect)
	boardSize: BoardSize,
	_numberOfBoards: number,
): { boardIndex: number; cellIndex: number } | null {
	const moves = getValidMoves(boards, boardSize);
	if (moves.length === 0) return null;

	// random‑play chance based on difficulty
	const optimalChance = (difficulty - 1) / 4; // 0 @1 → 1 @5
	if (Math.random() > optimalChance) {
		return moves[Math.floor(Math.random() * moves.length)];
	}

	// count live boards
	const liveCount = boards.reduce(
		(sum, b) => sum + (isBoardDead(b, boardSize) ? 0 : 1),
		0,
	);

	// split moves by whether they kill their board
	const killing: typeof moves = [];
	const nonKilling: typeof moves = [];
	for (const m of moves) {
		const next = updateBoards(boards, m);
		if (isBoardDead(next[m.boardIndex], boardSize)) killing.push(m);
		else nonKilling.push(m);
	}

	if (liveCount % 2 === 1) {
		// winning position → leave boards alive
		if (nonKilling.length) return nonKilling[0];
		return moves[0];
	} else {
		// losing position → kill one to flip parity
		if (killing.length) {
			return killing[Math.floor(Math.random() * killing.length)];
		}
		return moves[0];
	}
}
