"use client";

import type React from "react";
import { createContext, useContext, useEffect } from "react";
import { usePersistentState } from "@/components/hooks/usePersistentState";
import { ShortcutManager } from "@/services/ShortcutManager";

type ShortcutContextType = {
	shortcutsEnabled: boolean;
	setShortcutsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShortcutContext = createContext<ShortcutContextType | undefined>(
	undefined,
);

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
	// A clear state name. `true` means shortcuts are on.
	const [shortcutsEnabled, setShortcutsEnabled] = usePersistentState<boolean>(
		"shortcuts-enabled",
		true,
	);

	useEffect(() => {
		// This ensures the manager's single listener is attached when the app loads.
		ShortcutManager.init();
	}, []);

	useEffect(() => {
		// This connects our React state to the manager's kill switch.
		// When `shortcutsEnabled` changes, the manager is updated immediately.
		ShortcutManager.setEnabled(shortcutsEnabled);
	}, [shortcutsEnabled]);

	return (
		<ShortcutContext.Provider value={{ shortcutsEnabled, setShortcutsEnabled }}>
			{children}
		</ShortcutContext.Provider>
	);
}

export function useShortcutContext() {
	const context = useContext(ShortcutContext);
	if (context === undefined) {
		throw new Error(
			"useShortcutContext must be used within a ShortcutProvider",
		);
	}
	return context;
}