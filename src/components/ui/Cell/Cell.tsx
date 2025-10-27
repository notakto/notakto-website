"use client";
import CellButton from "@/components/ui/Buttons/CellButton";
import CellValueDisplay from "@/components/ui/Cell/CellValueDisplay";
import type { CellProps } from "@/services/types";

const Cell: React.FC<CellProps> = ({
	boardIndex,
	cellIndex,
	value,
	onPress,
	disabled,
}) => {
	const handleClick = () => onPress(boardIndex, cellIndex);
	const isDisabled = disabled || !!value;

	return (
		<CellButton onClick={handleClick} disabled={isDisabled}>
			<CellValueDisplay value={value} />
		</CellButton>
	);
};

export default Cell;
