import { create } from "zustand";

interface SidebarStore {
	isCollapsed: boolean;
	toggle: () => void;
	setCollapsed: (v: boolean) => void;
}

export const useSidebar = create<SidebarStore>()((set) => ({
	isCollapsed: false,
	toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
	setCollapsed: (v) => set({ isCollapsed: v }),
}));
