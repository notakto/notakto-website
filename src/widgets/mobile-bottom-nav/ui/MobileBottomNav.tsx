"use client";

import Link from "next/link";
import { useState } from "react";
import {
	signInWithGoogle,
	signOutUser,
} from "@/features/authenticate-user/api/firebase";
import { useUser } from "@/features/authenticate-user/model/userStore";
import type { ModalAction } from "@/features/manage-global-modal/model/globalModalStore";

type MobileNavItem =
	| { href: string; label: string; icon: string }
	| { href: string; label: string; icon: string; external: true };

interface ModalItem {
	label: string;
	icon: string;
	modal: ModalAction;
}

interface GameButton {
	label: string;
	icon: string;
	modal: ModalAction;
}

interface MobileBottomNavProps {
	pathname: string;
	openModal: (modal: ModalAction) => void;
	navItems: MobileNavItem[];
	walletItems: ModalItem[];
	modalItems: ModalItem[];
	gamePages: string[];
	gameButtons: Record<string, GameButton[]>;
}

const MOBILE_NAV_ITEMS = [
	{ href: "/", label: "HOME", icon: "H" },
	{ href: "/vsComputer", label: "VS CPU", icon: ">" },
	{ href: "/vsPlayer", label: "VS PLAYER", icon: "+" },
	{ href: "/liveMatch", label: "LIVE", icon: "#" },
];

export default function MobileBottomNav({
	pathname,
	openModal,
	navItems,
	walletItems,
	modalItems,
	gamePages,
	gameButtons,
}: MobileBottomNavProps) {
	const [moreOpen, setMoreOpen] = useState(false);
	const isGamePage = gamePages.includes(pathname);
	const pageGameButtons = gameButtons[pathname] ?? [];
	const user = useUser((state) => state.user);

	const handleAuth = async () => {
		if (user) {
			await signOutUser();
		} else {
			await signInWithGoogle();
		}
		setMoreOpen(false);
	};

	return (
		<>
			{moreOpen && (
				<>
					<button
						type="button"
						aria-label="Close menu"
						className="fixed inset-0 z-998 md:hidden"
						onClick={() => setMoreOpen(false)}
					/>
					<div className="fixed bottom-14 right-2 z-999 bg-slate-900 border-3 border-gray-700 p-2 flex flex-col gap-1 md:hidden shadow-[3px_3px_0_var(--color-slate-950)]">
						{isGamePage &&
							pageGameButtons.map((item) => (
								<button
									type="button"
									key={item.modal}
									onClick={() => {
										openModal(item.modal);
										setMoreOpen(false);
									}}
									className=" text-[8px] text-stone-400 hover:text-stone-300 hover:bg-slate-800 px-3 py-2 text-left uppercase tracking-wider cursor-pointer whitespace-nowrap">
									{item.icon} {item.label}
								</button>
							))}
						{isGamePage && pageGameButtons.length > 0 && (
							<div className="h-0.5 bg-gray-700 my-1" />
						)}
						{walletItems.map((item) => (
							<button
								type="button"
								key={item.modal}
								onClick={() => {
									openModal(item.modal);
									setMoreOpen(false);
								}}
								className=" text-[8px] text-yellow-500 hover:text-orange-50 hover:bg-slate-800 px-3 py-2 text-left uppercase tracking-wider cursor-pointer whitespace-nowrap">
								{item.icon} {item.label}
							</button>
						))}
						{walletItems.length > 0 && (
							<div className="h-0.5 bg-gray-700 my-1" />
						)}
						{modalItems.map((item) => (
							<button
								type="button"
								key={item.modal}
								onClick={() => {
									openModal(item.modal);
									setMoreOpen(false);
								}}
								className=" text-[8px] text-stone-400 hover:text-stone-300 hover:bg-slate-800 px-3 py-2 text-left uppercase tracking-wider cursor-pointer whitespace-nowrap">
								{item.icon} {item.label}
							</button>
						))}
						<div className="h-0.5 bg-gray-700 my-1" />
						{navItems.slice(3).map((item) =>
							"external" in item && item.external ? (
								<a
									key={item.href}
									href={item.href}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => setMoreOpen(false)}
									className=" text-[8px] text-stone-400 hover:text-stone-300 hover:bg-slate-800 px-3 py-2 text-left uppercase tracking-wider cursor-pointer whitespace-nowrap">
									{item.icon} {item.label}
								</a>
							) : (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setMoreOpen(false)}
									className=" text-[8px] text-stone-400 hover:text-stone-300 hover:bg-slate-800 px-3 py-2 text-left uppercase tracking-wider whitespace-nowrap">
									{item.icon} {item.label}
								</Link>
							),
						)}
						<div className="h-0.5 bg-gray-700 my-1" />
						<button
							type="button"
							onClick={handleAuth}
							className={` text-[8px] px-3 py-2 text-left uppercase tracking-wider cursor-pointer whitespace-nowrap ${
								user
									? "text-stone-400 hover:text-stone-300 hover:bg-slate-800"
									: "text-rose-700 hover:text-rose-600 hover:bg-slate-800"
							}`}>
							{user ? "< SIGN OUT" : "> SIGN IN"}
						</button>
					</div>
				</>
			)}

			<nav className="fixed bottom-0 left-0 right-0 h-14 bg-slate-900 border-t-3 border-gray-700 z-50 flex md:hidden items-center justify-around px-1">
				{MOBILE_NAV_ITEMS.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1  ${
								isActive
									? "text-yellow-500"
									: "text-stone-400 hover:text-stone-300"
							}`}>
							<span className="text-[12px]">{item.icon}</span>
							<span className="text-[6px] uppercase tracking-wider">
								{item.label}
							</span>
						</Link>
					);
				})}
				<button
					type="button"
					onClick={() => setMoreOpen(!moreOpen)}
					className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1  cursor-pointer ${
						moreOpen ? "text-yellow-500" : "text-stone-400 hover:text-stone-300"
					}`}>
					<span className="text-[12px]">...</span>
					<span className="text-[6px] uppercase tracking-wider">MORE</span>
				</button>
			</nav>
		</>
	);
}
