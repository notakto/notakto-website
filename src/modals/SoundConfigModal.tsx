"use client";
import { useTranslations } from "next-intl";
import { SoundConfigButton } from "@/components/ui/Buttons/SoundConfigButton";
import { SoundMuteButton } from "@/components/ui/Buttons/SoundMuteButton";
import SoundConfigContainer from "@/components/ui/Containers/SoundConfig/SoundConfigContainer";
import SoundConfigControls from "@/components/ui/Containers/SoundConfig/SoundConfigControls";
import SoundConfigSection from "@/components/ui/Containers/SoundConfig/SoundConfigSection";
import { SoundConfigSlider } from "@/components/ui/Inputs/SoundConfigSlider";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import SoundConfigLabel from "@/components/ui/Title/SoundConfigLabel";
import SoundConfigTitle from "@/components/ui/Title/SoundConfigTitle";
import { useSound } from "@/services/store";
import type { SoundConfigModalProps } from "@/services/types";

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
	const t = useTranslations("SoundConfig");

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
				<SoundConfigTitle text={t("title")} />
				<SoundConfigSection>
					<SoundConfigLabel
						label={t("background_music")}
						htmlFor="bg-music-slider"
					/>
					<SoundConfigSlider
						id="bg-music-slider"
						value={Math.round(bgVolume * 100)}
						onChange={(e) => setBgVolume(Number(e.target.value) / 100)}
					/>
					<SoundMuteButton onClick={() => setBgMute(!bgMute)}>
						{bgMute ? t("unmute") : t("mute")}
					</SoundMuteButton>
				</SoundConfigSection>

				<SoundConfigSection>
					<SoundConfigLabel
						label={t("player_move_sound")}
						htmlFor="player-move-slider"
					/>
					<SoundConfigSlider
						id="player-move-slider"
						value={Math.round(sfxVolume * 100)}
						onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
					/>
					<SoundMuteButton onClick={() => setSfxMute(!sfxMute)}>
						{sfxMute ? t("unmute") : t("mute")}
					</SoundMuteButton>
				</SoundConfigSection>

				{/* Controls */}
				<SoundConfigControls>
					<SoundConfigButton onClick={resetSounds}>
						{t("reset_sounds")}
					</SoundConfigButton>
					<SoundConfigButton onClick={onClose}>{t("return")}</SoundConfigButton>
				</SoundConfigControls>
			</SoundConfigContainer>
		</ModalOverlay>
	);
}
