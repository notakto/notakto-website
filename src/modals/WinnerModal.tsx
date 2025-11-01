"use client";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { WinnerButton } from "@/components/ui/Buttons/WinnerButton";
import WinnerAction from "@/components/ui/Containers/WinnerModal/WinnerAction";
import WinnerContainer from "@/components/ui/Containers/WinnerModal/WinnerContainer";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import WinnerMessage from "@/components/ui/Title/WinnerMessage";
import WinnerTitle from "@/components/ui/Title/WinnerTitle";
import type { WinnerModalProps } from "@/services/types";

const WinnerModal = ({
	visible,
	winner,
	onPlayAgain,
	onMenu,
}: WinnerModalProps) => {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		// Update confetti bounds when window resizes
		const handleResize = () =>
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	if (!visible) return null;

	return (
		<ModalOverlay>
			{/* Confetti celebration */}
			<Confetti
				width={windowSize.width}
				height={windowSize.height}
				numberOfPieces={100}
				recycle={true}
				gravity={0.25}
				tweenDuration={10000}
			/>

			<WinnerContainer>
				<WinnerTitle text="Game Over!" />
				<WinnerMessage
					text={winner === "You" ? "You won!" : `${winner} wins`}
				/>
				<WinnerAction>
					<WinnerButton onClick={onPlayAgain}>Play Again</WinnerButton>
					<WinnerButton onClick={onMenu}>Main Menu</WinnerButton>
				</WinnerAction>
			</WinnerContainer>
		</ModalOverlay>
	);
};

export default WinnerModal;
