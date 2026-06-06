"use client";

import GameActionButton from "@/widgets/game-action-button/ui/GameActionButton";

export interface GameAction {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "primary" | "default" | "danger";
}

interface GameActionBarProps {
	actions: GameAction[];
}

export default function GameActionBar({ actions }: GameActionBarProps) {
	return (
		<div className="flex flex-wrap justify-center gap-2.5 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 md:gap-4 md:px-4 md:py-3.5 border-t-2 border-border-pixel bg-bg1 shrink-0">
			{actions.map((action) => (
				<GameActionButton
					key={action.label}
					label={action.label}
					onClick={action.onClick}
					disabled={action.disabled}
					variant={action.variant}
				/>
			))}
		</div>
	);
}
