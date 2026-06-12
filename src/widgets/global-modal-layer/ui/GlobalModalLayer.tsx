"use client";

import { useGlobalModal } from "@/features/manage-global-modal/model/globalModalStore";
import BuyCoinsModal from "@/widgets/buy-coins-modal/ui/BuyCoinsModal";
import ProfileModal from "@/widgets/profile-modal/ui/ProfileModal";
import ShortcutModal from "@/widgets/shortcut-modal/ui/ShortcutModal";
import SoundConfigModal from "@/widgets/sound-config-modal/ui/SoundConfigModal";
import TutorialModal from "@/widgets/tutorial-modal/ui/TutorialModal";

export default function GlobalModals() {
	const { activeModal, closeModal } = useGlobalModal();

	return (
		<>
			<BuyCoinsModal
				visible={activeModal === "buyCoins"}
				onClose={closeModal}
			/>
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
