"use client";

import { useGlobalModal } from "@/features/manage-global-modal/model/globalModalStore";
import { useSoundConfig } from "@/features/play-game-audio/model/useSoundConfig";
import ProfileModal from "@/widgets/profile-modal/ui/ProfileModal";
import ShortcutModal from "@/widgets/shortcut-modal/ui/ShortcutModal";
import SoundConfigModal from "@/widgets/sound-config-modal/ui/SoundConfigModal";
import TutorialModal from "@/widgets/tutorial-modal/ui/TutorialModal";

export default function GlobalModals() {
	const { activeModal, closeModal } = useGlobalModal();
	const soundConfig = useSoundConfig();

	return (
		<>
			<SoundConfigModal
				visible={activeModal === "soundConfig"}
				onClose={closeModal}
				{...soundConfig}
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
