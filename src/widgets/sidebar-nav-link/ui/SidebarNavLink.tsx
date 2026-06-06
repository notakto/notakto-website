import Link from "next/link";
import type { MouseEvent } from "react";
import SidebarNavIcon from "@/widgets/sidebar-nav-icon/ui/SidebarNavIcon";
import SidebarNavLabel from "@/widgets/sidebar-nav-label/ui/SidebarNavLabel";

export type SidebarNavItem =
	| { href: string; label: string; icon: string }
	| { href: string; label: string; icon: string; external: true };

interface SidebarNavLinkProps {
	item: SidebarNavItem;
	isActive: boolean;
	isCollapsed: boolean;
	showTooltip: (event: MouseEvent, label: string) => void;
	hideTooltip: () => void;
}

export default function SidebarNavLink({
	item,
	isActive,
	isCollapsed,
	showTooltip,
	hideTooltip,
}: SidebarNavLinkProps) {
	const className = `flex items-center gap-3 px-4 py-3 font-pixel text-[8px] uppercase tracking-wider transition-colors duration-100 ${
		isActive
			? "bg-bg3 text-accent border-l-3 border-accent"
			: "text-cream-dim hover:text-cream hover:bg-bg2 border-l-3 border-transparent"
	}`;
	const content = (
		<>
			<SidebarNavIcon icon={item.icon} />
			<SidebarNavLabel label={item.label} visible={!isCollapsed} />
		</>
	);

	if ("external" in item && item.external) {
		return (
			<a
				href={item.href}
				target="_blank"
				rel="noopener noreferrer"
				onMouseEnter={(event) => showTooltip(event, item.label)}
				onMouseLeave={hideTooltip}
				className={className}>
				{content}
			</a>
		);
	}

	return (
		<Link
			href={item.href}
			onMouseEnter={(event) => showTooltip(event, item.label)}
			onMouseLeave={hideTooltip}
			className={className}>
			{content}
		</Link>
	);
}
