'use client'
import Menu from '@/app/Menu';
import TutorialModal from '@/modals/TutorialModal';

import { useTut, useMute } from '@/services/store';
import { initBackgroundMusic, toggleBackgroundMusic, stopBackgroundMusic } from '@/services/sounds';

import { MenuLayout } from '@/components/ui/Containers/Menu/MenuLayout';
import { useEffect } from 'react';


export default function Home() {
  const showTut = useTut((state): boolean => state.showTut);
  const mute = useMute((state) => state.mute);

  // Init music
  useEffect(() => {
    initBackgroundMusic(mute);
    return () => {
      stopBackgroundMusic();
    };
  }, []);

  // Toggle mute state
  useEffect(() => {
    toggleBackgroundMusic(mute);
  }, [mute]);
  return (
    <MenuLayout>
      <Menu />
      {showTut && <TutorialModal />}
    </MenuLayout>
  );
}