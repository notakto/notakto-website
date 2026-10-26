import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useShortcutsEnabled } from "@/features/use-keyboard-shortcuts/model/shortcutsEnabledStore";
import ShortcutModal from "@/widgets/shortcut-modal/ui/ShortcutModal";

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

describe("shortcut toggle (#457)", () => {
	beforeEach(() => {
		window.localStorage.clear();
		useShortcutsEnabled.setState({ enabled: true });
		cleanup();
	});

	it("shows the switch in the header, on by default", () => {
		render(<ShortcutModal visible={true} />);

		const toggle = screen.getByRole("switch", {
			name: "Turn keyboard shortcuts on or off",
		});
		expect(toggle.getAttribute("aria-checked")).toBe("true");
	});

	it("turning it off updates the store every useShortcut call site reads", () => {
		render(<ShortcutModal visible={true} />);

		const toggle = screen.getByRole("switch", {
			name: "Turn keyboard shortcuts on or off",
		});
		fireEvent.click(toggle);

		expect(toggle.getAttribute("aria-checked")).toBe("false");
		expect(useShortcutsEnabled.getState().enabled).toBe(false);

		fireEvent.click(toggle);
		expect(useShortcutsEnabled.getState().enabled).toBe(true);
	});

	it("an off state is restored from localStorage", () => {
		window.localStorage.setItem(
			"shortcuts-enabled",
			JSON.stringify({ state: { enabled: false }, version: 0 }),
		);

		useShortcutsEnabled.persist.rehydrate();

		expect(useShortcutsEnabled.getState().enabled).toBe(false);
	});

	it("shows a CircleHelp icon that opens a popover", () => {
		render(<ShortcutModal visible={true} />);

		const helpBtn = screen.getByRole("button", {
			name: "How keyboard shortcuts work",
		});
		expect(helpBtn).toBeDefined();
		expect(helpBtn.getAttribute("aria-expanded")).toBe("false");

		fireEvent.click(helpBtn);
		expect(helpBtn.getAttribute("aria-expanded")).toBe("true");
		expect(screen.getByRole("tooltip")).toBeDefined();
	});

	it("closes the CircleHelp popover on Escape", () => {
		render(<ShortcutModal visible={true} />);

		const helpBtn = screen.getByRole("button", {
			name: "How keyboard shortcuts work",
		});
		fireEvent.click(helpBtn);
		expect(screen.getByRole("tooltip")).toBeDefined();

		fireEvent.keyDown(window, { key: "Escape" });
		expect(helpBtn.getAttribute("aria-expanded")).toBe("false");
		expect(screen.queryByRole("tooltip")).toBeNull();
	});
});
