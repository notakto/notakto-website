'use client'
import { useEffect, useRef } from 'react';
import Menu from '@/app/Menu';
import { useCoins, useUser, useXP, useMute } from '@/services/store';
import { initBackgroundMusic, toggleBackgroundMusic, stopBackgroundMusic } from '@/services/sounds';
import { onAuthStateChangedListener, saveEconomyToFirestore, loadEconomyFromFirestore } from '@/services/firebase';

export default function Home() {
  const mute = useMute((state) => state.mute);
  const coins = useCoins((state) => state.coins);
  const setCoins = useCoins((state) => state.setCoins);
  const XP = useXP((state) => state.XP);
  const setXP = useXP((state) => state.setXP);
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    initBackgroundMusic(mute);
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  useEffect(() => {
    toggleBackgroundMusic(mute);
  }, [mute]);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (usr) => {
      setUser(usr);
      if (usr) {
        const cloudData = await loadEconomyFromFirestore(usr.uid) as { coins?: number; XP?: number };
        if (cloudData) {
          setCoins(cloudData.coins ?? 1000);
          setXP(cloudData.XP ?? 0);
        } else {
          setCoins(1000);
          setXP(0);
        }
        dataLoadedRef.current = true;
      } else {
        dataLoadedRef.current = false;
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && dataLoadedRef.current) {
      saveEconomyToFirestore(user.uid, coins, XP);
    }
  }, [coins, XP, user]);

  return (
    // This is the only line you need to change
    <div className="home-container">
      <Menu />
    </div>
  );
}