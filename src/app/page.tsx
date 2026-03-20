"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";

export default function Home() {
	const router = useRouter();
	const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOnCooldown = useRef(false);
	const userStore = create((set: any) => ({
		user: null,
		authReady: false,
		setUser: (newUser: any) => set({ user: newUser }),
		setAuthReady: (v: boolean) => set({ authReady: v }),
	}));
	const user = userStore((state: any) => state.user);

	const canShowToast = () => !isOnCooldown.current;
	const resetCooldown = () => {
		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}
		cooldownTimer.current = null;
		isOnCooldown.current = false;
	};

	const startGame = (mode: string, requiresAuth: boolean) => {
		if (requiresAuth && !user) {
			if (canShowToast()) {
				toast("Please sign in!", {
					toastId: "auth/sign-in-error",
					autoClose: 4000,
					onClose: resetCooldown,
				});
			}
			return;
		}
		router.push(`/${mode}`);
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#0e0e1a", alignItems: "center", justifyContent: "center" }}>
			<div style={{ textAlign: "center", marginBottom: "32px", animation: "drop 0.4s ease-out" }}>
				<h1 style={{ fontFamily: "monospace", color: "#c43c3c", textShadow: "2px 2px 0 #0e0e1a, -1px -1px 0 #0e0e1a", fontSize: "24px", letterSpacing: "0.2em", marginBottom: "16px" }}>
					NOTAKTO
				</h1>
				<p style={{ fontFamily: "monospace", color: "#a89878", fontSize: "8px", letterSpacing: "0.1em" }}>
					NO TIES · ALWAYS A WINNER
				</p>
				<div style={{ height: "3px", backgroundColor: "#3a3a56", marginTop: "24px", marginLeft: "auto", marginRight: "auto", width: "192px", boxShadow: "0 1px 0 #0e0e1a" }} />
			</div>

			<div style={{ display: "grid", gap: "16px", width: "100%", maxWidth: "672px" }}>
				<button
					type="button"
					onClick={() => startGame("vsPlayer", false)}
					style={{
						backgroundColor: "#1e1e32",
						border: "3px solid #3a3a56",
						boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
						padding: "16px 24px",
						textAlign: "left",
						cursor: "pointer",
						transition: "backgroundColor 0.15s",
						display: "flex",
						alignItems: "center",
						gap: "16px 24px"
					}}
					onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#222238"; }}
					onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1e1e32"; }}>
					<div style={{ width: "40px", height: "40px", backgroundColor: "#0e0e1a", border: "3px solid #3a3a56", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "borderColor 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8a040"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a56"; }}>
						<span style={{ fontFamily: "monospace", fontSize: "20px", color: "#c8a040" }}>+</span>
					</div>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div style={{ fontFamily: "monospace", fontSize: "14px", color: "#e4d8c0", textTransform: "uppercase", letterSpacing: "0.1em", transition: "color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#f0e8d8"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#e4d8c0"; }}>
							VS PLAYER
						</div>
						<div style={{ fontFamily: "monospace", fontSize: "7px", color: "#6e6e88", marginTop: "8px", lineHeight: "1.5" }}>
							CHALLENGE A FRIEND ON THE SAME DEVICE
						</div>
					</div>
					<span style={{ fontFamily: "monospace", fontSize: "10px", color: "#6e6e88", transition: "color 0.15s", flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.color = "#c8a040"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#6e6e88"; }}>
						{">"}
					</span>
				</button>

				<button
					type="button"
					onClick={() => startGame("vsComputer", true)}
					style={{
						backgroundColor: "#1e1e32",
						border: "3px solid #3a3a56",
						boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
						padding: "16px 24px",
						textAlign: "left",
						cursor: "pointer",
						transition: "backgroundColor 0.15s",
						display: "flex",
						alignItems: "center",
						gap: "16px 24px"
					}}
					onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#222238"; }}
					onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1e1e32"; }}>
					<div style={{ width: "40px", height: "40px", backgroundColor: "#0e0e1a", border: "3px solid #3a3a56", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "borderColor 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8a040"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a56"; }}>
						<span style={{ fontFamily: "monospace", fontSize: "20px", color: "#c8a040" }}>{">"}</span>
					</div>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div style={{ fontFamily: "monospace", fontSize: "14px", color: "#e4d8c0", textTransform: "uppercase", letterSpacing: "0.1em", transition: "color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#f0e8d8"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#e4d8c0"; }}>
							VS CPU
						</div>
						<div style={{ fontFamily: "monospace", fontSize: "7px", color: "#6e6e88", marginTop: "8px", lineHeight: "1.5" }}>
							TEST YOUR SKILLS AGAINST THE AI
						</div>
					</div>
					<span style={{ fontFamily: "monospace", fontSize: "10px", color: "#6e6e88", transition: "color 0.15s", flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.color = "#c8a040"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#6e6e88"; }}>
						{">"}
					</span>
				</button>

				<button
					type="button"
					onClick={() => startGame("liveMatch", true)}
					style={{
						backgroundColor: "#1e1e32",
						border: "3px solid #3a3a56",
						boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
						padding: "16px 24px",
						textAlign: "left",
						cursor: "pointer",
						transition: "backgroundColor 0.15s",
						display: "flex",
						alignItems: "center",
						gap: "16px 24px"
					}}
					onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#222238"; }}
					onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#1e1e32"; }}>
					<div style={{ width: "40px", height: "40px", backgroundColor: "#0e0e1a", border: "3px solid #3a3a56", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "borderColor 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8a040"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3a56"; }}>
						<span style={{ fontFamily: "monospace", fontSize: "20px", color: "#c8a040" }}>#</span>
					</div>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div style={{ fontFamily: "monospace", fontSize: "14px", color: "#e4d8c0", textTransform: "uppercase", letterSpacing: "0.1em", transition: "color 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#f0e8d8"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#e4d8c0"; }}>
							LIVE MATCH
						</div>
						<div style={{ fontFamily: "monospace", fontSize: "7px", color: "#6e6e88", marginTop: "8px", lineHeight: "1.5" }}>
							PLAY AGAINST OPPONENTS ONLINE
						</div>
					</div>
					<span style={{ fontFamily: "monospace", fontSize: "10px", color: "#6e6e88", transition: "color 0.15s", flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.color = "#c8a040"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#6e6e88"; }}>
						{">"}
					</span>
				</button>
			</div>

			<div style={{ marginTop: "32px", fontFamily: "monospace", fontSize: "7px", color: "#6e6e88", animation: "pulse 2s ease-in-out infinite", textAlign: "center" }}>
				<span style={{ display: "none" }}>USE SIDEBAR TO ACCESS SETTINGS & MORE</span>
				<span style={{ display: "inline" }}>TAP MORE FOR SETTINGS & OPTIONS</span>
			</div>
		</div>
	);
}