import type { CSSProperties } from "react";

interface SidebarTooltipProps {
	label: string;
	show: boolean;
	anchorRect: DOMRect | null;
}

export default function SidebarTooltip({
	label,
	show,
	anchorRect,
}: SidebarTooltipProps) {
	if (!show || !anchorRect) return null;

	return (
		<div
			className="fixed z-[9999] whitespace-nowrap bg-panel border-2 border-border-pixel px-3 py-2 font-pixel text-[7px] text-cream shadow-[2px_2px_0_var(--color-bg0)] pointer-events-none animate-slide-up sidebar-tooltip-pos"
			style={
				{
					"--tooltip-left": `${anchorRect.right + 8}px`,
					"--tooltip-top": `${anchorRect.top + anchorRect.height / 2}px`,
				} as CSSProperties
			}>
			{label}
		</div>
	);
}
