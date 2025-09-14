# Keyboard Shortcuts Documentation

This document describes the keyboard shortcuts that have been implemented for the Notakto website to enhance user experience and provide quick navigation.

## Overview

The keyboard shortcuts system provides users with quick access to common game actions without having to use the mouse. The implementation is context-aware, meaning different shortcuts are available depending on the current page and state of the application.

## Implementation Details

### Core Components

1. **useKeyboardShortcuts Hook** (`src/components/hooks/useKeyboardShortcuts.ts`)
   - Generic hook for handling keyboard events
   - Provides safety checks to prevent shortcuts from interfering with form inputs
   - Supports conditional enabling/disabling of shortcuts

2. **useGameShortcuts Hook** (`src/components/hooks/useKeyboardShortcuts.ts`)
   - Specialized hook for common game-related shortcuts
   - Used across all game pages (vsPlayer, vsComputer, liveMatch)

### Implemented Shortcuts

#### Universal Game Shortcuts (Available in all game modes)

| Key | Action | Context |
|-----|--------|---------|
| `Esc` | Close modal / Toggle settings menu | All game pages |
| `R` | Reset the game | Game pages (when not in modal) |
| `M` | Go to main menu | All game pages |
| `S` | Adjust sound settings | Game pages (when not in modal) |
| `C` | Open game configuration | Game pages (when not in modal) |
| `Enter` | Return to game | When settings menu is open |

#### Mode-Specific Shortcuts

**vs Player Mode:**
| Key | Action |
|-----|--------|
| `N` | Reset player names |

**Main Menu:**
| Key | Action |
|-----|--------|
| `1` | Start vs Player game |
| `2` | Start vs Computer game |
| `3` | Start Live Match game |
| `T` | Open tutorial |
| `K` | Show keyboard shortcuts modal |

**Live Match Mode:**
| Key | Action |
|-----|--------|
| `Esc` | Leave game / Go to main menu |

### Safety Features

1. **Input Field Protection**: Shortcuts are disabled when typing in input fields, textareas, or contentEditable elements
2. **Modal State Awareness**: Shortcuts respect the current modal state and only trigger appropriate actions
3. **Loading State Protection**: Actions that might be processing (like API calls) are protected from duplicate triggers
4. **Conditional Enabling**: Shortcuts can be dynamically enabled/disabled based on application state

### Usage Examples

```typescript
// Using the generic keyboard shortcuts hook
import { useKeyboardShortcuts } from '@/components/hooks/useKeyboardShortcuts';

const MyComponent = () => {
  useKeyboardShortcuts([
    {
      key: 'Enter',
      action: () => handleSubmit(),
      enabled: !isSubmitting,
    }
  ]);
  // ...
};

// Using the game shortcuts hook
import { useGameShortcuts } from '@/components/hooks/useKeyboardShortcuts';

const GameComponent = () => {
  useGameShortcuts({
    onEscape: () => closeModal(),
    onReset: () => resetGame(),
    onMainMenu: () => navigateHome(),
  });
  // ...
};
```

## Testing

The keyboard shortcuts have been tested across all game modes:

1. ✅ Main menu navigation (1, 2, 3 keys for game modes)
2. ✅ Modal closing with Escape key
3. ✅ Game reset functionality (R key)
4. ✅ Main menu navigation (M key)
5. ✅ Sound settings (S key)
6. ✅ Game configuration (C key)
7. ✅ Input field protection (shortcuts disabled when typing)
8. ✅ Modal state awareness (shortcuts work contextually)

## User Experience Improvements

1. **Accessibility**: Keyboard shortcuts make the game more accessible to users who prefer keyboard navigation
2. **Speed**: Power users can navigate much faster using keyboard shortcuts
3. **Consistency**: The same shortcuts work across different game modes where applicable
4. **Discoverability**: The keyboard shortcuts modal (accessible via 'K' in main menu) lists all available shortcuts
5. **Visual Feedback**: The shortcuts modal now shows a green success message indicating that shortcuts are active

## Future Enhancements

Potential improvements for the keyboard shortcuts system:

1. **Customizable Shortcuts**: Allow users to customize their preferred key bindings
2. **Additional Game Actions**: Add shortcuts for specific game moves or strategies
3. **Global Shortcuts**: Implement browser-level shortcuts that work even when the page doesn't have focus
4. **Shortcut Hints**: Show hint overlays on buttons indicating their keyboard shortcuts
5. **Accessibility Compliance**: Ensure full compliance with WCAG accessibility guidelines

## File Changes Made

1. `src/components/hooks/useKeyboardShortcuts.ts` - New file with keyboard shortcut hooks
2. `src/app/Menu.tsx` - Added main menu keyboard shortcuts
3. `src/app/vsPlayer/page.tsx` - Added game-specific keyboard shortcuts
4. `src/app/vsComputer/page.tsx` - Added game-specific keyboard shortcuts
5. `src/app/liveMatch/page.tsx` - Added live match keyboard shortcuts
6. `src/modals/ShortcutModal.tsx` - Updated to reflect implemented shortcuts and removed pending notice

## Conclusion

The keyboard shortcuts implementation successfully addresses issue #148 by providing comprehensive keyboard navigation throughout the Notakto website. The system is robust, context-aware, and enhances the overall user experience while maintaining the existing functionality of the application.