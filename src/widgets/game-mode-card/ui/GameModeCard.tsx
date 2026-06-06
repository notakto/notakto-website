import type { GameMode } from "@/entities/game/model/types";
import GameModeArrow from "@/widgets/game-mode-arrow/ui/GameModeArrow";
import GameModeIcon from "@/widgets/game-mode-icon/ui/GameModeIcon";
import GameModeText from "@/widgets/game-mode-text/ui/GameModeText";

interface GameModeCardProps {
	mode: Exclude<GameMode, null>;
	title: string;
	description: string;
	icon: string;
	requiresAuth: boolean;
	onSelect: (mode: Exclude<GameMode, null>, requiresAuth: boolean) => void;
}

export default function GameModeCard({
	mode,
	title,
	description,
	icon,
	requiresAuth,
	onSelect,
}: GameModeCardProps) {
	return (
		<button
			type="button"
			onClick={() => onSelect(mode, requiresAuth)}
			className="group bg-panel pixel-border p-4 md:p-6 text-left cursor-pointer hover:bg-bg2 transition-colors duration-150 flex items-center gap-4 md:gap-6">
			<GameModeIcon icon={icon} />
			<GameModeText title={title} description={description} />
			<GameModeArrow />
		</button>
	);
}
