import { describe, expect, it } from "vitest";

describe("liveMatch title logic", () => {
	it("shows Searching for Opponent | Notakto before match starts", () => {
		document.title = "Searching for Opponent | Notakto";
		expect(document.title).toBe("Searching for Opponent | Notakto");
	});

	it("shows Notakto | Your Turn when it's user's turn", () => {
		document.title = "Notakto | Your Turn";
		expect(document.title).toBe("Notakto | Your Turn");
	});

	it("shows Notakto | Opponent's Turn when it's opponent's turn", () => {
		document.title = "Notakto | Opponent's Turn";
		expect(document.title).toBe("Notakto | Opponent's Turn");
	});

	it("shows Notakto when disconnected or match ended", () => {
		document.title = "Notakto";
		expect(document.title).toBe("Notakto");
	});
});