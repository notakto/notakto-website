'use client'
import { useEffect } from 'react';
import type { User } from 'firebase/auth';

// Components
import Menu from '@/app/Menu';
import TutorialModal from '@/modals/TutorialModal';

import { useUser, useMute, useTut, useCoins, useXP } from '@/services/store';
import { initBackgroundMusic, toggleBackgroundMusic, stopBackgroundMusic } from '@/services/sounds';

// Firebase module
import { onAuthStateChangedListener } from '@/services/firebase';

import { MenuLayout } from '@/components/ui/Containers/Menu/MenuLayout';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/services/firebase';

export default function Home() {
  const mute = useMute((state): boolean => state.mute)
  const user = useUser((state) => state.user);
  const setUser = useUser((state): (newUser: User | null) => void => state.setUser);
  const showTut = useTut((state): boolean => state.showTut);
  const setCoins = useCoins((state): (newCoins: number) => void => (state.setCoins));
  const setXP = useXP((state): (newXP: number) => void => (state.setXP));

  useCoins((state): number => state.coins);
  useXP((state): number => state.XP);

  // Init music
  useEffect((): () => void => {
    initBackgroundMusic(mute);
    return (): void => {
      stopBackgroundMusic();
    };
  }, []);

  // Toggle mute state
  useEffect((): void => {
    toggleBackgroundMusic(mute);
  }, [mute]);

  // Load user
  useEffect((): () => void => {
    const unsubscribe = onAuthStateChangedListener(async function (usr): Promise<void> { setUser(usr); });
    return (): void => unsubscribe();
  }, []);

  useEffect((): (() => void) | undefined => {
    if (!user) {
      console.log("No user, skipping Firestore listener setup.");
      return;
    }

    console.log("Setting up Firestore listener for user:", user.uid);
    const userRef = doc(firestore, "users", user.uid);
    console.log("User data:", userRef);
    const unsubscribe = onSnapshot(userRef, (docSnap): void => { //websocket that monitors db and pushes changes to client
      console.log("Received user document snapshot:", docSnap);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("User document data:", data);
        setCoins(data.coins ?? 0);
        setXP(data.XP ?? 0);
      }
    });

    return (): void => {
      unsubscribe();
      console.log("Unsubscribed from Firestore listener for user:", user.uid);
    }
  }, [user]);
  
  return (
    <MenuLayout>
      <Menu />
      {showTut && <TutorialModal />}
    </MenuLayout>
  );
}