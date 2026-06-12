"use client";

import { useSound } from "@/features/play-game-audio/model/soundStore";

export function useSoundConfig() {
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
		setBgMute(true);
		setBgVolume(0.3);
		setSfxMute(false);
		setSfxVolume(0.5);
	};

	return {
		bgMute,
		bgVolume,
		sfxMute,
		sfxVolume,
		onBgMuteChange: setBgMute,
		onBgVolumeChange: setBgVolume,
		onSfxMuteChange: setSfxMute,
		onSfxVolumeChange: setSfxVolume,
		onResetSounds: resetSounds,
	};
}
