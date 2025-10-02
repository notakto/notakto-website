import { useRouter } from "next/navigation";
import { WinnerModalProps } from "@/services/types";
import { WinnerButton } from "@/components/ui/Buttons/WinnerButton";

const WinnerModal = ({ visible, winner, onPlayAgain }: WinnerModalProps) => {
  if (!visible) return null;
  const router = useRouter();
  const exitToMenu = () => {
    router.push('/');
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-black text-center rounded-xl p-6 w-[80%] max-w-md shadow-2xl">
        <h1 className="text-5xl text-red-600 mb-3">Game Over!</h1>
        <p className="text-2xl text-red-500 mb-6">
          {winner === 'You' ? 'You won!' : `${winner} wins`}
        </p>

        <div className="flex justify-between gap-4 w-full">
          <WinnerButton onClick={onPlayAgain}>
            Play Again
          </WinnerButton>
          <WinnerButton onClick={exitToMenu}>
            Main Menu
          </WinnerButton>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;