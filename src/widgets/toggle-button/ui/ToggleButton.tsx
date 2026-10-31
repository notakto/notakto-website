"use client";

import clsx from "clsx";

interface ToggleButtonProps {
	/** Current on/off state of the switch. */
	checked: boolean;
	/** Called with the next state whenever the switch is clicked. */
	onChange: (checked: boolean) => void;
	/** Accessible name of the switch, announced by screen readers. */
	label: string;
	/** Optional state text for assistive tech, shown when the switch is on. */
	onLabel?: string;
	/** Optional state text for assistive tech, shown when the switch is off. */
	offLabel?: string;
	className?: string;
}

/**
 * Pixel-styled on/off switch, reusable anywhere the UI needs a toggle.
 */
export function ToggleButton({
	checked,
	onChange,
	label,
	onLabel,
	offLabel,
	className,
}: ToggleButtonProps) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={label}
			onClick={() => onChange(!checked)}
			className={clsx(
				"relative inline-flex items-center h-6 w-12 bg-slate-950 border-3 border-zinc-600 cursor-pointer transition-colors",
				className,
			)}>
			<span
				className={clsx(
					"absolute top-0.5 h-4 w-4 bg-rose-700 border-2 border-zinc-600 transition-transform",
					checked ? "translate-x-6" : "translate-x-0.5",
				)}
			/>
			{onLabel || offLabel ? (
				<span className="sr-only">{checked ? onLabel : offLabel}</span>
			) : null}
		</button>
	);
}
