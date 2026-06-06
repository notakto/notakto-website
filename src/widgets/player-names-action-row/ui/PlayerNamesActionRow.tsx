import PlayerCancelButton from "@/widgets/player-cancel-button/ui/PlayerCancelButton";
import { PlayerStartButton } from "@/widgets/player-start-button/ui/PlayerStartButton";

interface PlayerNamesActionRowProps {
	onStart: () => void;
	onCancel?: () => void;
}

export default function PlayerNamesActionRow({
	onStart,
	onCancel,
}: PlayerNamesActionRowProps) {
	return (
		<div className="flex justify-center gap-4">
			<PlayerStartButton onClick={onStart}>Start Game</PlayerStartButton>
			{onCancel && <PlayerCancelButton onClick={onCancel} />}
		</div>
	);
}
