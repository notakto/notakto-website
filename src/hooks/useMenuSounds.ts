import { useCallback } from 'react';

// Sound effects mapping - integrates with existing sound system
export const MENU_SOUNDS = {
  HOVER: 'hover',
  CLICK: 'click', 
  SELECT: 'select',
  BACK: 'back'
} as const;

type SoundType = typeof MENU_SOUNDS[keyof typeof MENU_SOUNDS];

export function useMenuSounds() {
  const playSound = useCallback((soundType: SoundType) => {
    // This would integrate with the existing sound system
    // For now, we provide haptic feedback where available
    if (typeof window !== 'undefined') {
      try {
        // Haptic feedback for mobile devices
        if (window.navigator.vibrate) {
          const vibrationPattern = {
            [MENU_SOUNDS.HOVER]: 10,
            [MENU_SOUNDS.CLICK]: 25,
            [MENU_SOUNDS.SELECT]: [10, 50, 10],
            [MENU_SOUNDS.BACK]: 15
          };
          
          window.navigator.vibrate(vibrationPattern[soundType] || 10);
        }

        // In the future, this would call the existing sound service
        // Example: soundService.play(soundType);
        
      } catch (error) {
        // Silently fail if vibration is not supported
        console.debug('Haptic feedback not available:', error);
      }
    }
  }, []);

  return { playSound };
}

// Hook for managing menu interaction states
export function useMenuInteraction() {
  const { playSound } = useMenuSounds();

  const handleButtonHover = useCallback(() => {
    playSound(MENU_SOUNDS.HOVER);
  }, [playSound]);

  const handleButtonClick = useCallback(() => {
    playSound(MENU_SOUNDS.CLICK);
  }, [playSound]);

  const handleMenuSelect = useCallback(() => {
    playSound(MENU_SOUNDS.SELECT);
  }, [playSound]);

  return {
    handleButtonHover,
    handleButtonClick,
    handleMenuSelect,
    playSound
  };
}