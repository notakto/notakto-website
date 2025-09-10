"use client";

import { useEffect } from "react";
import { useSound } from "@/services/store";
import {
  initBackgroundMusic,
  playBackgroundMusic,
  setBackgroundVolume,
  stopBackgroundMusic,
  setMoveVolume,
  setWinVolume
} from "@/services/sounds";

export default function MusicProvider() {
  const bgMute = useSound((state) => state.bgMute);
  const bgVolume = useSound((state) => state.bgVolume);
  const sfxVolume = useSound((state) => state.sfxVolume);
  const sfxMute = useSound((state) => state.sfxMute);


  useEffect(() => {
    initBackgroundMusic(); // prepare but don’t autoplay
    return () => stopBackgroundMusic();
  }, []);
  
  useEffect(() => {
    if (bgMute) {
      // mute is setting the volume down
      setBackgroundVolume(0)
    } else {
      playBackgroundMusic();
      setBackgroundVolume(bgVolume);
    }
  }, [bgMute, bgVolume]);

  useEffect(() => {
    const volume = sfxMute ? 0 : Math.max(0, Math.min(1, sfxVolume));
    setMoveVolume(volume)
    setWinVolume(volume)
  }, [sfxMute, sfxVolume]);

  return null;
}
