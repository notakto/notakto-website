'use client'

import { useRouter } from 'next/navigation';
import { signInWithGoogle, signOutUser } from '@/services/firebase';
import { useCoins, useXP, useUser, useMute, useTut } from '@/services/store';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { MenuButton } from '@/components/ui/Buttons/MenuButton';

const Menu = () => {
  const setCoins = useCoins((state) => state.setCoins);
  const setXP = useXP((state) => state.setXP);
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const mute = useMute((state) => state.mute);
  const setMute = useMute((state) => state.setMute);
  const showTut = useTut((state) => state.showTut);
  const setShowTut = useTut((state) => state.setShowTut);

  const router = useRouter();
  const { canShowToast, triggerToastCooldown, resetCooldown } = useToastCooldown(4000);

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
      setCoins(1000);
      setXP(0);
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
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
        <h1 className="text-red-600 text-[180px] -mb-10">Notakto</h1>
        <MenuButton onClick={() => startGame('vsPlayer')}> Play vs Player </MenuButton>
        <MenuButton onClick={() => startGame('vsComputer')}> Play vs Computer </MenuButton>
        <MenuButton onClick={() => startGame('liveMatch')}> Live Match </MenuButton>
        <MenuButton onClick={() => setShowTut(true)}> Tutorial </MenuButton>
        <MenuButton onClick={(user)?handleSignOut:handleSignIn}> {(user)?"Sign Out":"Sign in"} </MenuButton>
        <MenuButton onClick={() => setMute(!mute)}>Sound: {mute ? 'Off' : 'On'}</MenuButton>
      </div>
    </div>
  );
};

export default Menu;
