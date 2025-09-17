'use client'

import { useRouter } from 'next/navigation';
import { signInWithGoogle, signOutUser } from '@/services/firebase';
// import { useUser, useTut } from '@/services/store';
import { useUser } from '@/services/store';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { MenuButton } from '@/components/ui/Buttons/MenuButton';
import MenuContainer from '@/components/ui/Containers/Menu/MenuContainer';
import MenuButtonContainer from '@/components/ui/Containers/Menu/MenuButtonContainer';
import { MenuTitle } from '@/components/ui/Title/MenuTitle';
import SoundConfigModal from '@/modals/SoundConfigModal';
import ShortcutModal from '@/modals/ShortcutModal';
import { useShortcut } from '@/components/hooks/useShortcut';
import { useState } from 'react';
import TutorialModal from '@/modals/TutorialModal';

const Menu = () => {
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  // const setShowTut = useTut((state) => state.setShowTut);

  const router = useRouter();
  const { canShowToast, triggerToastCooldown, resetCooldown } = useToastCooldown(4000);
  const [showSoundConfig, setShowSoundConfig] = useState<boolean>(false);
  const [showShortcutConfig, setshowShortcutConfig] = useState<boolean>(false);
  const [showTut, setShowTut] = useState<boolean>(false);

  useShortcut((e) => {
    const el = e.target as HTMLElement | null;
    const tag = el?.tagName?.toLowerCase();

    //  Guard: ignore when typing or using modifiers
    if (e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (tag === 'input' || tag === 'textarea' || el?.isContentEditable) {
      return;
    }

    const k = e.key.toLowerCase();

    if (e.key === 'Escape') {
      // Close modals in order of priority
      if (showSoundConfig) return setShowSoundConfig(false);
      if (showShortcutConfig) return setshowShortcutConfig(false);
      setShowTut(false);

    }

    if (k === "m") router.push("/");

    if (k === "s") setShowSoundConfig((prev) => !prev);

    if (k === "q") setshowShortcutConfig((prev) => !prev);

    if (k === "t") setShowTut((prev) => !prev);
  });


  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const startGame = (mode: string) => {
    if ((mode === 'liveMatch' || mode === 'vsComputer') && !user) {
      if (canShowToast()) {
        toast("Please sign in!", {
          autoClose: 10000,
          onClose: resetCooldown // reset cooldown immediately when closed
        });
        triggerToastCooldown();
      }
      return;
    }
    router.push(`/${mode}`);
  };

  return (
    <MenuContainer>
      <MenuTitle text='Notakto'></MenuTitle>
      <MenuButtonContainer>
        <MenuButton onClick={() => startGame('vsPlayer')}> Play vs Player </MenuButton>
        <MenuButton onClick={() => startGame('vsComputer')}> Play vs Computer </MenuButton>
        <MenuButton onClick={() => startGame('liveMatch')}> Live Match </MenuButton>
        <MenuButton onClick={() => setShowTut(true)}> Tutorial </MenuButton>
        <MenuButton onClick={(user) ? handleSignOut : handleSignIn}>{(user) ? "Sign Out" : "Sign in"}</MenuButton>
        <MenuButton onClick={() => setShowSoundConfig(!showSoundConfig)}>Adjust Sound</MenuButton>
        <MenuButton onClick={() => setshowShortcutConfig(!showShortcutConfig)}>Keyboard Shortcuts</MenuButton>
      </MenuButtonContainer >
      <SoundConfigModal visible={showSoundConfig} onClose={() => setShowSoundConfig(false)} />
      <ShortcutModal visible={showShortcutConfig} onClose={() => setshowShortcutConfig(false)} />
      <TutorialModal visible={showTut} onClose={() => setShowTut(false)} />
    </MenuContainer >
  );
};

export default Menu;
