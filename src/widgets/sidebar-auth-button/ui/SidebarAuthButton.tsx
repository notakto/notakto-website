import type { MouseEvent } from "react";
import SidebarNavIcon from "@/widgets/sidebar-nav-icon/ui/SidebarNavIcon";
import SidebarNavLabel from "@/widgets/sidebar-nav-label/ui/SidebarNavLabel";

interface SidebarAuthButtonProps {
	isSignedIn: boolean;
	isCollapsed: boolean;
	onClick: () => void;
	showTooltip: (event: MouseEvent, label: string) => void;
	hideTooltip: () => void;
}

export default function SidebarAuthButton({
	isSignedIn,
	isCollapsed,
	onClick,
	showTooltip,
	hideTooltip,
}: SidebarAuthButtonProps) {
	const label = isSignedIn ? "SIGN OUT" : "SIGN IN";

	return (
		<button
			type="button"
			onClick={onClick}
			onMouseEnter={(event) => showTooltip(event, label)}
			onMouseLeave={hideTooltip}
			className={`px-4 py-3 border-t-3 border-gray-700  text-[8px] cursor-pointer transition-colors flex items-center gap-3 uppercase tracking-wider ${
				isSignedIn
					? "text-stone-400 hover:text-stone-300 hover:bg-slate-800"
					: "bg-rose-700 text-stone-300 hover:bg-rose-600"
			}`}>
			<SidebarNavIcon icon={isSignedIn ? "<" : ">"} />
			<SidebarNavLabel label={label} visible={!isCollapsed} />
		</button>
	);
}
