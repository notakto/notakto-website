"use client";

import { useEffect } from "react";
import { useMute } from "@/services/store";
import { initBackgroundMusic, toggleBackgroundMusic } from "@/services/sounds";

export default function MusicProvider() {
  const mute = useMute((state) => state.mute);

  // Run once on app load
  useEffect(() => {
    console.log("MusicProvider mounted, mute =", mute);
    initBackgroundMusic(mute);
  }, []);

  // Toggle music whenever mute changes
  useEffect(() => {
    toggleBackgroundMusic(mute);
  }, [mute]);

  return null; // no UI, just handles side effects
}
