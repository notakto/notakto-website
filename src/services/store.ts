import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
	CoinStore,
	ProfileStore,
	SoundStore,
	UserStore,
	XPStore,
} from "@/services/types";

export const useSound = create<SoundStore>()(
	persist(
		(set) => ({
			bgMute: true, // start muted
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

export const useUser = create<UserStore>((set) => ({
	user: null,
	setUser: (newUser) => set({ user: newUser }),
}));

export const useCoins = create<CoinStore>((set, get) => ({
	coins: 0,
	setCoins: (newCoins: number) => set({ coins: newCoins }),
	optimisticAddCoins: (amount: number) => set({ coins: get().coins + amount }),
}));
export const useXP = create<XPStore>((set, get) => ({
	XP: 0,
	setXP: (newXP: number) => set({ XP: newXP }),
	optimisticAddXP: (amount: number) => set({ XP: get().XP + amount }),
}));

export const useProfile = create<ProfileStore>()(
	persist(
		(set) => ({
			name: "player",
			email: "empty@empty.empty",
			pic: "empty.empty",
			setName: (name) => set({ name }),
			setEmail: (email) => set({ email }),
			setPic: (pic) => set({ pic }),
		}),
		{ name: "profile-settings" },
	),
);
