'use client';

import { useEffect } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;
type ShortcutMap = Record<string, ShortcutHandler>;

export function useShortcut(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName?.toLowerCase();

      // ignore if composing, holding modifiers, or typing in an input
      if (e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      if (tag === 'input' || tag === 'textarea' || el?.isContentEditable) return;

      const key = e.key.toLowerCase();
      if (shortcuts[key]) {
        e.preventDefault(); // optional
        shortcuts[key](e);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
