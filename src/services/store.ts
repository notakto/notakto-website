import { create } from "zustand";
import { User } from "firebase/auth";
import { persist } from "zustand/middleware";
import { ToastItem } from "./types";
import { Id, toast } from "react-toastify";
import { MAX_TOASTS } from "@/constants/toast";
type SoundStore = {
  bgMute: boolean;
  bgVolume: number;
  sfxMute: boolean;
  sfxVolume: number;
  setBgMute: (mute: boolean) => void;
  setBgVolume: (vol: number) => void;
  setSfxMute: (mute: boolean) => void;
  setSfxVolume: (vol: number) => void;
};
type userStore = {
  user: User | null;
  setUser: (newUser: any) => void;
};

type tutStore = {
  showTut: boolean;
  setShowTut: (newShowTut: boolean) => void;
};
type CoinStore = {
  coins: number;
  setCoins: (newCoins: number) => void;
  optimisticAddCoins: (amount: number) => void;
};
type XPStore = {
  XP: number;
  setXP: (newXP: number) => void;
  optimisticAddXP: (amount: number) => void;
};
type toastStore = {
  toasts: Map<string, string>;
  count: number;
  addToast: (toast: string) => void;
  removeToast: (toast: string) => void;
};

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
    { name: "sound-settings" }
  )
);

export const useUser = create<userStore>((set) => ({
  user: null,
  setUser: (newUser) => set({ user: newUser }),
}));

export const useTut = create<tutStore>((set) => ({
  showTut: false,
  setShowTut: (newShowTut) => set({ showTut: newShowTut }),
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
export type ToastStore = {
  toasts: ToastItem[];
  toastId: string;
  addToast: (content: string, toastId: string) => void;
  removeToast: (id: Id) => void;
};
export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  toastId: "",
  addToast: (content: string, toastId: string) => {
    const id = toast(content, {
      autoClose: 3000,
      toastId: toastId,
      onClose: () => get().removeToast(id),
    });
    let updated = [...get().toasts, { id, content }];
    if (updated.length > MAX_TOASTS) {
      const oldest = updated[0];
      toast.dismiss(oldest.id);
      updated = updated.slice(1);
    }
    set({ toasts: updated });
  },
  removeToast: (id: Id) => {
    set({
      toasts: get().toasts.filter((t) => t.id !== id),
    });
  },
}));
