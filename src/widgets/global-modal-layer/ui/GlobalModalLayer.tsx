"use client";

import { useGlobalModal } from "@/features/manage-global-modal/model/globalModalStore";
import ProfileModal from "@/widgets/modals/ui/ProfileModal";
import ShortcutModal from "@/widgets/modals/ui/ShortcutModal";
import SoundConfigModal from "@/widgets/modals/ui/SoundConfigModal";
import TutorialModal from "@/widgets/modals/ui/TutorialModal";

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
