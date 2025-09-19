"use client";
import { useRouter } from "next/navigation";
import { WinnerModalProps } from "@/services/types";
import { WinnerButton } from "@/components/ui/Buttons/WinnerButton";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const WinnerModal = ({ visible, winner, onPlayAgain, onMenu }: WinnerModalProps) => {
  if (!visible) return null;
  const { width, height } = useWindowSize();
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />
      <div className="bg-black text-center rounded-xl p-6 w-[80%] max-w-md shadow-2xl relative z-10">
        <h1 className="text-5xl text-red-600 mb-3">Game Over!</h1>
        <p className="text-2xl text-red-500 mb-2">
          {winner ? `${winner} wins!` : 'You won!'}
        </p>
        <p className="text-3xl text-green-400 font-bold mb-4 animate-bounce">Congratulations!</p>
        <div className="flex justify-between gap-4 w-full">
          <WinnerButton onClick={onPlayAgain}>
            Play Again
          </WinnerButton>
          <WinnerButton onClick={onMenu}>
            Main Menu
          </WinnerButton>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;