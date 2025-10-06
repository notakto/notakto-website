"use client";
import { SoundConfigButton } from "@/components/ui/Buttons/SoundConfigButton";
import { SoundMuteButton } from "@/components/ui/Buttons/SoundMuteButton";
import SoundConfigContainer from "@/components/ui/Containers/SoundConfig/SoundConfigContainer";
import SoundConfigControls from "@/components/ui/Containers/SoundConfig/SoundConfigControls";
import SoundConfigSection from "@/components/ui/Containers/SoundConfig/SoundConfigSection";
import { SoundConfigSlider } from "@/components/ui/Inputs/SoundConfigSlider";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import SoundConfigLabel from "@/components/ui/Title/SoundConfigLabel";
import { useSound } from "@/services/store";

type SoundConfigModalProps = {
	visible: boolean;
	onClose: () => void;
};

import { useId } from "react";

export default function SoundConfigModal({
	visible,
	onClose,
}: SoundConfigModalProps) {
	const {
		bgMute,
		bgVolume,
		setBgMute,
		setBgVolume,
		sfxMute,
		sfxVolume,
		setSfxMute,
		setSfxVolume,
	} = useSound();

	const bgMusicSliderId = useId();
	const playerMoveSliderId = useId();

	const resetSounds = () => {
		setBgVolume(0.3);
		setSfxVolume(0.5);
		// setBgMute(true); // incase reset sound is supposed to make it mute also
		// setSfxMute(true);
	};

	if (!visible) return null;
	return (
		<ModalOverlay>
			<SoundConfigContainer>
				<SoundConfigSection>
					<SoundConfigLabel
						label="Background Music"
						htmlFor={bgMusicSliderId}
					/>
					<SoundConfigSlider
						id={bgMusicSliderId}
						value={Math.round(bgVolume * 100)}
						onChange={(e) => setBgVolume(Number(e.target.value) / 100)}
					/>
					<SoundMuteButton onClick={() => setBgMute(!bgMute)}>
						{bgMute ? "Unmute" : "Mute"}
					</SoundMuteButton>
					<SoundConfigLabel
						label="Player Move Sound"
						htmlFor={playerMoveSliderId}
					/>
					<SoundConfigSlider
						id={playerMoveSliderId}
						value={Math.round(sfxVolume * 100)}
						onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
					/>
					<SoundMuteButton onClick={() => setSfxMute(!sfxMute)}>
						{sfxMute ? "Unmute" : "Mute"}
					</SoundMuteButton>
				</SoundConfigSection>

				{/* Controls */}
				<SoundConfigControls>
					<SoundConfigButton onClick={resetSounds}>
						Reset Sounds
					</SoundConfigButton>
					<SoundConfigButton onClick={onClose}>Return</SoundConfigButton>
				</SoundConfigControls>
			</SoundConfigContainer>
		</ModalOverlay>
	);
}
