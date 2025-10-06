'use client'

import { ShortcutButton } from "@/components/ui/Buttons/ShortcutButton";
import ShortcutContainer from "@/components/ui/Containers/Shortcut/ShortcutContainer";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import ShortcutTitle from "@/components/ui/Title/ShortcutTitle";
import ShortcutList from "@/components/ui/List/ShortcutList";

type ShortcutModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function ShortcutModal({ visible, onClose }: ShortcutModalProps) {
    if (!visible) return null;

    const shortcuts = [
        { key: 'Esc', action: 'Close the modal / pause menu' },
        { key: 'R', action: 'Reset the game' },
        { key: 'N', action: 'Reset player names' },
        { key: 'C', action: 'Open game configuration' },
        { key: 'M', action: 'Go to main menu' },
        { key: 'D', action: 'Open difficulty level' },
        { key: 'S', action: 'Adjust sound' },
        { key: 'Q', action: 'Open keyboard shortcuts' },
        { key: 'T', action: 'Open tutorial' },
    ];

    return (
        <ModalOverlay>
            <ShortcutContainer>
                <ShortcutTitle text="Keyboard Shortcuts" />
                
                <ShortcutList shortcuts={shortcuts} />

                <ShortcutButton onClick={onClose}>Return</ShortcutButton>
            </ShortcutContainer>
        </ModalOverlay>
    );
}
