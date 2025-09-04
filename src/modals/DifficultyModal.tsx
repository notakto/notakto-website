import { DifficultyLevel, DifficultyModalProps } from "../services/types";
import { DifficultyActionButton } from "@/components/ui/Buttons/DifficultyActionButton";

const DifficultyModal = ({ visible, onSelect, onClose }: DifficultyModalProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black w-full max-w-md p-6">
        <h2 className="text-white text-4xl text-center mb-6">Select Difficulty</h2>

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
      </div>
    </div>
  );
};

export default DifficultyModal;
