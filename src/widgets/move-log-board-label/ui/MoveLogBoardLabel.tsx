interface MoveLogBoardLabelProps {
	board: number;
}

export default function MoveLogBoardLabel({ board }: MoveLogBoardLabelProps) {
	return <span className="font-pixel text-[9px] text-cream">B{board + 1}</span>;
}
