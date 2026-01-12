"use client";

import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ShortcutButton } from "@/components/ui/Buttons/ShortcutButton";
import ShortcutContainer from "@/components/ui/Containers/Shortcut/ShortcutContainer";
import ShortcutList from "@/components/ui/List/ShortcutList";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import ShortcutTitle from "@/components/ui/Title/ShortcutTitle";
import { pageShortcuts } from "@/services/pageShortcut";
import type { ShortcutModalProps } from "@/services/types";

export default function ShortcutModal({
	visible,
	onClose,
}: ShortcutModalProps) {
	const pathname = usePathname();
	const t = useTranslations("Shortcuts");
	const rawShortcuts = pageShortcuts[pathname] || [];
	const shortcuts = rawShortcuts.map((s) => ({
		...s,
		action: t(s.action),
	}));

	if (!visible) return null;

	return (
		<ModalOverlay>
			<ShortcutContainer>
				<ShortcutTitle text={t("title")} />

				<ShortcutList shortcuts={shortcuts} />

				<ShortcutButton onClick={onClose}>{t("return")}</ShortcutButton>
			</ShortcutContainer>
		</ModalOverlay>
	);
}
