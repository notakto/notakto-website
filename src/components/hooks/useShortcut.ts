"use client";

import { useEffect } from "react";
import { useShortcutStore } from "@/services/store";
import type { ShortcutMap } from "@/services/types";

export function useShortcut(shortcuts: ShortcutMap, disabled: boolean = false) {
	const shortcutsEnabled = useShortcutStore((state) => state.shortcutsEnabled);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if ((disabled || !shortcutsEnabled) && key !== "escape") return;

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
	}, [shortcuts, disabled, shortcutsEnabled]);
}
