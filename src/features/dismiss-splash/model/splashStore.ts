import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SplashStore {
	hasSeenSplash: boolean;
	setHasSeenSplash: (v: boolean) => void;
}

export const useSplash = create<SplashStore>()(
	persist(
		(set) => ({
			hasSeenSplash: false,
			setHasSeenSplash: (v) => set({ hasSeenSplash: v }),
		}),
		{ name: "splash-settings" },
	),
);
