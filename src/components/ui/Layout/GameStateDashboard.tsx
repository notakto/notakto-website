"use client";
import type React from "react";
import { GameBackground } from "@/components/ui/Background/GameBackground";
import { ShortcutToggle } from "@/components/ui/Buttons/ShortcutToggle";
import type { DashboardProps } from "@/services/types";

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
