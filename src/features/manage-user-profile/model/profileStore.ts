import { create } from "zustand";

interface ProfileStore {
	name: string;
	email: string;
	pic: string;
	setName: (name: string) => void;
	setEmail: (email: string) => void;
	setPic: (pic: string) => void;
}

export const useProfile = create<ProfileStore>((set) => ({
	name: "player",
	email: "empty@empty.empty",
	pic: "empty.empty",
	setName: (name) => set({ name }),
	setEmail: (email) => set({ email }),
	setPic: (pic) => set({ pic }),
}));
