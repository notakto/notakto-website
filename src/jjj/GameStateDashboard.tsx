"use client";
import type React from "react";
import { GameBackground } from "@/jjj/GameBackground";
import { ShortcutToggle } from "@/jjj/ShortcutToggle";
import type { DashboardProps } from "@/jjj/types";

/**
 * GameStateDashboard Component
 * Combines the Shortcut Toggle and the Dynamic Game Background into a single module.
 */
export const GameStateDashboard: React.FC<DashboardProps> = ({ children }) => {
	return (
		<>
			<GameBackground />
			<ShortcutToggle />
			{children}
		</>
	);
};

export default GameStateDashboard;
