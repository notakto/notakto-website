interface GameModeDescriptionProps {
	description: string;
}

export default function GameModeDescription({
	description,
}: GameModeDescriptionProps) {
	return (
		<div className="font-pixel text-[7px] text-muted mt-2 leading-relaxed">
			{description}
		</div>
	);
}
