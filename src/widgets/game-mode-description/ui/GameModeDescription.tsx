interface GameModeDescriptionProps {
	description: string;
}

export default function GameModeDescription({
	description,
}: GameModeDescriptionProps) {
	return (
		<div className=" text-[7px] text-gray-500 mt-2 leading-relaxed">
			{description}
		</div>
	);
}
