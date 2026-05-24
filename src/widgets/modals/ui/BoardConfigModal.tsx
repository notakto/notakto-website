"use client";
import { useState } from "react";
import type { BoardNumber, BoardSize } from "@/entities/game/model/types";
import ModalOverlay from "@/shared/ui/overlays/ModalOverlay";
import { BoardActionButton } from "@/widgets/modals/ui/buttons/BoardActionButton";
// Standardise components
import { BoardConfigButton } from "@/widgets/modals/ui/buttons/BoardConfigButton";
import BoardConfigAction from "@/widgets/modals/ui/containers/BoardConfig/BoardConfigAction";
import BoardConfigContainer from "@/widgets/modals/ui/containers/BoardConfig/BoardConfigContainer";
import BoardConfigOptions from "@/widgets/modals/ui/containers/BoardConfig/BoardConfigOptions";
import BoardConfigTitle from "@/widgets/modals/ui/title/BoardConfigTitle";
import type { BoardConfigModalProps } from "@/widgets/ui/types";

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
						<li key={num}>
							<BoardConfigButton
								label={num}
								isActive={selectedBoards === num}
								onClick={() => setSelectedBoards(num)}
							/>
						</li>
					))}
				</BoardConfigOptions>

				<BoardConfigTitle text="Board Size" />

				<BoardConfigOptions>
					{BoardSizes.map((size) => (
						<li key={size}>
							<BoardConfigButton
								label={`${size}x${size}`}
								isActive={selectedSize === size}
								onClick={() => setSelectedSize(size)}
							/>
						</li>
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
