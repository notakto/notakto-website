import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PlayerNamesModal from "@/modals/PlayerNamesModal";
import type { PlayerNamesModalProps } from "@/services/types";

//  mocking the toast library so tests don't break
vi.mock("react-toastify", () => ({
	toast: Object.assign(vi.fn(), {
		dismiss: vi.fn(),
	}),
}));

const messages: Record<string, string> = {
	characters: "characters",
	player_1_name: "Player 1 Name",
	player_2_name: "Player 2 Name",
	title: "Enter Player Names",
	start_game: "Start Game",
	player_1: "Player 1",
	player_2: "Player 2",
	duplicate_names_error: "Names cannot be same",
};

const t = (key: string) => messages[key] || key;

vi.mock("next-intl", () => ({
	useTranslations: () => t,
}));

vi.mock("@/components/hooks/useToastCooldown", () => ({
	useToastCooldown: () => ({
		canShowToast: () => true,
		triggerToastCooldown: vi.fn(),
		resetCooldown: vi.fn(),
	}),
}));

vi.mock("@/constants/toast", () => ({
	TOAST_DURATION: 5000,
	TOAST_IDS: {
		PlayerNames: {
			Duplicate: "player-names-duplicate",
		},
	},
}));

describe("PlayerNamesModal Character Limit Validation", () => {
	const mockOnSubmit = vi.fn();

	const defaultProps: PlayerNamesModalProps = {
		visible: true,
		onSubmit: mockOnSubmit,
		initialNames: ["Player 1", "Player 2"],
	};
	beforeEach(() => {
		mockOnSubmit.mockClear();
	});

	// Test Case ID: 1 - Accept exactly 15 characters in Player 1
	it("should accept exactly 15 characters in Player 1 input field", () => {
		render(<PlayerNamesModal {...defaultProps} />);

		const player1Input = screen.getByPlaceholderText("Player 1 Name");
		const testString = "ExactlyFifteen1"; // 15 characters

		fireEvent.change(player1Input, { target: { value: testString } });

		expect(player1Input).toHaveValue(testString);
		expect(testString.length).toBe(15);
	});

	// Test Case ID: 2 - Block 16th character in Player 1
	it("should enforce maxLength of 15 on Player 1 input", () => {
		render(<PlayerNamesModal {...defaultProps} />);

		const player1Input = screen.getByPlaceholderText("Player 1 Name");

		expect(player1Input).toHaveAttribute("maxLength", "15");
	});

	// Test Case ID: 3 - Character counter shows 10/15
	it("should show '10/15 characters' when Player 1 has 10 characters", () => {
		render(<PlayerNamesModal {...defaultProps} />);

		const player1Input = screen.getByPlaceholderText("Player 1 Name");
		const testString = "TenCharact"; // 10 characters

		fireEvent.change(player1Input, { target: { value: testString } });

		expect(screen.getByText("10/15 characters")).toBeInTheDocument();
	});

	// Test Case ID: 4 - Character counter shows 15/15
	it("should show '15/15 characters' when Player 1 is at maximum", () => {
		render(<PlayerNamesModal {...defaultProps} />);

		const player1Input = screen.getByPlaceholderText("Player 1 Name");
		const testString = "ExactlyFifteen1"; // 15 characters

		fireEvent.change(player1Input, { target: { value: testString } });

		expect(screen.getByText("15/15 characters")).toBeInTheDocument();
	});

	// Test Case ID: 6 - Accept exactly 15 characters in Player 2
	it("should accept exactly 15 characters in Player 2 input field", () => {
		render(<PlayerNamesModal {...defaultProps} />);

		const player2Input = screen.getByPlaceholderText("Player 2 Name");
		const testString = "ExactlyFifteen2"; // 15 characters

		fireEvent.change(player2Input, { target: { value: testString } });

		expect(player2Input).toHaveValue(testString);
		expect(testString.length).toBe(15);
	});

	// Test Case ID: 7 - Block 16th character in Player 2
	it("should enforce maxLength of 15 on Player 2 input", () => {
		render(<PlayerNamesModal {...defaultProps} />);

		const player2Input = screen.getByPlaceholderText("Player 2 Name");

		expect(player2Input).toHaveAttribute("maxLength", "15");
	});

	// Test Case ID: 8 - Character counter for Player 2
	it("should show '8/15 characters' when Player 2 has 8 characters", () => {
		render(<PlayerNamesModal {...defaultProps} />);

		const player1Input = screen.getByPlaceholderText(
			"Player 1 Name",
		) as HTMLInputElement;
		const player2Input = screen.getByPlaceholderText(
			"Player 2 Name",
		) as HTMLInputElement;

		// Type 5 characters in Player 1 (so Player 1 will show "5/15 characters")
		fireEvent.change(player1Input, { target: { value: "Hello" } });
		expect(screen.getByText("5/15 characters")).toBeInTheDocument();

		// Type 8 characters in Player 2
		const testString = "EightChr"; // 8 characters
		fireEvent.change(player2Input, { target: { value: testString } });

		// Now we know "8/15 characters" must be from Player 2
		expect(screen.getByText("8/15 characters")).toBeInTheDocument();
		// Player 1 should still show 5/15
		expect(screen.getByText("5/15 characters")).toBeInTheDocument();
	});
	/*
	 * Test Case ID: 14 - Form submission with full-length names (15 chars each)
	 */
	it("should submit successfully with full-length names (15 chars each)", async () => {
		render(<PlayerNamesModal {...defaultProps} />);

		const player1Input = screen.getByPlaceholderText("Player 1 Name");
		const player2Input = screen.getByPlaceholderText("Player 2 Name");
		const startButton = screen.getByText("Start Game");

		const player1Name = "ExactlyFifteen1"; // 15 characters
		const player2Name = "ExactlyFifteen2"; // 15 characters

		fireEvent.change(player1Input, { target: { value: player1Name } });
		fireEvent.change(player2Input, { target: { value: player2Name } });

		fireEvent.click(startButton);

		await waitFor(
			() => {
				expect(mockOnSubmit).toHaveBeenCalledWith(player1Name, player2Name);
			},
			{ timeout: 3000 },
		);
	});

	// Just some basic tests to make sure the modal shows up when it should
	it("should not render when visible is false", () => {
		render(<PlayerNamesModal {...defaultProps} visible={false} />);

		expect(
			screen.queryByPlaceholderText("Player 1 Name"),
		).not.toBeInTheDocument();
	});

	it("should render when visible is true", () => {
		render(<PlayerNamesModal {...defaultProps} />);

		expect(screen.getByPlaceholderText("Player 1 Name")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Player 2 Name")).toBeInTheDocument();
		expect(screen.getByText("Start Game")).toBeInTheDocument();
	});
});
