"use client";

import { useEffect } from "react";
import { useSound } from "@/services/store";
import {
  initBackgroundMusic,
  playBackgroundMusic,
  pauseBackgroundMusic,
  setBackgroundVolume,
  stopBackgroundMusic,
  setMoveVolume,
  setWinVolume
} from "@/services/sounds";

export default function MusicProvider() {
  const bgMute = useSound((state) => state.bgMute);
  const bgVolume = useSound((state) => state.bgVolume);
  const sfxVolume = useSound((state) => state.sfxVolume);

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
  }, [bgMute,bgVolume]);

  // Any tabs switch will `pause` the music
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) pauseBackgroundMusic();
      else playBackgroundMusic();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    setBackgroundVolume(bgVolume);
  }, [bgVolume]);

  useEffect(() => {
    setMoveVolume(sfxVolume)
    setWinVolume(sfxVolume)
  }, [sfxVolume]);

  return null;
}
