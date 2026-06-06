"use client";
import type { FC } from "react";
import CellButton from "@/widgets/cell-button/ui/CellButton";
import CellValueDisplay from "@/widgets/cell-value-display/ui/CellValueDisplay";

interface CellProps {
	boardIndex: number;
	cellIndex: number;
	value: string;
	onPress: (boardIndex: number, cellIndex: number) => void;
	disabled: boolean;
	boardSize: number;
	owner?: 1 | 2;
	isLastMove?: boolean;
}

const Cell: FC<CellProps> = ({
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
