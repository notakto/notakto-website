"use client";

import { useShortcutsEnabled } from "@/features/use-keyboard-shortcuts/model/shortcutsEnabledStore";

/**
 * The "Enable Shortcuts" switch of the shortcut modal (#457).
 * Shown in the modal header with a tooltip on hover.
 */
export default function ShortcutToggle() {
	const enabled = useShortcutsEnabled((s) => s.enabled);
	const setShortcutsEnabled = useShortcutsEnabled((s) => s.setShortcutsEnabled);

	return (
		<button
			type="button"
			role="switch"
			aria-checked={enabled}
			aria-label="Turn keyboard shortcuts on or off"
			title="Turn keyboard shortcuts on or off"
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
	);
}
