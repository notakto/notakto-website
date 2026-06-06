interface BoardSelectorTabLabelProps {
	boardNumber: number;
}

export default function BoardSelectorTabLabel({
	boardNumber,
}: BoardSelectorTabLabelProps) {
	return <>BOARD {boardNumber}</>;
}
