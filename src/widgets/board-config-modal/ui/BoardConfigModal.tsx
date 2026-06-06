"use client";
import { useState } from "react";
import type { BoardNumber, BoardSize } from "@/entities/game/model/types";
import { BoardActionButton } from "@/widgets/board-action-button/ui/BoardActionButton";
import BoardConfigAction from "@/widgets/board-config-action/ui/BoardConfigAction";
import BoardConfigContainer from "@/widgets/board-config-container/ui/BoardConfigContainer";
import BoardConfigOptionItem from "@/widgets/board-config-option-item/ui/BoardConfigOptionItem";
import BoardConfigOptions from "@/widgets/board-config-options/ui/BoardConfigOptions";
import BoardConfigTitle from "@/widgets/board-config-title/ui/BoardConfigTitle";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";

interface BoardConfigModalProps {
	visible: boolean;
	onClose?: () => void;
	currentBoards: BoardNumber;
	currentSize: BoardSize;
	onConfirm: (num: BoardNumber, size: BoardSize) => void;
	onCancel: () => void;
}

const BoardConfigModal = ({
	visible,
	currentBoards,
	currentSize,
	onConfirm,
	onCancel,
}: BoardConfigModalProps) => {
	const [selectedBoards, setSelectedBoards] =
		useState<BoardNumber>(currentBoards);
	const [selectedSize, setSelectedSize] = useState<BoardSize>(currentSize);
	const BoardNumbers: BoardNumber[] = [1, 2, 3, 4, 5];
	const BoardSizes: BoardSize[] = [2, 3, 4, 5];

	if (!visible) return null;

	return (
		<ModalOverlay>
			<BoardConfigContainer>
				<BoardConfigTitle text="Number of Boards" />
				<BoardConfigOptions>
					{BoardNumbers.map((num) => (
						<BoardConfigOptionItem
							key={num}
							label={num}
							value={num}
							isActive={selectedBoards === num}
							onSelect={(value) => setSelectedBoards(value as BoardNumber)}
						/>
					))}
				</BoardConfigOptions>

				<BoardConfigTitle text="Board Size" />

				<BoardConfigOptions>
					{BoardSizes.map((size) => (
						<BoardConfigOptionItem
							key={size}
							label={`${size}x${size}`}
							value={size}
							isActive={selectedSize === size}
							onSelect={(value) => setSelectedSize(value as BoardSize)}
						/>
					))}
				</BoardConfigOptions>

				<BoardConfigAction>
					<BoardActionButton onClick={onCancel}>Cancel</BoardActionButton>

					<BoardActionButton
						onClick={() => onConfirm(selectedBoards, selectedSize)}>
						Apply
					</BoardActionButton>
				</BoardConfigAction>
			</BoardConfigContainer>
		</ModalOverlay>
	);
};

export default BoardConfigModal;
