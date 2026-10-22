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

	it("shows the switch, on by default", () => {
		render(<ShortcutModal visible={true} />);

		const label = screen.getByText("Enable Shortcuts");
		expect(label).toBeTruthy();

		const toggle = screen.getByRole("switch", { name: "Enable Shortcuts" });
		expect(toggle.getAttribute("aria-checked")).toBe("true");
	});

	it("turning it off updates the store every useShortcut call site reads", () => {
		render(<ShortcutModal visible={true} />);

		const toggle = screen.getByRole("switch", { name: "Enable Shortcuts" });
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
});
