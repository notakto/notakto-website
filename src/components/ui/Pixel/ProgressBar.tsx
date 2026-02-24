import type { CSSProperties } from "react";
import type { ProgressBarProps } from "@/services/types";

export default function ProgressBar({
	value,
	max = 100,
	color = "bg-accent",
	className = "",
}: ProgressBarProps) {
	const pct = Math.min(100, (value / max) * 100);
	return (
		<div className={`h-3 bg-bg0 border-2 border-border-pixel ${className}`}>
			<div
				className={`h-full ${color} progress-fill`}
				style={{ "--progress-width": `${pct}%` } as CSSProperties}
			/>
		</div>
	);
}
