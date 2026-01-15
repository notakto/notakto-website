"use client";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("BoardConfigModal");
	const [selectedBoards, setSelectedBoards] =
		useState<BoardNumber>(currentBoards);
	const [selectedSize, setSelectedSize] = useState<BoardSize>(currentSize);
	const BoardNumbers: BoardNumber[] = [1, 2, 3, 4, 5];
	const BoardSizes: BoardSize[] = [2, 3, 4, 5];

	if (!visible) return null;

	return (
		<ModalOverlay>
			<BoardConfigContainer>
				<BoardConfigTitle text={t("number_of_boards")} />
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

				<BoardConfigTitle text={t("board_size")} />

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
					<BoardActionButton onClick={onCancel}>
						{t("cancel")}
					</BoardActionButton>

					<BoardActionButton
						onClick={() => onConfirm(selectedBoards, selectedSize)}>
						{t("apply")}
					</BoardActionButton>
				</BoardConfigAction>
			</BoardConfigContainer>
		</ModalOverlay>
	);
};

export default BoardConfigModal;
