"use client";

import clsx from "clsx";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useShortcutsEnabled } from "@/features/use-keyboard-shortcuts/model/shortcutsEnabledStore";
import { useShortcut } from "@/features/use-keyboard-shortcuts/model/useShortcut";
import { ToggleButton } from "@/widgets/toggle-button/ui/ToggleButton";

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
			<ToggleButton
				checked={enabled}
				onChange={setShortcutsEnabled}
				label="Turn keyboard shortcuts on or off"
				onLabel="Shortcuts are on"
				offLabel="Shortcuts are off"
			/>

			<div ref={infoRef} className="relative inline-flex">
				<button
					type="button"
					onClick={() => setInfoOpen((prev) => !prev)}
					aria-label="How keyboard shortcuts work"
					aria-expanded={infoOpen}
					className={clsx(
						"p-2 -m-2 text-stone-300/70 hover:text-yellow-500 transition-colors cursor-pointer",
						infoOpen && "text-yellow-500",
					)}>
					<CircleHelp size={18} />
				</button>

				{infoOpen && (
					<div
						role="tooltip"
						className="absolute right-0 top-full mt-3 w-[min(20rem,80vw)] z-20 bg-gray-800 pixel-border p-3 sm:p-4 text-left  text-xs normal-case tracking-normal leading-relaxed text-stone-300">
						<p className="uppercase tracking-widest text-yellow-500 mb-2">
							Keyboard Shortcuts
						</p>
						<p className="text-stone-300/80">
							Turn keyboard shortcuts on or off. When disabled, only the Escape
							key remains active.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
