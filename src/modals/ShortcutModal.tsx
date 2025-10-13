"use client";

import { ShortcutButton } from "@/components/ui/Buttons/ShortcutButton";
import ShortcutContainer from "@/components/ui/Containers/Shortcut/ShortcutContainer";
import ShortcutList from "@/components/ui/List/ShortcutList";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import ShortcutTitle from "@/components/ui/Title/ShortcutTitle";

type ShortcutModalProps = {
	visible: boolean;
	onClose: () => void;
};

export default function ShortcutModal({
	visible,
	onClose,
}: ShortcutModalProps) {
	if (!visible) return null;

	const shortcuts = [
		{ key: "Esc", action: "Close the modal / pause menu" },
		{ key: "R", action: "Reset the game" },
		{ key: "N", action: "Reset player names" },
		{ key: "M", action: "Go to main menu" },
		{ key: "S", action: "Adjust sound" },
		{ key: "C", action: "Open game configuration" },
		{ key: 'D', action: 'Open difficulty level' },
		{ key: 'Q', action: 'Open keyboard shortcuts' },
        { key: 'T', action: 'Open tutorial' },
		{ key: "Enter", action: "Return to game" },
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
