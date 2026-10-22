import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ShortcutsEnabledStore {
	enabled: boolean;
	setShortcutsEnabled: (enabled: boolean) => void;
}

/**
 * Whether keyboard shortcuts are active at all. The shortcut modal's
 * "Enable Shortcuts" switch writes here, every `useShortcut` call site
 * reads it, and the choice is persisted so a reload keeps it (#457).
 */
export const useShortcutsEnabled = create<ShortcutsEnabledStore>()(
	persist(
		(set) => ({
			enabled: true,
			setShortcutsEnabled: (enabled) => set({ enabled }),
		}),
		{ name: "shortcuts-enabled" },
	),
);
