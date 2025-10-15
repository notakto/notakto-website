interface CellValueDisplayProps {
	value: string | null;
}

export default function CellValueDisplay({ value }: CellValueDisplayProps) {
	if (!value) return null;

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<span
				className="text-red-600 text-5xl"
				style={{
					lineHeight: 1,
					filter: "drop-shadow(0 0 2px rgba(255,0,0,0.5))",
				}}>
				{value}
			</span>
		</div>
	);
}
