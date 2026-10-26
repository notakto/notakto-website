"use client";

import clsx from "clsx";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useShortcutsEnabled } from "@/features/use-keyboard-shortcuts/model/shortcutsEnabledStore";
import { useShortcut } from "@/features/use-keyboard-shortcuts/model/useShortcut";

/**
 * The "Enable Shortcuts" switch of the shortcut modal.
 * Shown in the modal header with a CircleHelp popover.
 */
export default function ShortcutToggle() {
	const enabled = useShortcutsEnabled((s) => s.enabled);
	const setShortcutsEnabled = useShortcutsEnabled((s) => s.setShortcutsEnabled);

	const [infoOpen, setInfoOpen] = useState(false);
	const infoRef = useRef<HTMLDivElement>(null);

	useShortcut(
		{
			escape: () => setInfoOpen(false),
		},
		!infoOpen,
	);

	useEffect(() => {
		if (!infoOpen) return;

		const handlePointer = (e: PointerEvent) => {
			if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
				setInfoOpen(false);
			}
		};

		document.addEventListener("pointerdown", handlePointer);

		return () => {
			document.removeEventListener("pointerdown", handlePointer);
		};
	}, [infoOpen]);

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				role="switch"
				aria-checked={enabled}
				aria-label="Turn keyboard shortcuts on or off"
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

			<div ref={infoRef} className="relative inline-flex">
				<button
					type="button"
					onClick={() => setInfoOpen((prev) => !prev)}
					aria-label="How keyboard shortcuts work"
					aria-expanded={infoOpen}
					className={clsx(
						"p-2 -m-2 text-cream/70 hover:text-accent transition-colors cursor-pointer",
						infoOpen && "text-accent",
					)}>
					<CircleHelp size={18} />
				</button>

				{infoOpen && (
					<div
						role="tooltip"
						className="absolute right-0 top-full mt-3 w-[min(20rem,80vw)] z-20 bg-panel pixel-border p-3 sm:p-4 text-left font-pixel text-xs normal-case tracking-normal leading-relaxed text-cream">
						<p className="uppercase tracking-widest text-accent mb-2">
							Keyboard Shortcuts
						</p>
						<p className="text-cream/80">
							Turn keyboard shortcuts on or off. When disabled, only the Escape
							key remains active.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
