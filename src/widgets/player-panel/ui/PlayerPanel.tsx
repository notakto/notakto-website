import CurrentPlayerMarker from "@/widgets/current-player-marker/ui/CurrentPlayerMarker";
import PlayerMoveCount from "@/widgets/player-move-count/ui/PlayerMoveCount";
import PlayerNameLabel from "@/widgets/player-name-label/ui/PlayerNameLabel";

interface PlayerPanelProps {
	name: string;
	moveCount: number;
	active: boolean;
	side: 1 | 2;
}

export default function PlayerPanel({
	name,
	moveCount,
	active,
	side,
}: PlayerPanelProps) {
	return (
		<div
			className={`flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 pixel-border flex-1 min-w-0 transition-colors ${
				active ? "border-accent" : ""
			}`}>
			{side === 1 && active && <CurrentPlayerMarker />}
			<div className={`min-w-0 flex-1 ${side === 2 ? "text-right" : ""}`}>
				<PlayerNameLabel name={name} />
				<PlayerMoveCount
					moveCount={moveCount}
					align={side === 2 ? "right" : "left"}
				/>
			</div>
			{side === 2 && active && <CurrentPlayerMarker />}
		</div>
	);
}
