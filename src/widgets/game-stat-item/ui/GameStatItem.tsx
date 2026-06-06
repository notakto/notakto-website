import GameStatLabel from "@/widgets/game-stat-label/ui/GameStatLabel";
import GameStatValue from "@/widgets/game-stat-value/ui/GameStatValue";

interface GameStatItemProps {
	label: string;
	value: string | number;
}

export default function GameStatItem({ label, value }: GameStatItemProps) {
	return (
		<div className="py-1">
			<GameStatValue value={value} />
			<GameStatLabel label={label} />
		</div>
	);
}
