'use client'
import { useState, useEffect } from 'react';
import { PlayerNamesModalProps } from '../services/types';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { TOAST_DURATION, TOAST_ID } from "../constants/toast";
import { PlayerInput } from '@/components/ui/Inputs/PlayerInput';

const PlayerNamesModal = ({ visible, onSubmit, initialNames = ['Player 1', 'Player 2'] }: PlayerNamesModalProps) => {
  const [player1, setPlayer1] = useState(initialNames[0] || 'Player 1');
  const [player2, setPlayer2] = useState(initialNames[1] || 'Player 2');

  const { canShowToast, triggerToastCooldown, resetCooldown } = useToastCooldown(TOAST_DURATION);

  useEffect(() => {
    setPlayer1(initialNames[0] || 'Player 1');
    setPlayer2(initialNames[1] || 'Player 2');
  }, [initialNames]);

  const handleSubmit = () => {
    if (!canShowToast()) return;

    if (player1.trim().toLowerCase() === player2.trim().toLowerCase()) {
      toast("Player 1 and Player 2 cannot have the same name.", {
        toastId:TOAST_ID,
        autoClose: TOAST_DURATION,
        onClose: resetCooldown // reset cooldown if closed early
      });
      
      return;
    }
    onSubmit(player1 || 'Player 1', player2 || 'Player 2');
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-black w-[80%] max-w-md p-6 text-center shadow-lg">
        <h2 className="text-red-500 text-3xl mb-6">Enter Player Names</h2>
        <div className='mb-6 gap-4 flex flex-col'>

          <PlayerInput
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            placeholder="Player 1 Name"
          />

          <PlayerInput
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Player 2 Name"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white text-3xl w-full py-3 hover:bg-blue-700"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default PlayerNamesModal;
