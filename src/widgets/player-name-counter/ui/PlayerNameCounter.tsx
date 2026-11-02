interface PlayerNameCounterProps {
	length: number;
	maxLength: number;
}

export default function PlayerNameCounter({
	length,
	maxLength,
}: PlayerNameCounterProps) {
	return (
		<div className="text-[8px] text-stone-400  mt-1 text-right">
			{length}/{maxLength}
		</div>
	);
}
