import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SoundStore {
	bgMute: boolean;
	bgVolume: number;
	sfxMute: boolean;
	sfxVolume: number;
	setBgMute: (mute: boolean) => void;
	setBgVolume: (vol: number) => void;
	setSfxMute: (mute: boolean) => void;
	setSfxVolume: (vol: number) => void;
}

export const useSound = create<SoundStore>()(
	persist(
		(set) => ({
			bgMute: true,
			bgVolume: 0.3,
			sfxMute: false,
			sfxVolume: 0.5,
			setBgMute: (mute) => set({ bgMute: mute }),
			setBgVolume: (vol) => set({ bgVolume: Math.max(0, Math.min(1, vol)) }),
			setSfxMute: (mute) => set({ sfxMute: mute }),
			setSfxVolume: (vol) => set({ sfxVolume: Math.max(0, Math.min(1, vol)) }),
		}),
		{ name: "sound-settings" },
	),
);
