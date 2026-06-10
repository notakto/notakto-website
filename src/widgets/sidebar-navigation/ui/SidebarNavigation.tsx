"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import {
	signInWithGoogle,
	signOutUser,
} from "@/features/authenticate-user/api/firebase";
import { useUser } from "@/features/authenticate-user/model/userStore";
import { useGlobalModal } from "@/features/manage-global-modal/model/globalModalStore";
import { useSidebar } from "@/features/manage-sidebar-state/model/sidebarStore";
import MobileBottomNav from "@/widgets/mobile-bottom-nav/ui/MobileBottomNav";
import SidebarActionButton from "@/widgets/sidebar-action-button/ui/SidebarActionButton";
import SidebarAuthButton from "@/widgets/sidebar-auth-button/ui/SidebarAuthButton";
import SidebarCollapseButton from "@/widgets/sidebar-collapse-button/ui/SidebarCollapseButton";
import SidebarDivider from "@/widgets/sidebar-divider/ui/SidebarDivider";
import SidebarLogoLink from "@/widgets/sidebar-logo-link/ui/SidebarLogoLink";
import SidebarNavLink from "@/widgets/sidebar-nav-link/ui/SidebarNavLink";
import {
	GAME_BUTTONS,
	GAME_PAGES,
	MODAL_ITEMS,
	NAV_ITEMS,
} from "@/widgets/sidebar-navigation/constants";
import SidebarSectionLabel from "@/widgets/sidebar-section-label/ui/SidebarSectionLabel";
import SidebarTooltip from "@/widgets/sidebar-tooltip/ui/SidebarTooltip";

function useSidebarTooltip(isCollapsed: boolean) {
	const [tooltip, setTooltip] = useState<{
		label: string;
		rect: DOMRect;
	} | null>(null);

	const showTooltip = (e: React.MouseEvent, label: string) => {
		if (!isCollapsed) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		setTooltip({ label, rect });
	};

	const hideTooltip = () => setTooltip(null);

	return { tooltip, showTooltip, hideTooltip };
}

export default function Sidebar() {
	const { isCollapsed, toggle, setCollapsed } = useSidebar();
	const pathname = usePathname();
	const { openModal } = useGlobalModal();

	useEffect(() => {
		if (GAME_PAGES.includes(pathname)) {
			setCollapsed(false);
		}
	}, [pathname, setCollapsed]);
	const user = useUser((s) => s.user);
	const { tooltip, showTooltip, hideTooltip } = useSidebarTooltip(isCollapsed);

	const handleAuth = async () => {
		if (user) {
			await signOutUser();
		} else {
			await signInWithGoogle();
		}
	};

	return (
		<>
			<nav
				className={`fixed left-0 top-0 h-full bg-bg1 border-r-3 border-border-pixel z-50 hidden md:flex flex-col transition-all duration-200 overflow-hidden ${isCollapsed ? "w-14" : "w-56"}`}>
				<SidebarLogoLink
					isCollapsed={isCollapsed}
					showTooltip={showTooltip}
					hideTooltip={hideTooltip}
				/>

				<div className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
					<div className="mb-2">
						<SidebarSectionLabel label="Play" visible={!isCollapsed} />
						{NAV_ITEMS.slice(0, 3).map((item) => (
							<SidebarNavLink
								key={item.href}
								item={item}
								isActive={pathname === item.href}
								isCollapsed={isCollapsed}
								showTooltip={showTooltip}
								hideTooltip={hideTooltip}
							/>
						))}
					</div>

					{GAME_PAGES.includes(pathname) && GAME_BUTTONS[pathname] && (
						<>
							<SidebarDivider />
							<div className="mb-2">
								<SidebarSectionLabel label="Game" visible={!isCollapsed} />
								{GAME_BUTTONS[pathname].map((item) => (
									<SidebarActionButton
										key={item.modal}
										label={item.label}
										icon={item.icon}
										isCollapsed={isCollapsed}
										onClick={() => openModal(item.modal)}
										showTooltip={showTooltip}
										hideTooltip={hideTooltip}
									/>
								))}
							</div>
						</>
					)}

					<SidebarDivider />

					<div className="mb-2">
						<SidebarSectionLabel label="Settings" visible={!isCollapsed} />
						{MODAL_ITEMS.map((item) => (
							<SidebarActionButton
								key={item.modal}
								label={item.label}
								icon={item.icon}
								isCollapsed={isCollapsed}
								onClick={() => openModal(item.modal)}
								showTooltip={showTooltip}
								hideTooltip={hideTooltip}
							/>
						))}
					</div>

					<SidebarDivider />

					<div>
						<SidebarSectionLabel label="More" visible={!isCollapsed} />
						{NAV_ITEMS.slice(3).map((item) => (
							<SidebarNavLink
								key={item.href}
								item={item}
								isActive={pathname === item.href}
								isCollapsed={isCollapsed}
								showTooltip={showTooltip}
								hideTooltip={hideTooltip}
							/>
						))}
					</div>
				</div>

				<SidebarAuthButton
					isSignedIn={!!user}
					isCollapsed={isCollapsed}
					onClick={handleAuth}
					showTooltip={showTooltip}
					hideTooltip={hideTooltip}
				/>
				<SidebarCollapseButton
					isCollapsed={isCollapsed}
					onClick={toggle}
					showTooltip={showTooltip}
					hideTooltip={hideTooltip}
				/>
			</nav>

			<SidebarTooltip
				label={tooltip?.label ?? ""}
				show={!!tooltip}
				anchorRect={tooltip?.rect ?? null}
			/>

			<MobileBottomNav
				pathname={pathname}
				openModal={openModal}
				navItems={NAV_ITEMS}
				modalItems={MODAL_ITEMS}
				gamePages={GAME_PAGES}
				gameButtons={GAME_BUTTONS}
			/>
		</>
	);
}
