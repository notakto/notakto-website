"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";

// ===== TYPES =====
interface UserStore {
	user: { uid: string } | null;
	authReady: boolean;
	setUser: (newUser: { uid: string } | null) => void;
	setAuthReady: (v: boolean) => void;
}

// ===== STORE =====
const useUser = create<UserStore>((set) => ({
	user: null,
	authReady: false,
	setUser: (newUser) => set({ user: newUser }),
	setAuthReady: (v: boolean) => set({ authReady: v }),
}));

// ===== CONSTANTS =====
const TOAST_DURATION = 4000;
const TOAST_IDS = {
	User: {
		SignInError: "auth/sign-in-error",
	},
} as const;

// ===== HOOKS =====
function useToastCooldown(cooldown: number = TOAST_DURATION) {
	const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOnCooldown = useRef(false);

	const canShowToast = useCallback(() => !isOnCooldown.current, []);

	const triggerToastCooldown = useCallback(() => {
		isOnCooldown.current = true;

		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}
		cooldownTimer.current = setTimeout(() => {
			isOnCooldown.current = false;
			cooldownTimer.current = null;
		}, cooldown);
	}, [cooldown]);

	const resetCooldown = useCallback(() => {
		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}
		cooldownTimer.current = null;
		isOnCooldown.current = false;
	}, []);

	return { canShowToast, triggerToastCooldown, resetCooldown };
}

// ===== COMPONENTS =====
function MenuLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex-col min-h-screen bg-bg0 flex items-center justify-center">
			{children}
		</div>
	);
}

function Menu() {
	const user = useUser((state) => state.user);
	const router = useRouter();
	const { canShowToast, resetCooldown } = useToastCooldown(TOAST_DURATION);

	const GAME_MODES = [
		{
			mode: "vsPlayer",
			title: "VS PLAYER",
			desc: "CHALLENGE A FRIEND ON THE SAME DEVICE",
			icon: "+",
			requiresAuth: false,
		},
		{
			mode: "vsComputer",
			title: "VS CPU",
			desc: "TEST YOUR SKILLS AGAINST THE AI",
			icon: ">",
			requiresAuth: true,
		},
		{
			mode: "liveMatch",
			title: "LIVE MATCH",
			desc: "PLAY AGAINST OPPONENTS ONLINE",
			icon: "#",
			requiresAuth: true,
		},
	];

	const startGame = (mode: string, requiresAuth: boolean) => {
		if (requiresAuth && !user) {
			if (canShowToast()) {
				toast("Please sign in!", {
					toastId: TOAST_IDS.User.SignInError,
					autoClose: TOAST_DURATION,
					onClose: resetCooldown,
				});
			}
			return;
		}
		router.push(`/${mode}`);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
			{/* Title */}
			<div className="text-center mb-8 md:mb-12 animate-drop">
				<h1 className="font-pixel text-primary pixel-text-shadow text-2xl md:text-4xl tracking-widest mb-4">
					NOTAKTO
				</h1>
				<p className="font-pixel text-[8px] text-cream-dim tracking-wider">
					NO TIES · ALWAYS A WINNER
				</p>
				<div className="h-[3px] bg-border-pixel mt-6 mx-auto w-48 shadow-[0_1px_0_var(--color-bg0)]" />
			</div>

			{/* Game mode cards */}
			<div className="grid gap-4 md:gap-6 w-full max-w-2xl">
				{GAME_MODES.map((g) => (
					<button
						type="button"
						key={g.mode}
						onClick={() => startGame(g.mode, g.requiresAuth)}
						className="group bg-panel pixel-border p-4 md:p-6 text-left cursor-pointer hover:bg-bg2 transition-colors duration-150 flex items-center gap-4 md:gap-6">
						{/* Icon */}
						<div className="w-10 h-10 md:w-14 md:h-14 bg-bg0 border-3 border-border-pixel flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
							<span className="font-pixel text-xl text-accent">{g.icon}</span>
						</div>

						{/* Text */}
						<div className="flex-1 min-w-0">
							<div className="font-pixel text-sm text-cream uppercase tracking-wider group-hover:text-pixel-white transition-colors">
								{g.title}
							</div>
							<div className="font-pixel text-[7px] text-muted mt-2 leading-relaxed">
								{g.desc}
							</div>
						</div>

						{/* Arrow */}
						<span className="font-pixel text-[10px] text-muted group-hover:text-accent transition-colors shrink-0">
							{">"}
						</span>
					</button>
				))}
			</div>

			{/* Footer hint */}
			<div className="mt-8 md:mt-12 font-pixel text-[7px] text-muted animate-pulse-pixel text-center">
				<span className="hidden md:inline">
					USE SIDEBAR TO ACCESS SETTINGS & MORE
				</span>
				<span className="md:hidden">TAP MORE FOR SETTINGS & OPTIONS</span>
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<MenuLayout>
			<Menu />
		</MenuLayout>
	);
}
