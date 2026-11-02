interface BoardStatusDotProps {
	dead: boolean;
}

export default function BoardStatusDot({ dead }: BoardStatusDotProps) {
	return (
		<div
			className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-all duration-300 ${
				dead
					? "bg-gray-800 border-2 border-zinc-700"
					: "bg-green-700 border-2 border-green-800"
			}`}
		/>
	);
}
