"use client";

import { useEffect } from "react";
import { ShortcutManager } from "@/services/ShortcutManager";

type ShortcutMap = Record<string, (event: KeyboardEvent) => void>;

/**
 * A React hook to register a map of shortcuts with the global ShortcutManager.
 * This hook does NOT add or remove event listeners itself.
 */
export function useShortcut(shortcuts: ShortcutMap) {
	useEffect(() => {
		ShortcutManager.registerShortcuts(shortcuts);

		// When the component unmounts, clear its shortcuts from the manager
		// to prevent them from firing on other pages.
		return () => {
			ShortcutManager.registerShortcuts({});
		};
	}, [shortcuts]);
}