"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { TOAST_DURATION, TOAST_IDS } from "@/constants/toast";
import { useUser } from "@/services/store";

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

const Menu = () => {
	const user = useUser((state) => state.user);
	const router = useRouter();
	const { canShowToast, resetCooldown } = useToastCooldown(TOAST_DURATION);

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
};

export default Menu;
