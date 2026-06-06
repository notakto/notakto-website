"use client";
import { useSound } from "@/features/app-state/model/stores";
import { SoundConfigButton } from "@/widgets/modals/ui/buttons/SoundConfigButton";
import { SoundMuteButton } from "@/widgets/modals/ui/buttons/SoundMuteButton";
import SoundConfigContainer from "@/widgets/modals/ui/containers/SoundConfig/SoundConfigContainer";
import SoundConfigControls from "@/widgets/modals/ui/containers/SoundConfig/SoundConfigControls";
import SoundConfigSection from "@/widgets/modals/ui/containers/SoundConfig/SoundConfigSection";
import { SoundConfigSlider } from "@/widgets/modals/ui/inputs/SoundConfigSlider";
import ModalOverlay from "@/widgets/modals/ui/ModalOverlay";
import SoundConfigLabel from "@/widgets/modals/ui/title/SoundConfigLabel";
import SoundConfigTitle from "@/widgets/modals/ui/title/SoundConfigTitle";
import type { SoundConfigModalProps } from "@/widgets/types";

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
