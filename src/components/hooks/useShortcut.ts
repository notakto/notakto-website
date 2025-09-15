'use client';

import { useEffect } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;

export function useShortcut(handler: ShortcutHandler) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => handler(e);
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handler]);
}
