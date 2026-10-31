interface MoveLogBoardLabelProps {
	board: number;
}

export default function MoveLogBoardLabel({ board }: MoveLogBoardLabelProps) {
	return <span className=" text-[9px] text-stone-300">B{board + 1}</span>;
}
