import { describe, expect, it } from "vitest";
import { isBoardDead } from "@/services/ai";
import type { BoardState } from "@/services/types";

describe("isBoardDead", () => {
	it("detects dead board on 3x3 row", () => {
		const board: BoardState = ["X", "X", "X", "", "", "", "", "", ""];
		expect(isBoardDead(board, 3)).toBe(true);
	});

	it("detects dead board on 3x3 column", () => {
		const board: BoardState = ["X", "", "", "X", "", "", "X", "", ""];
		expect(isBoardDead(board, 3)).toBe(true);
	});

	it("detects dead board on 3x3 diagonal", () => {
		const board: BoardState = ["X", "", "", "", "X", "", "", "", "X"];
		expect(isBoardDead(board, 3)).toBe(true);
	});

	it("detects live board when no win", () => {
		const board: BoardState = ["X", "", "", "", "", "", "", "", ""];
		expect(isBoardDead(board, 3)).toBe(false);
	});

	it("detects dead board on 4x4 diagonal", () => {
		const board: BoardState = [
			"X",
			"",
			"",
			"",
			"",
			"X",
			"",
			"",
			"",
			"",
			"X",
			"",
			"",
			"",
			"",
			"X",
		];
		expect(isBoardDead(board, 4)).toBe(true);
	});

	it("detects live 4x4 board with scattered Xs", () => {
		const board: BoardState = [
			"X",
			"",
			"X",
			"",
			"",
			"X",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
			"",
		];
		expect(isBoardDead(board, 4)).toBe(false);
	});
});
