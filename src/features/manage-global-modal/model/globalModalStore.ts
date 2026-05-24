import { create } from "zustand";

type GlobalModalType =
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
	| null;

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
