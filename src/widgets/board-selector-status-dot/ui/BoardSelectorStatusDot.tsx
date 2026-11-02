interface BoardSelectorStatusDotProps {
	dead: boolean;
}

export default function BoardSelectorStatusDot({
	dead,
}: BoardSelectorStatusDotProps) {
	return (
		<span
			className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border border-slate-950 ${
				dead ? "bg-gray-800" : "bg-green-700"
			}`}
		/>
	);
}
