'use client'
import { useState } from 'react';
import { BoardConfigModalProps } from '../services/types';
// Standardise components
import { BoardConfigButton } from '@/components/ui/Buttons/BoardConfigButton';
import { BoardActionButton } from '@/components/ui/Buttons/BoardActionButton';
import BoardConfigContainer from '@/components/ui/Containers/BoardConfig/BoardConfigContainer';
import BoardConfigTitle from '@/components/ui/Title/BoardConfigTitle';
import BoardConfigOptions from '@/components/ui/Containers/BoardConfig/BoardConfigOptions';
import ModalOverlay from '@/components/ui/overlay/ModalOverlay';
import BoardConfigAction from '@/components/ui/Containers/BoardConfig/BoardConfigAction';
const BoardConfigModal = ({
  visible,
  currentBoards,
  currentSize,
  onConfirm,
  onCancel
}: BoardConfigModalProps) => {
  const [selectedBoards, setSelectedBoards] = useState<any>(currentBoards);
  const [selectedSize, setSelectedSize] = useState<any>(currentSize);

  if (!visible) return null;

  return (
    <ModalOverlay>
      <BoardConfigContainer>
        <BoardConfigTitle text='Number of Boards' />
        <BoardConfigOptions>
          {[1, 2, 3, 4, 5].map(num => (
            <BoardConfigButton
              key={num}
              label={num}
              isActive={selectedBoards === num}
              onClick={() => setSelectedBoards(num)}
            />
          ))}
        </BoardConfigOptions>

        <BoardConfigTitle text='Board Size' />

        <BoardConfigOptions>
          {[2, 3, 4, 5].map(size => (
            <BoardConfigButton
              key={size}
              label={`${size}x${size}`}
              isActive={selectedSize === size}
              onClick={() => setSelectedSize(size)}
            />
          ))}
        </BoardConfigOptions>

        <BoardConfigAction>

          <BoardActionButton onClick={onCancel}>
            Cancel
          </BoardActionButton>

          <BoardActionButton onClick={() => onConfirm(selectedBoards, selectedSize)}>
            Apply
          </BoardActionButton>

        </BoardConfigAction>
      </BoardConfigContainer>
    </ModalOverlay>
  );
};

export default BoardConfigModal;

