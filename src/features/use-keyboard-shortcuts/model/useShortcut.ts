"use client";

import { useEffect } from "react";
import type { ShortcutMap } from "@/entities/shortcut/model/types";
import { useShortcutsEnabled } from "@/features/use-keyboard-shortcuts/model/shortcutsEnabledStore";

export function useShortcut(shortcuts: ShortcutMap, disabled: boolean = false) {
	const shortcutsEnabled = useShortcutsEnabled((s) => s.enabled);
	const shortcutsDisabled = disabled || !shortcutsEnabled;

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			// Escape always works so an open modal can be closed even when
			// shortcuts are switched off in the shortcut modal itself.
			if (shortcutsDisabled && key !== "escape") return;

			const el = e.target as HTMLElement | null;
			const tag = el?.tagName?.toLowerCase();

			// ignore if composing, holding modifiers, or typing in an input
			if (e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey)
				return;
			if (tag === "input" || tag === "textarea" || el?.isContentEditable)
				return;

			if (shortcuts[key]) {
				e.preventDefault();
				shortcuts[key](e);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [shortcuts, shortcutsDisabled]);
}
