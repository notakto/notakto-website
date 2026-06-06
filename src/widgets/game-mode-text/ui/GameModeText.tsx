import GameModeDescription from "@/widgets/game-mode-description/ui/GameModeDescription";
import GameModeTitle from "@/widgets/game-mode-title/ui/GameModeTitle";

interface GameModeTextProps {
	title: string;
	description: string;
}

export default function GameModeText({
	title,
	description,
}: GameModeTextProps) {
	return (
		<div className="flex-1 min-w-0">
			<GameModeTitle title={title} />
			<GameModeDescription description={description} />
		</div>
	);
}
