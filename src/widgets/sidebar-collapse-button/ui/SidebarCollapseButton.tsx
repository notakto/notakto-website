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
			className="px-4 py-3 border-t-3 border-gray-700  text-[10px] text-gray-500 hover:text-stone-300 cursor-pointer transition-colors">
			{isCollapsed ? ">>" : "<< HIDE"}
		</button>
	);
}
