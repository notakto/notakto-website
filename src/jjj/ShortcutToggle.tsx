"use client";
import { motion } from "framer-motion";
import React from "react";
import { useShortcutStore } from "@/services/store";

export const ShortcutToggle: React.FC = () => {
	const [isMounted, setIsMounted] = React.useState(false);
	const { shortcutsEnabled, toggleShortcuts } = useShortcutStore();

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<div className="fixed top-6 right-6 z-[100] flex items-center gap-3">
			<span className="text-white/50 text-xs font-mono tracking-tighter uppercase hidden sm:block">
				Shortcuts
			</span>
			<motion.button
				onClick={toggleShortcuts}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className={`
                    relative w-14 h-7 rounded-full p-1 transition-all duration-500
                    backdrop-blur-md border border-white/20
                    ${shortcutsEnabled ? "bg-red-600/40" : "bg-white/10"}
                `}
				style={{
					backgroundColor: shortcutsEnabled
						? "rgba(220, 38, 38, 0.4)"
						: "rgba(255, 255, 255, 0.1)",
					boxShadow: shortcutsEnabled
						? "0 0 15px rgba(220, 38, 38, 0.3)"
						: "none",
				}}>
				<motion.div
					animate={{ x: shortcutsEnabled ? 28 : 0 }}
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
					className="w-5 h-5 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden">
					<div
						className={`w-2 h-2 rounded-full ${shortcutsEnabled ? "bg-red-600" : "bg-gray-400"}`}
					/>
				</motion.div>
			</motion.button>

			{/* Glassmorphism background for the label/toggle area if needed */}
			<div className="absolute -inset-2 bg-white/5 rounded-xl blur-lg -z-10" />
		</div>
	);
};
