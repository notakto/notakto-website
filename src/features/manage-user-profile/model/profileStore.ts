import { create } from "zustand";

interface ProfileStore {
	username: string;
	name: string;
	email: string;
	pic: string;
	setUsername: (username: string) => void;
	setName: (name: string) => void;
	setEmail: (email: string) => void;
	setPic: (pic: string) => void;
}

export const useProfile = create<ProfileStore>((set) => ({
	username: "player",
	name: "player",
	email: "empty@empty.empty",
	pic: "empty.empty",
	setUsername: (username) => set({ username }),
	setName: (name) => set({ name }),
	setEmail: (email) => set({ email }),
	setPic: (pic) => set({ pic }),
}));
