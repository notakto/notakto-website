import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PlayerNamesModal from "@/modals/PlayerNamesModal";
import type { PlayerNamesModalProps } from "@/services/types";

//  mocking the toast library so tests don't break
vi.mock("react-toastify", () => ({
	toast: Object.assign(vi.fn(), {
		dismiss: vi.fn(),
	}),
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
