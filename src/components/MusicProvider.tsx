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
      pauseBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  }, [bgMute]);

  useEffect(() => {
    setBackgroundVolume(bgVolume);
  }, [bgVolume]);

  useEffect(() => {
    setMoveVolume(sfxVolume)
    setWinVolume(sfxVolume)
  }, [sfxVolume]);

  return null;
}
