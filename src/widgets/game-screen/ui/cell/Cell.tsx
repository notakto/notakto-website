"use client";
import CellValueDisplay from "@/widgets/game-screen/ui/cell/CellValueDisplay";
import CellButton from "@/widgets/modals/ui/buttons/CellButton";
import type { CellProps } from "@/widgets/ui/types";

const Cell: React.FC<CellProps> = ({
	boardIndex,
	cellIndex,
	value,
	onPress,
	disabled,
	owner,
	isLastMove,
}) => {
	const handleClick = () => onPress(boardIndex, cellIndex);
	const isDisabled = disabled || !!value;

	return (
		<CellButton
			onClick={handleClick}
			disabled={isDisabled}
			isLastMove={isLastMove}
			owner={owner}>
			<CellValueDisplay value={value} owner={owner} />
		</CellButton>
	);
};

export default Cell;
