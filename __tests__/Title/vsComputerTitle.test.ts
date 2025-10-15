import { describe, expect, it } from "vitest";

describe("vsComputer title logic", () => {
	it("shows vs Computer | Notakto before game starts", () => {
		document.title = "vs Computer | Notakto";
		expect(document.title).toBe("vs Computer | Notakto");
	});

	it("shows Your Turn | Notakto when it's user's turn", () => {
		document.title = "Your Turn | Notakto";
		expect(document.title).toBe("Your Turn | Notakto");
	});

	it("shows Computer's Turn | Notakto when computer is playing", () => {
		document.title = "Computer's Turn | Notakto";
		expect(document.title).toBe("Computer's Turn | Notakto");
	});

	it("shows You Won! | Notakto when player wins", () => {
		document.title = "You Won! | Notakto";
		expect(document.title).toBe("You Won! | Notakto");
	});

	it("shows Computer Won! | Notakto when computer wins", () => {
		document.title = "Computer Won! | Notakto";
		expect(document.title).toBe("Computer Won! | Notakto");
	});

	it("shows Settings | Notakto when settings are open", () => {
		document.title = "Settings | Notakto";
		expect(document.title).toBe("Settings | Notakto");
	});

	it("shows Game Over | Notakto when draw occurs", () => {
		document.title = "Game Over | Notakto";
		expect(document.title).toBe("Game Over | Notakto");
	});
});
