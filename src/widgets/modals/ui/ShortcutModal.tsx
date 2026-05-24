"use client";

import { usePathname } from "next/navigation";
import { pageShortcuts } from "@/entities/shortcut/model/pageShortcuts";
import ModalOverlay from "@/shared/ui/overlays/ModalOverlay";
import { ShortcutButton } from "@/widgets/modals/ui/buttons/ShortcutButton";
import ShortcutContainer from "@/widgets/modals/ui/containers/Shortcut/ShortcutContainer";
import ShortcutList from "@/widgets/modals/ui/list/ShortcutList";
import ShortcutTitle from "@/widgets/modals/ui/title/ShortcutTitle";
import type { ShortcutModalProps } from "@/widgets/ui/types";

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
