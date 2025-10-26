import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ShortcutProvider } from "@/context/ShortcutContext";
import ShortcutModal from "@/modals/ShortcutModal";

// Mock next/navigation
vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

const renderWithProvider = (ui: React.ReactElement) => {
	return render(<ShortcutProvider>{ui}</ShortcutProvider>);
};

describe("ShortcutModal", () => {
	it("should render the toggle switch", () => {
		renderWithProvider(<ShortcutModal visible={true} onClose={() => {}} />);
		expect(screen.getByLabelText("Enable Shortcuts")).toBeInTheDocument();
	});

	it("should be enabled by default", () => {
		renderWithProvider(<ShortcutModal visible={true} onClose={() => {}} />);
		expect(screen.getByLabelText("Enable Shortcuts")).toBeChecked();
	});

	it("should disable when clicked", () => {
		renderWithProvider(<ShortcutModal visible={true} onClose={() => {}} />);
		const toggle = screen.getByLabelText("Enable Shortcuts");
		fireEvent.click(toggle);
		expect(toggle).not.toBeChecked();
	});

	it("should read its initial state from localStorage if present", () => {
		window.localStorage.setItem("shortcuts-enabled", JSON.stringify(false));
		renderWithProvider(<ShortcutModal visible={true} onClose={() => {}} />);
		expect(screen.getByLabelText("Enable Shortcuts")).not.toBeChecked();
		window.localStorage.clear(); // Clean up
	});
});
