"use client";

import { useShortcutsEnabled } from "@/features/use-keyboard-shortcuts/model/shortcutsEnabledStore";

/**
 * The "Enable Shortcuts" switch of the shortcut modal (#457). A real button
 * in the switch role so it is reachable by keyboard and announced by screen
 * readers; every `useShortcut` call site reacts to the store immediately.
 */
export default function ShortcutToggle() {
	const enabled = useShortcutsEnabled((s) => s.enabled);
	const setShortcutsEnabled = useShortcutsEnabled((s) => s.setShortcutsEnabled);

	return (
		<div className="flex items-center justify-center gap-3 mt-4 mb-2">
			<span
				id="enable-shortcuts-label"
				className="text-primary font-pixel uppercase tracking-wider text-[10px]">
				Enable Shortcuts
			</span>
			<button
				type="button"
				role="switch"
				aria-checked={enabled}
				aria-labelledby="enable-shortcuts-label"
				onClick={() => setShortcutsEnabled(!enabled)}
				className="relative inline-flex items-center h-6 w-12 bg-bg0 border-3 border-border-light cursor-pointer transition-colors">
				<span
					className={`absolute top-0.5 h-4 w-4 bg-primary border-2 border-border-light transition-transform ${
						enabled ? "translate-x-6" : "translate-x-0.5"
					}`}
				/>
				<span className="sr-only">
					{enabled ? "Shortcuts are on" : "Shortcuts are off"}
				</span>
			</button>
		</div>
	);
}
