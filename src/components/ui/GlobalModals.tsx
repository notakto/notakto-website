"use client";

import ProfileModal from "@/modals/ProfileModal";
import ShortcutModal from "@/modals/ShortcutModal";
import SoundConfigModal from "@/modals/SoundConfigModal";
import TutorialModal from "@/modals/TutorialModal";
import { useGlobalModal } from "@/services/globalModal";

export default function GlobalModals() {
	const { activeModal, closeModal } = useGlobalModal();

	return (
		<>
			<SoundConfigModal
				visible={activeModal === "soundConfig"}
				onClose={closeModal}
			/>
			<ShortcutModal
				visible={activeModal === "shortcut"}
				onClose={closeModal}
			/>
			<TutorialModal
				visible={activeModal === "tutorial"}
				onClose={closeModal}
			/>
			<ProfileModal visible={activeModal === "profile"} onClose={closeModal} />
		</>
	);
}
