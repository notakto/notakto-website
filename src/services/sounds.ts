let backgroundAudio: HTMLAudioElement | null = null;

let moveAudio: HTMLAudioElement | null = null;
let winAudio: HTMLAudioElement | null = null;
let hoverAudio: HTMLAudioElement | null = null;

// Web Audio API context for synthetic sounds
let audioContext: AudioContext | null = null;
let audioInitialized = false;
let audioUnlocked = false; // Set true after first user gesture

const initAudioContext = () => {
  if (!audioContext && typeof window !== 'undefined') {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported:', error);
    }
  }
};

// Synchronous audio initialization for immediate use
const initAudioSystemSync = () => {
  if (audioInitialized) return true;
  
  try {
    // Initialize Web Audio API
    initAudioContext();
    
    // Resume audio context if suspended (this needs to be done synchronously)
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Don't pre-create audio objects - create them on first use to respect user gesture requirement
    audioInitialized = true;
    console.log('Audio system initialized synchronously');
    return true;
  } catch (error) {
    console.log('Synchronous audio initialization failed:', error);
    return false;
  }
};

// Initialize audio system on first user interaction
const initAudioSystem = async () => {
  if (audioInitialized) return true;
  
  try {
    // Initialize Web Audio API
    initAudioContext();
    
    // Resume audio context if suspended (required by browser autoplay policy)
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Pre-load audio files to avoid delays
    if (!moveAudio) {
      moveAudio = new Audio('/sounds/click.mp3');
      moveAudio.preload = 'auto';
    }
    
    if (!winAudio) {
      winAudio = new Audio('/sounds/wins.mp3');
      winAudio.preload = 'auto';
    }
    
    if (!backgroundAudio) {
      backgroundAudio = new Audio('/sounds/background.mp3');
      backgroundAudio.loop = true;
      backgroundAudio.volume = 0.3;
      backgroundAudio.preload = 'auto';
    }
    
    audioInitialized = true;
    return true;
  } catch (error) {
    console.log('Audio initialization failed:', error);
    return false;
  }
};

export const playMoveSound = (mute: boolean) => {
  if (mute) return;
  
  // Initialize audio system synchronously on first use
  initAudioSystemSync();
  
  try {
    if (!moveAudio) {
      moveAudio = new Audio('/sounds/click.mp3');
      moveAudio.volume = 0.7;
    }
    moveAudio.currentTime = 0;
    moveAudio.play().catch((error) => {
      console.log('Move sound play failed:', error);
    });
  } catch (error) {
    console.log('Move sound creation/play failed:', error);
  }
};

export const setMoveVolume = (volume: number) => {
  if (!moveAudio) {
    moveAudio = new Audio('/sounds/click.mp3'); // init early if needed
  }
  moveAudio.volume = volume;
};

export const playWinSound = (mute: boolean) => {
  if (mute) return;
  
  // Initialize audio system synchronously on first use
  initAudioSystemSync();
  
  if (!winAudio) {
    winAudio = new Audio('/sounds/wins.mp3');
  }
  winAudio.currentTime = 0;
  winAudio.play().catch((error) => {
    console.log('Win sound play failed:', error);
  });
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
  // Initialize audio system synchronously on first use
  initAudioSystemSync();
  
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

// Create a synthetic coin-like hover sound using Web Audio API
const createHoverTone = (variant: 'primary' | 'secondary' | 'utility' = 'primary') => {
  if (!audioContext) {
    initAudioContext();
    if (!audioContext) return;
  }

  try {
    // Create a brief, pleasant tone for hover
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different button types
    let startFreq, endFreq;
    switch (variant) {
      case 'primary':
        startFreq = 720;   // Slightly softer pitch for game mode buttons
        endFreq = 1050;
        break;
      case 'secondary':
        startFreq = 560;   // Medium pitch for community buttons
        endFreq = 840;
        break;
      case 'utility':
        startFreq = 480;   // Lower pitch for utility buttons
        endFreq = 680;
        break;
    }
    
    // Coin-like sound: quick frequency sweep with rapid decay
    oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + 0.08);

    // Softer, subtler envelope
    gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.006, audioContext.currentTime + 0.11);

    oscillator.type = 'sine'; // Softer than triangle
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.11); // Very brief
  } catch (error) {
    console.log('Could not create hover tone:', error);
  }
};

// Hover sound effects for menu buttons - using synthetic sound with variants
export const playHoverSound = (mute: boolean, variant: 'primary' | 'secondary' | 'utility' = 'primary') => {
  if (mute) return;
  
  // Initialize audio system synchronously on first use
  initAudioSystemSync();
  
  // Try synthetic sound first, fallback to modified audio file
  if (audioContext && audioContext.state === 'running') {
    createHoverTone(variant);
  } else {
    // Fallback: attempt HTMLAudio playback even before a gesture; swallow errors if blocked by policy
    if (!hoverAudio && typeof window !== 'undefined') {
      try {
        hoverAudio = new Audio('/sounds/click.mp3');
        hoverAudio.preload = 'auto';
        hoverAudio.volume = 0.06; // Softer hover volume
      } catch {}
    }
    if (hoverAudio) {
      switch (variant) {
        case 'primary':
          hoverAudio.playbackRate = 1.4; // Slightly lower for a softer feel
          break;
        case 'secondary':
          hoverAudio.playbackRate = 1.25; // Medium pitch
          break;
        case 'utility':
          hoverAudio.playbackRate = 1.15; // Lower pitch
          break;
      }
      try {
        hoverAudio.currentTime = 0;
        hoverAudio.play().catch(() => {});
      } catch {}
    }
  }
};

export const setHoverVolume = (volume: number) => {
  if (!hoverAudio) {
    hoverAudio = new Audio('/sounds/click.mp3');
  }
  hoverAudio.volume = Math.max(0, Math.min(1, volume)) * 0.25; // Keep hover sounds quieter than clicks
};

// Initialize hover sound system (both synthetic and fallback)
export const initHoverSound = () => {
  // Initialize Web Audio API for synthetic sounds only
  initAudioContext();
  // Preload fallback audio to minimize delay on first hover
  if (!hoverAudio && typeof window !== 'undefined') {
    try {
      hoverAudio = new Audio('/sounds/click.mp3');
      hoverAudio.preload = 'auto';
      hoverAudio.volume = 0.06;
    } catch {}
  }
};

// Utility to check if audio is unlocked (after a user gesture)
export const isAudioUnlocked = () => {
  return audioUnlocked || (!!audioContext && audioContext.state === 'running');
};

// Button click sound (slightly louder than hover)
export const playButtonClickSound = (mute: boolean) => {
  if (mute) return;
  // Reuse the move sound for button clicks as it's already a click sound
  playMoveSound(mute);
};

// Global audio initialization - call this once when the app starts
export const initGlobalAudio = () => {
  if (typeof window === 'undefined') return;
  
  let initialized = false;
  
  const handleFirstInteraction = () => {
    if (initialized) return;
    initialized = true;
    
    console.log('Initializing audio system on first user interaction');
    audioUnlocked = true;
    initAudioSystemSync();
    
    // Remove listeners after first interaction
    document.removeEventListener('click', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
    document.removeEventListener('keydown', handleFirstInteraction);
  };
  
  // Listen for any user interaction to enable audio
  document.addEventListener('click', handleFirstInteraction);
  document.addEventListener('touchstart', handleFirstInteraction);  
  document.addEventListener('keydown', handleFirstInteraction);
};
