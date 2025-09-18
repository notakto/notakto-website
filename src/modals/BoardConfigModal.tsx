'use client'
import { useState } from 'react';
import { BoardConfigModalProps } from '../services/types';
// Standardise components
import { BoardConfigButton } from '@/components/ui/Buttons/BoardConfigButton';
import { BoardActionButton } from '@/components/ui/Buttons/BoardActionButton';

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
    <dialog open className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <section className="bg-black p-6 w-[90%] max-w-xl text-center space-y-6" role="dialog" aria-modal="true">
        
        <header>
          <h2 className="text-red-600 text-[35px]">Number of Boards</h2>
        </header>
        
        <nav aria-label="Select number of boards">
          <ul className="flex flex-wrap gap-2 justify-center">
            {[1, 2, 3, 4, 5].map(num => (
              <li key={num}>
                <BoardConfigButton
                  label={num}
                  isActive={selectedBoards === num}
                  onClick={() => setSelectedBoards(num)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <header>
          <h2 className="text-red-600 text-[35px]">Board Size</h2>
        </header>

        <nav aria-label="Select board size">
          <ul className="flex flex-wrap gap-2 justify-center">
            {[2, 3, 4, 5].map(size => (
              <li key={size}>
                <BoardConfigButton
                  label={`${size}x${size}`}
                  isActive={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                />
              </li>
            ))}
          </ul>
        </nav>

        <footer className="flex gap-4 pt-2 justify-center">
          <BoardActionButton onClick={onCancel}>
            Cancel
          </BoardActionButton>

          <BoardActionButton onClick={() => onConfirm(selectedBoards, selectedSize)}>
            Apply
          </BoardActionButton>
        </footer>
      </section>
    </dialog>
  );
};

export default BoardConfigModal;