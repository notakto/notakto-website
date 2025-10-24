interface CellValueDisplayProps {
	value: string | null;
}

export default function CellValueDisplay({ value }: CellValueDisplayProps) {
	if (!value) return null;

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<span className="text-red-600 text-5xl leading-none drop-shadow-[0_0_2px_rgba(255,0,0,0.5)]">
				{value}
			</span>
		</div>
	);
}
