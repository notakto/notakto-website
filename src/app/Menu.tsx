'use client'

import { useRouter } from 'next/navigation';
import { signInWithGoogle, signOutUser } from '@/services/firebase';
import { useUser, useTut } from '@/services/store';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { MenuButton } from '@/components/ui/Buttons/MenuButton';
import { PrimaryMenuButton, SecondaryMenuButton, UtilityMenuButton } from '@/components/ui/Buttons/MenuButtonVariants';
import { GitHubContributeButton } from '@/components/ui/Buttons/GitHubButton';
import { DownloadAppButton } from '@/components/ui/Buttons/DownloadButton';
import MenuContainer from '@/components/ui/Containers/Menu/MenuContainer';
import MenuButtonContainer, { MenuSection } from '@/components/ui/Containers/Menu/MenuButtonContainer';
import { MenuTitle } from '@/components/ui/Title/MenuTitle';
import { AnimatedTitle } from '@/components/ui/Effects/AnimatedTitle';
import SoundConfigModal from '@/modals/SoundConfigModal';
import ShortcutModal from '@/modals/ShortcutModal';
import { initHoverSound } from '@/services/sounds';
import { useState, useEffect } from 'react';
const Menu = () => {
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const setShowTut = useTut((state) => state.setShowTut);

  const router = useRouter();
  const { canShowToast, triggerToastCooldown, resetCooldown } = useToastCooldown(4000);
  const [showSoundConfig, setShowSoundConfig] = useState<boolean>(false);
  const [showShortcutConfig, setshowShortcutConfig] = useState<boolean>(false);

  // Initialize hover sounds when component mounts
  useEffect(() => {
    initHoverSound();
  }, []);

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
    console.log('Starting game mode:', mode, 'User:', user?.uid || 'Not signed in');
    
    if ((mode === 'liveMatch' || mode === 'vsComputer') && !user) {
      if (canShowToast()) {
        toast("Please sign in to play this mode!", {
          autoClose: 10000,
          onClose: resetCooldown
        });
        triggerToastCooldown();
      }
      return;
    }
    router.push(`/${mode}`);
  };  return (
    <MenuContainer>
      <AnimatedTitle text='NOTAKTO' />
      
      <MenuButtonContainer>
        {/* Game Modes Section */}
        <MenuSection title="🎮 Game Modes">
          <PrimaryMenuButton onClick={() => startGame('vsPlayer')}>
            Play vs Player
          </PrimaryMenuButton>
          <PrimaryMenuButton onClick={() => startGame('vsComputer')}>
            Play vs Computer
          </PrimaryMenuButton>
          <PrimaryMenuButton onClick={() => startGame('liveMatch')}>
            Live Match
          </PrimaryMenuButton>
        </MenuSection>

        {/* Community Section */}
        <MenuSection title="🌐 Community">
          <GitHubContributeButton />
          <DownloadAppButton />
        </MenuSection>

        {/* User & Settings Section */}
        <MenuSection title="⚙️ Settings & Account">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <UtilityMenuButton onClick={() => setShowTut(true)}>
              Tutorial
            </UtilityMenuButton>
            <UtilityMenuButton onClick={(user) ? handleSignOut : handleSignIn}>
              {(user) ? "Sign Out" : "Sign In"}
            </UtilityMenuButton>
            <UtilityMenuButton onClick={() => setShowSoundConfig(!showSoundConfig)}>
              🔊 Sound
            </UtilityMenuButton>
            <UtilityMenuButton onClick={() => setshowShortcutConfig(!showShortcutConfig)}>
              ⌨️ Shortcuts
            </UtilityMenuButton>
          </div>
        </MenuSection>
      </MenuButtonContainer>
      
      <SoundConfigModal visible={showSoundConfig} onClose={() => setShowSoundConfig(false)} />
      <ShortcutModal visible={showShortcutConfig} onClose={() => setshowShortcutConfig(false)} />
    </MenuContainer>
  );
};

export default Menu;
