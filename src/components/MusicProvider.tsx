"use client";

import { useEffect } from "react";
import { useMute } from "@/services/store";
import { initBackgroundMusic, stopBackgroundMusic, toggleBackgroundMusic } from "@/services/sounds";

export default function MusicProvider() {
  const mute = useMute((state) => state.mute);

  useEffect(() => {
    initBackgroundMusic(mute);
    return () => stopBackgroundMusic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    toggleBackgroundMusic(mute);
  }, [mute]);

  return null;
}
