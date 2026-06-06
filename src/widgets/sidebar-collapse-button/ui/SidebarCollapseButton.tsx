import type { MouseEvent } from "react";

interface SidebarCollapseButtonProps {
	isCollapsed: boolean;
	onClick: () => void;
	showTooltip: (event: MouseEvent, label: string) => void;
	hideTooltip: () => void;
}

export default function SidebarCollapseButton({
	isCollapsed,
	onClick,
	showTooltip,
	hideTooltip,
}: SidebarCollapseButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			onMouseEnter={(event) =>
				showTooltip(event, isCollapsed ? "EXPAND" : "COLLAPSE")
			}
			onMouseLeave={hideTooltip}
			className="px-4 py-3 border-t-3 border-border-pixel font-pixel text-[10px] text-muted hover:text-cream cursor-pointer transition-colors">
			{isCollapsed ? ">>" : "<< HIDE"}
		</button>
	);
}
