import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent, { UserEvent } from '@testing-library/user-event'
import * as nextNavigation from "next/navigation"
import Game from "@/app/vsPlayer/page";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
    }),
}));
vi.mock('@/services/sounds', () => ({
    playMoveSound: vi.fn(),
    playWinSound: vi.fn(),
}));

describe("vsPlayer Keyboard Shortcuts", () => {
    let user: UserEvent;

    beforeEach(async () => {
        pushMock.mockClear()
        render(<Game />)
        user = userEvent.setup()

        // Fill in Player Names Modal to complete setup
        await user.type(screen.getByPlaceholderText(/player 1/i), "Alice")
        await user.type(screen.getByPlaceholderText(/player 2/i), "Bob")
        await user.click(screen.getByRole("button", { name: /start/i }))
    })
    it("opens and closes ShortcutModal when 'q' is pressed", async () => {

        // The shortcut modal should NOT be visible at first
        expect(screen.queryByRole("heading", { name: /keyboard shortcuts/i })).not.toBeInTheDocument();

        // Simulate pressing "q"
        await user.keyboard("q")

        // Now the modal should appear
        expect(screen.queryByRole("heading", { name: /keyboard shortcuts/i })).toBeInTheDocument();

        // Press "q" again to close it
        await user.keyboard("q")

        // The modal should close
        expect(screen.queryByRole("heading", { name: /keyboard shortcuts/i })).not.toBeInTheDocument();

    })
    it("opens and closes BoardConfigModal when 'c' is pressed", async () => {

        // The BoardConfigModal modal should NOT be visible at first
        expect(screen.queryByText(/number of boards/i)).not.toBeInTheDocument()

        // Simulate pressing "c"
        await user.keyboard("c")

        // Now the modal should appear
        expect(screen.getByText(/number of boards/i)).toBeInTheDocument()

        // Press "c" again to close it
        await user.keyboard("c")

        // The modal should close
        expect(screen.queryByText(/number of boards/i)).not.toBeInTheDocument()

    })
    it("opens and closes SoundConfigModal when 's' is pressed", async () => {

        // The SoundConfigModal modal should NOT be visible at first
        expect(screen.queryByText(/sound configuration/i)).not.toBeInTheDocument()

        // Simulate pressing "s"
        await user.keyboard("s")

        // Now the modal should appear
        expect(screen.getByText(/sound configuration/i)).toBeInTheDocument()

        // Press "s" again to close it
        await user.keyboard("s")

        // The modal should close
        expect(screen.queryByText(/sound configuration/i)).not.toBeInTheDocument()

    })
    it("opens and closes PlayerNameModal when 'n' is pressed", async () => {

        // The PlayerNameModal modal should NOT be visible at first
        expect(screen.queryByText(/enter player names/i)).not.toBeInTheDocument()

        // Simulate pressing "n"
        await user.keyboard("n")

        // Now the modal should appear
        expect(screen.getByText(/enter player names/i)).toBeInTheDocument()

        // Press "n" again to close it
        await user.keyboard("n")

        // The modal should close
        expect(screen.queryByText(/enter player names/i)).not.toBeInTheDocument()

    })
    it("resets the game when 'r' is pressed", async () => {
        // Make a move first
        const firstCell = screen.getAllByRole('button')[0]
        await user.click(firstCell)
        expect(firstCell).toHaveTextContent('X') // move registered

        // Press 'r' to reset
        await user.keyboard("r")

        // First cell should be empty again
        const firstCellAfterReset = screen.getAllByRole('button')[0]
        expect(firstCellAfterReset).toHaveTextContent('') // board cleared
    })

    it("navigates to main menu when 'm' is pressed", async () => {
        // Press 'm' to go to main menu
        await user.keyboard("m")

        // Check that router.push was called with '/'
        expect(pushMock).toHaveBeenCalledWith("/")
    })

})