'use client'

import { useRouter } from 'next/navigation';
import { signInWithGoogle, signOutUser } from '@/services/firebase';
import { useUser, useTut } from '@/services/store';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { MenuButton } from '@/components/ui/Buttons/MenuButton';
import MenuContainer from '@/components/ui/Containers/Menu/MenuContainer';
import MenuButtonContainer from '@/components/ui/Containers/Menu/MenuButtonContainer';
import { MenuTitle } from '@/components/ui/Title/MenuTitle';
import SoundConfigModal from '@/modals/SoundConfigModal';
import ShortcutModal from '@/modals/ShortcutModal';
import { useState } from 'react';
import { useKeyboardShortcuts } from '@/components/hooks/useKeyboardShortcuts';
const Menu = () => {
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const setShowTut = useTut((state) => state.setShowTut);

  const router = useRouter();
  const { canShowToast, triggerToastCooldown, resetCooldown } = useToastCooldown(4000);
  const [showSoundConfig, setShowSoundConfig] = useState<boolean>(false);
  const [showShortcutConfig, setshowShortcutConfig] = useState<boolean>(false);

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

  // Keyboard shortcuts for main menu
  useKeyboardShortcuts([
    {
      key: 'Escape',
      action: () => {
        if (showSoundConfig || showShortcutConfig) {
          setShowSoundConfig(false);
          setshowShortcutConfig(false);
        }
      },
      enabled: showSoundConfig || showShortcutConfig,
    },
    {
      key: '1',
      action: () => startGame('vsPlayer'),
      enabled: !showSoundConfig && !showShortcutConfig,
    },
    {
      key: '2', 
      action: () => startGame('vsComputer'),
      enabled: !showSoundConfig && !showShortcutConfig,
    },
    {
      key: '3',
      action: () => startGame('liveMatch'),
      enabled: !showSoundConfig && !showShortcutConfig,
    },
    {
      key: 't',
      action: () => setShowTut(true),
      enabled: !showSoundConfig && !showShortcutConfig,
    },
    {
      key: 'T',
      action: () => setShowTut(true),
      enabled: !showSoundConfig && !showShortcutConfig,
    },
    {
      key: 's',
      action: () => setShowSoundConfig(!showSoundConfig),
      enabled: !showShortcutConfig,
    },
    {
      key: 'S',
      action: () => setShowSoundConfig(!showSoundConfig),
      enabled: !showShortcutConfig,
    },
    {
      key: 'k',
      action: () => setshowShortcutConfig(!showShortcutConfig),
      enabled: !showSoundConfig,
    },
    {
      key: 'K',
      action: () => setshowShortcutConfig(!showShortcutConfig),
      enabled: !showSoundConfig,
    },
  ]);

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
    </MenuContainer >
  );
};

export default Menu;
