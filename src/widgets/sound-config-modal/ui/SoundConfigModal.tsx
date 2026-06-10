"use client";
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
	bgMute: boolean;
	bgVolume: number;
	sfxMute: boolean;
	sfxVolume: number;
	onBgMuteChange: (mute: boolean) => void;
	onBgVolumeChange: (volume: number) => void;
	onSfxMuteChange: (mute: boolean) => void;
	onSfxVolumeChange: (volume: number) => void;
	onResetSounds: () => void;
}

export default function SoundConfigModal({
	visible,
	onClose,
	bgMute,
	bgVolume,
	sfxMute,
	sfxVolume,
	onBgMuteChange,
	onBgVolumeChange,
	onSfxMuteChange,
	onSfxVolumeChange,
	onResetSounds,
}: SoundConfigModalProps) {
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
						onChange={(e) => onBgVolumeChange(Number(e.target.value) / 100)}
					/>
					<SoundMuteButton onClick={() => onBgMuteChange(!bgMute)}>
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
						onChange={(e) => onSfxVolumeChange(Number(e.target.value) / 100)}
					/>
					<SoundMuteButton onClick={() => onSfxMuteChange(!sfxMute)}>
						{sfxMute ? "Unmute" : "Mute"}
					</SoundMuteButton>
				</SoundConfigSection>

				<SoundConfigControls>
					<SoundConfigButton onClick={onResetSounds}>
						Reset Sounds
					</SoundConfigButton>
					<SoundConfigButton onClick={onClose}>Return</SoundConfigButton>
				</SoundConfigControls>
			</SoundConfigContainer>
		</ModalOverlay>
	);
}
