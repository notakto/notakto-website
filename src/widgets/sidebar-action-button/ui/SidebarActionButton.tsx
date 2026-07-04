import clsx from "clsx";
import type { MouseEvent } from "react";
import SidebarNavIcon from "@/widgets/sidebar-nav-icon/ui/SidebarNavIcon";
import SidebarNavLabel from "@/widgets/sidebar-nav-label/ui/SidebarNavLabel";

interface SidebarActionButtonProps {
	label: string;
	icon: string;
	isCollapsed: boolean;
	onClick: () => void;
	showTooltip: (event: MouseEvent, label: string) => void;
	hideTooltip: () => void;
	variant?: "default" | "accent";
}

export default function SidebarActionButton({
	label,
	icon,
	isCollapsed,
	onClick,
	showTooltip,
	hideTooltip,
	variant = "default",
}: SidebarActionButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			onMouseEnter={(event) => showTooltip(event, label)}
			onMouseLeave={hideTooltip}
			className={clsx(
				"w-full flex items-center gap-3 px-4 py-3 font-pixel text-[8px] uppercase tracking-wider hover:bg-bg2 border-l-3 border-transparent transition-colors duration-100 cursor-pointer",
				variant === "accent"
					? "text-accent hover:text-pixel-white hover:border-accent"
					: "text-cream-dim hover:text-cream",
			)}>
			<SidebarNavIcon icon={icon} />
			<SidebarNavLabel label={label} visible={!isCollapsed} />
		</button>
	);
}
