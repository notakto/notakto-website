"use client";

import { usePathname } from "next/navigation";
import { useId } from "react";
import { ShortcutButton } from "@/components/ui/Buttons/ShortcutButton";
import ShortcutContainer from "@/components/ui/Containers/Shortcut/ShortcutContainer";
import ShortcutList from "@/components/ui/List/ShortcutList";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import ShortcutTitle from "@/components/ui/Title/ShortcutTitle";
import { useShortcutContext } from "@/context/ShortcutContext";
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

	const { shortcutsEnabled, setShortcutsEnabled } = useShortcutContext();
	const inputId = useId();
	if (!visible) return null;

	const handleToggleChange = () => {
		setShortcutsEnabled((prevState) => !prevState);
	};

	return (
		<ModalOverlay>
			<ShortcutContainer>
				<ShortcutTitle text="Keyboard Shortcuts" />
				<ShortcutList shortcuts={shortcuts} />

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						margin: "20px 0",
						color: "white",
					}}>
					<label htmlFor="enable-shortcuts" style={{ cursor: "pointer" }}>
						Enable Shortcuts
					</label>
					<input
						id={inputId}
						type="checkbox"
						style={{ cursor: "pointer", width: "20px", height: "20px" }}
						checked={shortcutsEnabled}
						onChange={handleToggleChange}
					/>
				</div>
				<ShortcutButton onClick={onClose}>Return</ShortcutButton>
			</ShortcutContainer>
		</ModalOverlay>
	);
}