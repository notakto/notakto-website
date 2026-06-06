interface BoardStatusDotProps {
	dead: boolean;
}

export default function BoardStatusDot({ dead }: BoardStatusDotProps) {
	return (
		<div
			className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-all duration-300 ${
				dead
					? "bg-dead border-2 border-dead-border"
					: "bg-success border-2 border-success-dim"
			}`}
		/>
	);
}
