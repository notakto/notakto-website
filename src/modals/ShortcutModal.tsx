"use client";

import { usePathname } from "next/navigation";
import { ShortcutButton } from "@/components/ui/Buttons/ShortcutButton";
import ShortcutContainer from "@/components/ui/Containers/Shortcut/ShortcutContainer";
import ShortcutList from "@/components/ui/List/ShortcutList";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import ShortcutTitle from "@/components/ui/Title/ShortcutTitle";
import { pageShortcuts } from "@/services/pageShortcut";

type ShortcutModalProps = {
	visible: boolean;
	onClose: () => void;
};

export default function ShortcutModal({
	visible,
	onClose,
}: ShortcutModalProps) {
	const pathname = usePathname();
	const shortcuts = pageShortcuts[pathname] || [];

	if (!visible) return null;

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
