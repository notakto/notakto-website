"use client";

import { AnimatePresence, motion } from "framer-motion";
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
	const [windowSize, setWindowSize] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});
	const [burst, setBurst] = useState(false);
	const [confettiKey, setConfettiKey] = useState(0);

	useEffect(() => {
		const handleResize = () =>
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (visible) {
			setBurst(true);
			setConfettiKey((prev) => prev + 1);
			const timer = setTimeout(() => setBurst(false), 800);
			return () => clearTimeout(timer);
		}
	}, [visible]);

	if (!visible) return null;

	return (
		<ModalOverlay>
			<Confetti
				key={confettiKey}
				width={windowSize.width}
				height={windowSize.height}
				numberOfPieces={burst ? 800 : 150}
				recycle={true}
				gravity={0.25}
				initialVelocityY={30}
				run={true}
			/>

			<WinnerContainer>
				<motion.div
					initial={{ scale: 0, rotate: -15, opacity: 0 }}
					animate={{ scale: 1.1, rotate: 0, opacity: 1 }}
					transition={{
						type: "spring",
						stiffness: 200,
						damping: 12,
					}}
				>
					<WinnerTitle text="🎉 Game Over!" />
				</motion.div>

				<motion.div
					initial={{ y: 10, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					<WinnerMessage
						text={winner === "You" ? "You Won!! 🏆🎊" : `${winner} Wins! 🎯`}
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.6 }}
				>
					<WinnerAction>
						<WinnerButton onClick={onPlayAgain}>Play Again</WinnerButton>
						<WinnerButton onClick={onMenu}>Main Menu</WinnerButton>
					</WinnerAction>
				</motion.div>
			</WinnerContainer>
		</ModalOverlay>
	);
};

export default WinnerModal;
