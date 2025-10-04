import { useRouter } from "next/navigation";
import { WinnerModalProps } from "@/services/types";
import { WinnerButton } from "@/components/ui/Buttons/WinnerButton";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import WinnerContainer from "@/components/ui/Containers/WinnerModal/WinnerContainer";
import WinnerAction from "@/components/ui/Containers/WinnerModal/WinnerAction";
import WinnerTitle from "@/components/ui/Title/WinnerTitle";
import WinnerMessage from "@/components/ui/Title/WinnerMessage";

const WinnerModal = ({ visible, winner, onPlayAgain }: WinnerModalProps) => {
  if (!visible) return null;
  const router = useRouter();
  const exitToMenu = () => {
    router.push('/');
  }
  return (
    <ModalOverlay>
      <WinnerContainer>
        <WinnerTitle text="Game Over!" />
        <WinnerMessage text={winner === 'You' ? 'You won!' : `${winner} wins`} />

        <WinnerAction>
          <WinnerButton onClick={onPlayAgain}>Play Again</WinnerButton>
          <WinnerButton onClick={exitToMenu}>Main Menu</WinnerButton>
        </WinnerAction>

      </WinnerContainer>
    </ModalOverlay>
  );
};

export default WinnerModal;