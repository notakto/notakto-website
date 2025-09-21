let backgroundAudio: HTMLAudioElement | null = null;

let moveAudio: HTMLAudioElement | null = null;
let winAudio: HTMLAudioElement | null = null;

// Simple user-gesture unlock tracking so we can gate background music
let audioUnlocked = false;
let unlockListenersInitialized = false;

const setupAudioUnlockListeners = () => {
  if (unlockListenersInitialized || typeof window === 'undefined') return;
  unlockListenersInitialized = true;

  const handleFirstInteraction = () => {
    audioUnlocked = true;
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
  };

  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);
  document.addEventListener('keydown', handleFirstInteraction);
};

export const isAudioUnlocked = () => audioUnlocked;

export const playMoveSound = (mute: boolean) => {
  if (mute) return;
  if (!moveAudio) {
    moveAudio = new Audio('/sounds/click.mp3');
  }
  moveAudio.currentTime = 0;
  moveAudio.play().catch(console.error);
};

export const setMoveVolume = (volume: number) => {
  if (!moveAudio) {
    moveAudio = new Audio('/sounds/click.mp3'); // init early if needed
  }
  moveAudio.volume = volume;
};

export const playWinSound = (mute: boolean) => {
  if (mute) return;
  if (!winAudio) {
    winAudio = new Audio('/sounds/wins.mp3');
  }
  winAudio.currentTime = 0;
  winAudio.play().catch(console.error);
};

export const setWinVolume = (volume: number) => {
  if (!winAudio) {
    winAudio = new Audio('/sounds/wins.mp3');
  }
  winAudio.volume = volume;
};
export const initBackgroundMusic = () => {
  if (backgroundAudio) return;

  backgroundAudio = new Audio('/sounds/background.mp3');
  backgroundAudio.loop = true;
  backgroundAudio.volume = 0.3;

  // This doesnt autoplay .. jus intialises itself
  // Also prepare unlock listeners so MusicProvider can check isAudioUnlocked()
  setupAudioUnlockListeners();
};

export const playBackgroundMusic = () => {
  if (!backgroundAudio) return;
  backgroundAudio.play().catch((err) =>
    console.log("BG sound failed:", err)
  );
};

export const pauseBackgroundMusic = () => {
  if (!backgroundAudio) return;
  backgroundAudio.pause();
};

export const setBackgroundVolume = (volume: number) => {
  if (!backgroundAudio) return;
  backgroundAudio.volume = volume;
};

export const stopBackgroundMusic = () => {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;
    backgroundAudio = null;
  }
};
