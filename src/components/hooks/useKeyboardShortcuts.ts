import { useEffect, useCallback } from 'react';

export type KeyboardShortcut = {
  key: string;
  action: () => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean;
};

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const pressedKey = event.key;
    
    for (const shortcut of shortcuts) {
      if (shortcut.enabled !== false && (shortcut.key.toLowerCase() === pressedKey.toLowerCase())) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        if (shortcut.stopPropagation !== false) {
          event.stopPropagation();
        }
        shortcut.action();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export const useGameShortcuts = (actions: {
  onEscape?: () => void;
  onReset?: () => void;
  onMainMenu?: () => void;
  onSoundConfig?: () => void;
  onGameConfig?: () => void;
  onResetNames?: () => void;
  onReturnToGame?: () => void;
}) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Escape',
      action: () => actions.onEscape?.(),
      enabled: !!actions.onEscape,
    },
    {
      key: 'r',
      action: () => actions.onReset?.(),
      enabled: !!actions.onReset,
    },
    {
      key: 'R',
      action: () => actions.onReset?.(),
      enabled: !!actions.onReset,
    },
    {
      key: 'm',
      action: () => actions.onMainMenu?.(),
      enabled: !!actions.onMainMenu,
    },
    {
      key: 'M',
      action: () => actions.onMainMenu?.(),
      enabled: !!actions.onMainMenu,
    },
    {
      key: 's',
      action: () => actions.onSoundConfig?.(),
      enabled: !!actions.onSoundConfig,
    },
    {
      key: 'S',
      action: () => actions.onSoundConfig?.(),
      enabled: !!actions.onSoundConfig,
    },
    {
      key: 'c',
      action: () => actions.onGameConfig?.(),
      enabled: !!actions.onGameConfig,
    },
    {
      key: 'C',
      action: () => actions.onGameConfig?.(),
      enabled: !!actions.onGameConfig,
    },
    {
      key: 'n',
      action: () => actions.onResetNames?.(),
      enabled: !!actions.onResetNames,
    },
    {
      key: 'N',
      action: () => actions.onResetNames?.(),
      enabled: !!actions.onResetNames,
    },
    {
      key: 'Enter',
      action: () => actions.onReturnToGame?.(),
      enabled: !!actions.onReturnToGame,
    },
  ];

  useKeyboardShortcuts(shortcuts);
};