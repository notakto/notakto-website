
'use client'

import { useRouter } from 'next/navigation';
import { signInWithGoogle, signOutUser } from '@/services/firebase';
import { useUser, useTut } from '@/services/store';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { TOAST_DURATION, TOAST_IDS } from "@/constants/toast";
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
  const { canShowToast, resetCooldown } = useToastCooldown(TOAST_DURATION);
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
          autoClose: TOAST_DURATION
        });
        useToastCooldown(); // <-- start cooldown immediately
      }
      return;
    }
    router.push(`/${mode}`);
  };

  return (
    <MenuContainer>
      
      
      {/* --- Utility buttons (top-right, responsive & grouped) --- */}
<div className="absolute top-6 right-6 flex flex-wrap gap-3 justify-end max-w-[90%]">
  <button
    className="px-4 py-2 text-base sm:px-2 sm:py-1 sm:text-sm 
               rounded-md bg-red-600 text-white font-medium 
               hover:bg-red-700 transition"
    onClick={(user) ? handleSignOut : handleSignIn}
  >
    {(user) ? "Sign Out" : "Sign In"}
  </button>

  <button
    className="px-4 py-2 text-base sm:px-2 sm:py-1 sm:text-sm 
               rounded-md bg-red-600 text-white font-medium 
               hover:bg-red-700 transition"
    onClick={() => setShowSoundConfig(!showSoundConfig)}
  >
    Sound
  </button>

  <button
    className="px-4 py-2 text-base sm:px-2 sm:py-1 sm:text-sm 
               rounded-md bg-red-600 text-white font-medium 
               hover:bg-red-700 transition"
    onClick={() => setshowShortcutConfig(!showShortcutConfig)}
  >
    Shortcuts
  </button>
</div>


      <MenuTitle text='Notakto' />

      {/* --- Central gameplay menu --- */}
      <MenuButtonContainer>
        <MenuButton onClick={() => startGame('vsPlayer')}> Play vs Player </MenuButton>
        <MenuButton onClick={() => startGame('vsComputer')}> Play vs Computer </MenuButton>
        <MenuButton onClick={() => startGame('liveMatch')}> Live Match </MenuButton>
        <MenuButton onClick={() => setShowTut(true)}> Tutorial </MenuButton>
      </MenuButtonContainer>

      {/* --- Modals --- */}
      <SoundConfigModal visible={showSoundConfig} onClose={() => setShowSoundConfig(false)} />
      <ShortcutModal visible={showShortcutConfig} onClose={() => setshowShortcutConfig(false)} />
    </MenuContainer>
  );
};

export default Menu;
