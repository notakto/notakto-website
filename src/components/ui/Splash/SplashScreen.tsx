"use client";

import { useEffect, useState } from "react";
import { useSplash } from "@/services/splash";

export default function SplashScreen() {
	const { hasSeenSplash, setHasSeenSplash } = useSplash();
	const [phase, setPhase] = useState(0);

	useEffect(() => {
		console.log("Phase changed:", phase);
	}, [phase]);
	useEffect(() => {
		if (hasSeenSplash) return;

		const t1 = setTimeout(() => setPhase(1), 800);
		const t2 = setTimeout(() => setPhase(2), 2200);
		const t3 = setTimeout(() => setPhase(3), 3400);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	}, [hasSeenSplash]);

	if (hasSeenSplash) return null;

	const dismiss = () => {
		setHasSeenSplash(true);
	};

	return (
		<div className="fixed inset-0 z-9999 bg-bg0 flex flex-col items-center justify-center">
			{/* Phase 0: Boot text */}
			{phase >= 0 && (
				<div
					className={`font-pixel text-[8px] text-muted mb-8 animate-boot-flicker ${phase > 0 ? "opacity-40" : ""}`}>
					NOTAKTO SYSTEMS v2.1
				</div>
			)}

			{/* Phase 1: System check */}
			{phase >= 1 && (
				<div
					className={`font-pixel text-[7px] text-success space-y-2 mb-8 animate-slide-up ${phase > 1 ? "opacity-40" : ""}`}>
					<div>RAM OK ............. 128K</div>
					<div>BOARD CHECK ........ PASS</div>
					<div>SYSTEM ............. READY</div>
				</div>
			)}

			{/* Phase 2: Title */}
			{phase >= 2 && (
				<div className="text-center mb-8 animate-slide-up">
					<div className="font-pixel text-primary text-2xl pixel-text-shadow mb-4">
						NOTAKTO
					</div>
					<div className="font-pixel text-[8px] text-cream-dim">
						NO TIES · ALWAYS A WINNER
					</div>
				</div>
			)}

			{/* Phase 3: Insert coin */}
			{phase >= 3 && (
				<div className="text-center animate-slide-up">
					<button
						type="button"
						onClick={dismiss}
						className="font-pixel text-[10px] text-bg0 bg-accent border-3 border-border-light px-8 py-3 cursor-pointer hover:bg-accent-dim shadow-[3px_3px_0_var(--color-bg0)] transition-all duration-100 uppercase tracking-wider mb-4">
						INSERT COIN
					</button>
					<div className="font-pixel text-[8px] text-accent animate-blink">
						PRESS START
					</div>
				</div>
			)}
		</div>
	);
}
