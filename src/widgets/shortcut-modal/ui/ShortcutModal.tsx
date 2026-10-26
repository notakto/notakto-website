"use client";

import { usePathname } from "next/navigation";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import { ShortcutButton } from "@/widgets/shortcut-button/ui/ShortcutButton";
import ShortcutContainer from "@/widgets/shortcut-container/ui/ShortcutContainer";
import ShortcutList from "@/widgets/shortcut-list/ui/ShortcutList";
import { pageShortcuts } from "@/widgets/shortcut-modal/constants";
import ShortcutTitle from "@/widgets/shortcut-title/ui/ShortcutTitle";
import ShortcutToggle from "@/widgets/shortcut-toggle/ui/ShortcutToggle";

interface ShortcutModalProps {
	visible: boolean;
	onClose?: () => void;
}

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
				<div className="flex items-center justify-between mb-2">
					<ShortcutTitle text="Keyboard Shortcuts" />
					<ShortcutToggle />
				</div>

				<ShortcutList shortcuts={shortcuts} />

				<ShortcutButton onClick={onClose}>Return</ShortcutButton>
			</ShortcutContainer>
		</ModalOverlay>
	);
}
