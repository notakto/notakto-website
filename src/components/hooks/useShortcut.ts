"use client";

import { useEffect } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;
type ShortcutMap = Record<string, ShortcutHandler>;

export function useShortcut(shortcuts: ShortcutMap, disabled: boolean = false) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if (disabled && key !== "escape") return;

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
	}, [shortcuts, disabled]);
}
