import { create } from "zustand";

interface CoinStore {
	coins: number;
	setCoins: (newCoins: number) => void;
	optimisticAddCoins: (amount: number) => void;
}

interface XPStore {
	XP: number;
	setXP: (newXP: number) => void;
	optimisticAddXP: (amount: number) => void;
}

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
