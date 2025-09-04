let backgroundAudio: HTMLAudioElement | null = null;

let moveAudio: HTMLAudioElement | null = null;
let winAudio: HTMLAudioElement | null = null;

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
