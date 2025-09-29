import { DifficultyLevel, DifficultyModalProps } from "../services/types";
import { DifficultyActionButton } from "@/components/ui/Buttons/DifficultyActionButton";
import DifficultyContainer from "@/components/ui/Containers/Difficulty/DifficultyContainer"
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import DifficultyTitle from '@/components/ui/Title/DifficultyTitle'

const DifficultyModal = ({ visible, onSelect, onClose }: DifficultyModalProps) => {
  if (!visible) return null;

  return (
    <ModalOverlay>
      <DifficultyContainer>
        <DifficultyTitle text="Select Difficulty"></DifficultyTitle>

        {[1, 2, 3, 4, 5].map(level => (
          <DifficultyActionButton
            variant="level"
            key={level}
            onClick={() => onSelect(level as DifficultyLevel)}
          >
            Level {level}
          </DifficultyActionButton>
        ))}

        <DifficultyActionButton
          variant="cancel"
          onClick={onClose}
        >
          Cancel
        </DifficultyActionButton>
      </DifficultyContainer >
    </ModalOverlay>
  );
};

export default DifficultyModal;
