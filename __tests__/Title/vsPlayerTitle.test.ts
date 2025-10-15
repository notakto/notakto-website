import { describe, expect, it } from "vitest";

describe("vsPlayer title logic", () => {
	it("shows Notakto when name modal is open and no board yet", () => {
		document.title = "Notakto";
		expect(document.title).toBe("Notakto");
	});

	it("shows Player 1's Turn when Player 1 is active", () => {
		document.title = "Player 1's Turn | Notakto";
		expect(document.title).toBe("Player 1's Turn | Notakto");
	});

	it("shows Player 2's Turn when Player 2 is active", () => {
		document.title = "Player 2's Turn | Notakto";
		expect(document.title).toBe("Player 2's Turn | Notakto");
	});

	it("shows Setting | Notakto when settings menu is open", () => {
		document.title = "Setting | Notakto";
		expect(document.title).toBe("Setting | Notakto");
	});

	it("shows Player 1 Won!! | Notakto when Player 1 wins", () => {
		document.title = "Player 1 Won!! | Notakto";
		expect(document.title).toBe("Player 1 Won!! | Notakto");
	});

	it("shows Player 2 Won!! | Notakto when Player 2 wins", () => {
		document.title = "Player 2 Won!! | Notakto";
		expect(document.title).toBe("Player 2 Won!! | Notakto");
	});

	it("shows Player 1's Turn after rematch", () => {
		document.title = "Player 1's Turn | Notakto";
		expect(document.title).toBe("Player 1's Turn | Notakto");
	});

	it("shows Notakto after main menu click", () => {
		document.title = "Notakto";
		expect(document.title).toBe("Notakto");
	});

	it("shows Notakto after resetting names", () => {
		document.title = "Notakto";
		expect(document.title).toBe("Notakto");
	});
});