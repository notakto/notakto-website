import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import VsPlayerGameScreen from "@/widgets/vs-player-game-screen/ui/VsPlayerGameScreen";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

vi.mock("react-toastify", () => ({
	toast: Object.assign(vi.fn(), {
		dismiss: vi.fn(),
	}),
}));

vi.mock("@/features/play-game-audio/lib/sounds", () => ({
	playMoveSound: vi.fn(),
	playWinSound: vi.fn(),
}));

describe("VsPlayerGameScreen Inactivity Modal Behavior & Edge Cases", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		mockPush.mockClear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	const startGame = () => {
		render(<VsPlayerGameScreen />);

		const startBtn = screen.getByRole("button", { name: /start game/i });
		fireEvent.click(startBtn);
	};

	it("shows 'Are You Still Playing?' modal after 5 minutes of inactivity", () => {
		startGame();

		expect(
			screen.queryByText("Are You Still Playing?"),
		).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(299000);
		});
		expect(
			screen.queryByText("Are You Still Playing?"),
		).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(screen.getByText("Are You Still Playing?")).toBeInTheDocument();
		expect(
			screen.getByText(
				"Game paused due to inactivity. Would you like to continue playing?",
			),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Continue Playing" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Exit to Menu" }),
		).toBeInTheDocument();
	});

	it("clicking 'Continue Playing' dismisses the modal and resets the inactivity timer", () => {
		startGame();

		act(() => {
			vi.advanceTimersByTime(300000);
		});
		expect(screen.getByText("Are You Still Playing?")).toBeInTheDocument();

		const continueBtn = screen.getByRole("button", {
			name: "Continue Playing",
		});
		fireEvent.click(continueBtn);

		expect(
			screen.queryByText("Are You Still Playing?"),
		).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(240000);
		});
		expect(
			screen.queryByText("Are You Still Playing?"),
		).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(60000);
		});
		expect(screen.getByText("Are You Still Playing?")).toBeInTheDocument();
	});

	it("clicking 'Exit to Menu' navigates to '/'", () => {
		startGame();

		act(() => {
			vi.advanceTimersByTime(300000);
		});

		const exitBtn = screen.getByRole("button", { name: "Exit to Menu" });
		fireEvent.click(exitBtn);

		expect(mockPush).toHaveBeenCalledWith("/");
	});

	it("resets inactivity tracking when desktop or mobile user interaction occurs", () => {
		startGame();

		act(() => {
			vi.advanceTimersByTime(180000);
		});

		act(() => {
			window.dispatchEvent(new MouseEvent("mousemove"));
		});

		act(() => {
			vi.advanceTimersByTime(180000);
		});
		expect(
			screen.queryByText("Are You Still Playing?"),
		).not.toBeInTheDocument();

		act(() => {
			window.dispatchEvent(new Event("touchstart"));
		});

		act(() => {
			vi.advanceTimersByTime(240000);
		});
		expect(
			screen.queryByText("Are You Still Playing?"),
		).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(60000);
		});
		expect(screen.getByText("Are You Still Playing?")).toBeInTheDocument();
	});

	it("prevents gameplay keyboard shortcuts while inactivity modal is open", () => {
		startGame();

		act(() => {
			vi.advanceTimersByTime(300000);
		});
		expect(screen.getByText("Are You Still Playing?")).toBeInTheDocument();

		fireEvent.keyDown(window, { key: "r" });
		fireEvent.keyDown(window, { key: "m" });

		expect(screen.queryByText("Reset Game?")).not.toBeInTheDocument();

		fireEvent.keyDown(window, { key: "Enter" });
		expect(
			screen.queryByText("Are You Still Playing?"),
		).not.toBeInTheDocument();
	});

	it("ensures modal is not shown multiple times simultaneously", () => {
		startGame();

		act(() => {
			vi.advanceTimersByTime(300000);
		});
		expect(screen.getByText("Are You Still Playing?")).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(600000);
		});

		const modals = screen.getAllByText("Are You Still Playing?");
		expect(modals).toHaveLength(1);
	});

	it("pauses the match timer while the inactivity pause modal is shown and resumes accurately", () => {
		startGame();

		act(() => {
			vi.advanceTimersByTime(300000);
		});
		expect(screen.getByText("Are You Still Playing?")).toBeInTheDocument();
		expect(screen.getAllByText("5:00").length).toBeGreaterThan(0);

		act(() => {
			vi.advanceTimersByTime(120000);
		});
		expect(screen.getAllByText("5:00").length).toBeGreaterThan(0);

		const continueBtn = screen.getByRole("button", {
			name: "Continue Playing",
		});
		fireEvent.click(continueBtn);

		expect(
			screen.queryByText("Are You Still Playing?"),
		).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(screen.getAllByText("5:05").length).toBeGreaterThan(0);
	});
});
