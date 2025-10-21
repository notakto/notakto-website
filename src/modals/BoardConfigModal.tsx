"use client";
import { useState } from "react";
import { BoardActionButton } from "@/components/ui/Buttons/BoardActionButton";
// Standardise components
import { BoardConfigButton } from "@/components/ui/Buttons/BoardConfigButton";
import BoardConfigAction from "@/components/ui/Containers/BoardConfig/BoardConfigAction";
import BoardConfigContainer from "@/components/ui/Containers/BoardConfig/BoardConfigContainer";
import BoardConfigOptions from "@/components/ui/Containers/BoardConfig/BoardConfigOptions";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import BoardConfigTitle from "@/components/ui/Title/BoardConfigTitle";
import type {
	BoardConfigModalProps,
	BoardNumber,
	BoardSize,
} from "@/services/types";

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
						<BoardConfigButton
							key={num}
							label={num}
							isActive={selectedBoards === num}
							onClick={() => setSelectedBoards(num)}
						/>
					))}
				</BoardConfigOptions>

				<BoardConfigTitle text="Board Size" />

				<BoardConfigOptions>
					{BoardSizes.map((size) => (
						<BoardConfigButton
							key={size}
							label={`${size}x${size}`}
							isActive={selectedSize === size}
							onClick={() => setSelectedSize(size)}
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
