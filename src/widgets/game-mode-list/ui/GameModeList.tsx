import type { GameMode } from "@/entities/game/model/types";
import GameModeCard from "@/widgets/game-mode-card/ui/GameModeCard";

interface GameModeItem {
	mode: Exclude<GameMode, null>;
	title: string;
	description: string;
	icon: string;
	requiresAuth: boolean;
}

interface GameModeListProps {
	modes: GameModeItem[];
	onSelect: (mode: Exclude<GameMode, null>, requiresAuth: boolean) => void;
}

export default function GameModeList({ modes, onSelect }: GameModeListProps) {
	return (
		<div className="grid gap-4 md:gap-6 w-full max-w-2xl">
			{modes.map((mode) => (
				<GameModeCard
					key={mode.mode}
					mode={mode.mode}
					title={mode.title}
					description={mode.description}
					icon={mode.icon}
					requiresAuth={mode.requiresAuth}
					onSelect={onSelect}
				/>
			))}
		</div>
	);
}
