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
import GameModeSection from '@/components/ui/Containers/Menu/GameModeSection';
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
      
      {/* Game Mode Section - Phase 2 */}
      <div className="w-full max-w-5xl mx-auto mb-12">
        <GameModeSection 
          onStartGame={startGame}
          isAuthenticated={!!user}
          className="mb-8"
        />
      </div>

      {/* Divider */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Additional Options Section */}
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-white/90 mb-2">Settings & Help</h3>
          <p className="text-gray-400 text-sm">Customize your experience</p>
        </div>
        
        <MenuButtonContainer className="bg-black/10 backdrop-blur-sm rounded-xl border border-white/5 p-6 shadow-lg">
          <MenuButton onClick={() => setShowTut(true)}> Tutorial </MenuButton>
          <MenuButton onClick={(user) ? handleSignOut : handleSignIn}>{(user) ? "Sign Out" : "Sign in"}</MenuButton>
          <MenuButton onClick={() => setShowSoundConfig(!showSoundConfig)}>Adjust Sound</MenuButton>
          <MenuButton onClick={() => setshowShortcutConfig(!showShortcutConfig)}>Keyboard Shortcuts</MenuButton>
        </MenuButtonContainer>
      </div>
      
      <SoundConfigModal visible={showSoundConfig} onClose={() => setShowSoundConfig(false)} />
      <ShortcutModal visible={showShortcutConfig} onClose={() => setshowShortcutConfig(false)} />
    </MenuContainer >
  );
};

export default Menu;
