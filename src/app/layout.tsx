"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
	weight: "400",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={pressStart2P.className}>
			<head>
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4854199776978392"
					crossOrigin="anonymous"></script>
				<meta
					name="google-site-verification"
					content="lxHtpLX2cDKFEAAabqQ3-9IY-ckiw3KvqM3Z1kNPxRo"
				/>
				<meta name="monetag" content="31cbc3974b21341db36f756db33d15d6"></meta>
				<style
					dangerouslySetInnerHTML={{
						__html: `
							@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
							@import "tailwindcss";

							@theme {
								--color-bg0: #0e0e1a;
								--color-bg1: #181828;
								--color-bg2: #222238;
								--color-bg3: #2c2c44;
								--color-panel: #1e1e32;
								--color-border-pixel: #3a3a56;
								--color-border-light: #4e4e6a;
								--color-primary: #c43c3c;
								--color-primary-hover: #d85050;
								--color-accent: #c8a040;
								--color-accent-dim: #8a7030;
								--color-cream: #e4d8c0;
								--color-cream-dim: #a89878;
								--color-muted: #6e6e88;
								--color-pixel-white: #f0e8d8;
								--color-success: #4c8c3c;
								--color-success-dim: #3a6a2e;
								--color-warning: #c89030;
								--color-dead: #2a2a3a;
								--color-dead-border: #3a3a4a;
								--color-x: #c43c3c;
								--color-x-preview: #6e3030;
								--color-board-bg: #14141e;
								--font-pixel: "Press Start 2P", monospace;
								--animate-blink: blink 1s step-end infinite;
								--animate-pulse-pixel: pulse-pixel 2s ease-in-out infinite;
								--animate-slide-up: slideUp 0.3s ease-out;
								--animate-boot-flicker: bootFlicker 0.8s ease-out;
								--animate-marquee: marquee 12s linear infinite;
								--animate-drop: drop 0.4s ease-out;
							}

							@keyframes blink {
								0%, 49% { opacity: 1; }
								50%, 100% { opacity: 0; }
							}

							@keyframes pulse-pixel {
								0%, 100% { opacity: 1; }
								50% { opacity: 0.5; }
							}

							@keyframes slideUp {
								from { transform: translateY(12px); opacity: 0; }
								to { transform: translateY(0); opacity: 1; }
							}

							@keyframes bootFlicker {
								0% { opacity: 0; }
								5% { opacity: 1; }
								10% { opacity: 0; }
								15% { opacity: 1; }
								100% { opacity: 1; }
							}

							@keyframes marquee {
								0% { transform: translateX(100%); }
								100% { transform: translateX(-100%); }
							}

							@keyframes drop {
								from { transform: translateY(-20px); opacity: 0; }
								to { transform: translateY(0); opacity: 1; }
							}

							.pixel-border {
								border: 3px solid var(--color-border-pixel);
								box-shadow: inset 0 0 0 1px var(--color-bg0), 3px 3px 0 var(--color-bg0);
							}

							.pixel-border-primary {
								border: 3px solid var(--color-primary);
								box-shadow: inset 0 0 0 1px var(--color-bg0), 3px 3px 0 var(--color-bg0);
							}

							.pixel-border-accent {
								border: 3px solid var(--color-accent);
								box-shadow: inset 0 0 0 1px var(--color-bg0), 3px 3px 0 var(--color-bg0);
							}

							.pixel-text-shadow {
								text-shadow: 2px 2px 0 var(--color-bg0), -1px -1px 0 var(--color-bg0);
							}

							.scanline-overlay {
								pointer-events: none;
								position: fixed;
								inset: 0;
								z-index: 9998;
								background: repeating-linear-gradient(
									0deg,
									transparent,
									transparent 2px,
									rgba(0, 0, 0, 0.05) 2px,
									rgba(0, 0, 0, 0.05) 4px
								);
							}

							.progress-fill { width: var(--progress-width, 0%); }
							.sidebar-tooltip-pos {
								left: var(--tooltip-left);
								top: var(--tooltip-top);
								transform: translateY(-50%);
							}

							::-webkit-scrollbar { width: 8px; }
							::-webkit-scrollbar-track { background: var(--color-bg1); }
							::-webkit-scrollbar-thumb {
								background: var(--color-border-pixel);
								border: 2px solid var(--color-bg1);
							}
						`,
					}}
				/>
			</head>
			<body className="bg-bg0 text-pixel-white">
				<Sidebar />
				<SidebarMargin>{children}</SidebarMargin>
				<Analytics />
				<SpeedInsights />
				<ClientSideInit />
			</body>
		</html>
	);
}

// ===== REACT IMPORTS =====
import { useEffect } from "react";
import { create } from "zustand";

// ===== TYPES & STORE =====
interface UserStore {
	user: { uid: string } | null;
	authReady: boolean;
	setUser: (newUser: { uid: string } | null) => void;
	setAuthReady: (v: boolean) => void;
}

const useUser = create<UserStore>((set) => ({
	user: null,
	authReady: false,
	setUser: (newUser) => set({ user: newUser }),
	setAuthReady: (v: boolean) => set({ authReady: v }),
}));

// ===== COMPONENTS =====
function Sidebar() {
	return (
		<div className="fixed left-0 top-0 h-full w-16 bg-bg1 border-r-3 border-border-pixel z-50 flex flex-col items-center py-4 gap-4">
			<button
				type="button"
				className="w-10 h-10 bg-panel pixel-border flex items-center justify-center text-accent hover:bg-bg2 cursor-pointer">
				<span className="font-pixel text-xl">+</span>
			</button>
			<button
				type="button"
				className="w-10 h-10 bg-panel pixel-border flex items-center justify-center text-cream hover:bg-bg2 cursor-pointer">
				<span className="font-pixel text-lg">⚙</span>
			</button>
		</div>
	);
}

function SidebarMargin({ children }: { children: React.ReactNode }) {
	return <div className="ml-16">{children}</div>;
}

// ===== CLIENT SIDE INIT =====
function ClientSideInit(): null {
	const setUser = useUser(
		(state): ((newUser: { uid: string } | null) => void) => state.setUser,
	);
	const setAuthReady = useUser(
		(state): ((v: boolean) => void) => state.setAuthReady,
	);

	useEffect(() => {
		// Simple auth check - in real app this would connect to Firebase
		setAuthReady(true);
	}, [setAuthReady]);

	return null;
}
