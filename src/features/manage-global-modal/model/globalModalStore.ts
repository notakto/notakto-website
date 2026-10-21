import { create } from "zustand";

export type GlobalModalType =
	| "buyCoins"
	| "soundConfig"
	| "shortcut"
	| "tutorial"
	| "profile"
	| "resetConfirmation"
	| "exitConfirmation"
	| "boardConfig"
	| "difficulty"
	| "names"
	| "winner"
	| "leaderboard"
	| null;

export type ModalAction = NonNullable<GlobalModalType>;

interface GlobalModalStore {
	activeModal: GlobalModalType;
	openModal: (modal: GlobalModalType) => void;
	closeModal: () => void;
}

export const useGlobalModal = create<GlobalModalStore>((set) => ({
	activeModal: null,
	openModal: (modal) => set({ activeModal: modal }),
	closeModal: () => set({ activeModal: null }),
}));
