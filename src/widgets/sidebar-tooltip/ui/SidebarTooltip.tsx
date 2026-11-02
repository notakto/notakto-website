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
			className="fixed z-9999 whitespace-nowrap bg-gray-800 border-2 border-gray-700 px-3 py-2  text-[7px] text-stone-300 shadow-[2px_2px_0_var(--color-slate-950)] pointer-events-none animate-slide-up sidebar-tooltip-pos"
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
