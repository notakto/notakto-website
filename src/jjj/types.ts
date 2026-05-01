import type { ReactNode } from "react";

export interface DashboardProps {
	children?: ReactNode;
}

export interface ToggleProps {
	enabled: boolean;
	onToggle: () => void;
}

export interface BackgroundParticle {
	id: number;
	char: string;
	x: number;
	y: number;
	size: number;
	opacity: number;
	speedX: number;
	speedY: number;
}
