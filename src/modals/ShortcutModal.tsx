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
		{ key: "C", action: "Open game configuration" },
		{ key: "M", action: "Go to main menu" },
		{ key: "S", action: "Adjust sound" },
		{ key: "Enter", action: "Return to game" },
	];

	return (
		<ModalOverlay>
			<ShortcutContainer>
				<ShortcutTitle text="Keyboard Shortcuts" />

				{/* Pending notice */}
				<div className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 p-3 rounded-lg text-md">
					⚠️ NOTE : These shortcuts are for reference only. Implementation is
					pending, so they won’t work right now.
				</div>

				<ShortcutList shortcuts={shortcuts} />

				<ShortcutButton onClick={onClose}>Return</ShortcutButton>
			</ShortcutContainer>
		</ModalOverlay>
	);
}
