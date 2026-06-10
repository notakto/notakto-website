import type { User } from "firebase/auth";
import { create } from "zustand";

export interface UserStore {
	user: User | null;
	authReady: boolean;
	setUser: (newUser: User | null) => void;
	setAuthReady: (v: boolean) => void;
}

export const useUser = create<UserStore>((set) => ({
	user: null,
	authReady: false,
	setUser: (newUser) => set({ user: newUser }),
	setAuthReady: (v: boolean) => set({ authReady: v }),
}));
