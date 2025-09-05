import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from 'firebase/auth';

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
};
type XPStore = {
  XP: number;
  setXP: (newXP: number) => void;
};

export const useSound = create<SoundStore>()(
  persist(
    (set) => ({
      bgMute: true, // start muted
      bgVolume: 0.3,
      sfxMute: false,
      sfxVolume: 0.5,
      setBgMute: (mute) => set({ bgMute: mute }),
      setBgVolume: (vol) =>
        set({ bgVolume: Math.max(0, Math.min(1, vol)) }),
      setSfxMute: (mute) => set({ sfxMute: mute }),
      setSfxVolume: (vol) =>
        set({ sfxVolume: Math.max(0, Math.min(1, vol)) }),
    }),
    { name: "sound-settings" }
  )
);
export const useCoins = create<CoinStore>()(
  persist(
    (set) => ({
      coins: 1000,
      setCoins: (newCoins: number) => set({ coins: newCoins }),
    }),
    {
      name: 'coins-storage', // key in localStorage
    }
  )
);

export const useXP = create<XPStore>()(
  persist(
    (set) => ({
      XP: 0,
      setXP: (newXP: number) => set({ XP: newXP }),
    }),
    {
      name: 'xp-storage', // key in localStorage
    }
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
