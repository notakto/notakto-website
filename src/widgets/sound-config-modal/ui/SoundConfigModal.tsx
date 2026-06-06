"use client";
import { useSound } from "@/features/app-state/model/stores";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import { SoundConfigButton } from "@/widgets/sound-config-button/ui/SoundConfigButton";
import SoundConfigContainer from "@/widgets/sound-config-container/ui/SoundConfigContainer";
import SoundConfigControls from "@/widgets/sound-config-controls/ui/SoundConfigControls";
import SoundConfigLabel from "@/widgets/sound-config-label/ui/SoundConfigLabel";
import SoundConfigSection from "@/widgets/sound-config-section/ui/SoundConfigSection";
import { SoundConfigSlider } from "@/widgets/sound-config-slider/ui/SoundConfigSlider";
import SoundConfigTitle from "@/widgets/sound-config-title/ui/SoundConfigTitle";
import { SoundMuteButton } from "@/widgets/sound-mute-button/ui/SoundMuteButton";

interface SoundConfigModalProps {
	visible: boolean;
	onClose?: () => void;
}

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
				<SoundConfigTitle text="Sound Configuration" />
				<SoundConfigSection>
					<SoundConfigLabel
						label="Background Music"
						htmlFor="bg-music-slider"
					/>
					<SoundConfigSlider
						id="bg-music-slider"
						value={Math.round(bgVolume * 100)}
						onChange={(e) => setBgVolume(Number(e.target.value) / 100)}
					/>
					<SoundMuteButton onClick={() => setBgMute(!bgMute)}>
						{bgMute ? "Unmute" : "Mute"}
					</SoundMuteButton>
				</SoundConfigSection>

				<SoundConfigSection>
					<SoundConfigLabel
						label="Player Move Sound"
						htmlFor="player-move-slider"
					/>
					<SoundConfigSlider
						id="player-move-slider"
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
