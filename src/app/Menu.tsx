'use client'

import { useRouter } from 'next/navigation';
import { signInWithGoogle, signOutUser } from '@/services/firebase';
import { useUser, useTut } from '@/services/store';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { TOAST_DURATION,TOAST_IDS } from "@/constants/toast";
import { MenuButton } from '@/components/ui/Buttons/MenuButton';
import MenuContainer from '@/components/ui/Containers/Menu/MenuContainer';
import MenuButtonContainer from '@/components/ui/Containers/Menu/MenuButtonContainer';
import { MenuTitle } from '@/components/ui/Title/MenuTitle';
import SoundConfigModal from '@/modals/SoundConfigModal';
import ShortcutModal from '@/modals/ShortcutModal';
import { useState } from 'react';

const Menu = () => {
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const setShowTut = useTut((state) => state.setShowTut);

  const router = useRouter();
  const { canShowToast, triggerToastCooldown, resetCooldown } = useToastCooldown(TOAST_DURATION);
  const [showSoundConfig, setShowSoundConfig] = useState<boolean>(false);
  const [showShortcutConfig, setshowShortcutConfig] = useState<boolean>(false);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.dismiss(TOAST_IDS.User.SignInError); 
      resetCooldown();
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
          toastId: TOAST_IDS.User.SignInError,
          autoClose: TOAST_DURATION,
          onClose: resetCooldown // reset cooldown immediately when closed
        });
      }
      return;
    }
    router.push(`/${mode}`);
  };

  return (
    <MenuContainer>
      <MenuTitle text='Notakto'></MenuTitle>
      <MenuButtonContainer className="max-w-3xl mx-auto">
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
    </MenuContainer >
  );
};

export default Menu;
