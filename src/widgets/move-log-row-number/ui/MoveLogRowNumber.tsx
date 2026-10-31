interface MoveLogRowNumberProps {
	index: number;
}

export default function MoveLogRowNumber({ index }: MoveLogRowNumberProps) {
	return (
		<span className=" text-[8px] text-gray-500 w-6 text-right">
			{index + 1}.
		</span>
	);
}
