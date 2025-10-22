"use client";

import { useEffect } from "react";
import {
	initBackgroundMusic,
	playBackgroundMusic,
	setBackgroundVolume,
	setMoveVolume,
	setWinVolume,
	stopBackgroundMusic,
} from "@/services/sounds";
import { useSound } from "@/services/store";

export default function MusicProvider() {
	const bgMute = useSound((state) => state.bgMute);
	const bgVolume = useSound((state) => state.bgVolume);
	const sfxVolume = useSound((state) => state.sfxVolume);
	const sfxMute = useSound((state) => state.sfxMute);

	useEffect(() => {
		initBackgroundMusic(); // prepare but don’t autoplay
		return () => stopBackgroundMusic();
	}, []);

	useEffect(() => {
		if (bgMute) {
			// mute is setting the volume down
			setBackgroundVolume(0);
		} else {
			playBackgroundMusic();
			setBackgroundVolume(bgVolume);
		}
	}, [bgMute, bgVolume]);

	useEffect(() => {
		const volume = sfxMute ? 0 : Math.max(0, Math.min(1, sfxVolume));
		setMoveVolume(volume);
		setWinVolume(volume);
	}, [sfxMute, sfxVolume]);

	return null;
}
