import { useState, useEffect } from 'react';

interface AnimatedTitleProps {
  text: string;
  subtitle?: string;
  className?: string;
}

export function AnimatedTitle({ 
  text, 
  subtitle = "The Ultimate Reverse Tic-Tac-Toe",
  className = ""
}: AnimatedTitleProps) {
  const [glitchActive, setGlitchActive] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Typing animation effect
  useEffect(() => {
    if (typedText.length < text.length) {
      const timeout = setTimeout(() => {
        setTypedText(text.slice(0, typedText.length + 1));
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [typedText, text]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  const glitchStyle = glitchActive ? {
    textShadow: `
      2px 0 #ff0000,
      -2px 0 #00ffff,
      4px 0 #ffff00,
      -4px 0 #ff00ff
    `,
    animation: 'shake 0.2s ease-in-out'
  } : {};

  return (
    <div className={`text-center mb-12 relative ${className}`}>
      {/* Gaming Badge */}
      <div className="inline-block mb-4 px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/50 rounded-full">
        <span className="text-cyan-300 font-bold text-sm tracking-widest uppercase animate-pulse">
          ⚡ ULTIMATE GAMING EXPERIENCE ⚡
        </span>
      </div>

      {/* Main Title */}
      <div className="relative mb-4">
        <h1 
          className={`
            text-7xl md:text-9xl font-black
            bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 
            bg-clip-text text-transparent bg-[length:200%_auto]
            tracking-wider font-mono
            transition-all duration-200 animate-gradient-x
            drop-shadow-2xl
            ${glitchActive ? 'animate-pulse' : ''}
          `}
          style={{
            ...glitchStyle,
            filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.5)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.3))',
            WebkitTextStroke: '2px rgba(6, 182, 212, 0.3)'
          }}
        >
          {typedText}
          {typedText.length < text.length && showCursor && (
            <span className="text-cyan-400 animate-pulse text-8xl">|</span>
          )}
        </h1>
        
        {/* Enhanced Glitch overlay layers */}
        {glitchActive && (
          <>
            <h1 
              className="absolute inset-0 text-7xl md:text-9xl font-black font-mono tracking-wider text-red-400 opacity-60"
              style={{ 
                clipPath: 'inset(0 0 50% 0)',
                transform: 'translateX(3px) translateY(2px)',
                filter: 'blur(1px)'
              }}
            >
              {typedText}
            </h1>
            <h1 
              className="absolute inset-0 text-7xl md:text-9xl font-black font-mono tracking-wider text-cyan-400 opacity-60"
              style={{ 
                clipPath: 'inset(50% 0 0 0)',
                transform: 'translateX(-3px) translateY(-2px)',
                filter: 'blur(1px)'
              }}
            >
              {typedText}
            </h1>
          </>
        )}

        {/* Glow effect behind title */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10 animate-pulse"></div>
      </div>

      {/* Enhanced Subtitle */}
      <div className="mt-6 overflow-hidden">
        <div className="inline-block px-4 py-2 bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-lg border border-cyan-500/30">
          <p className="text-cyan-200 text-xl md:text-2xl tracking-wide font-bold animate-slide-up drop-shadow-lg">
            🎮 {subtitle} 🎮
          </p>
        </div>
      </div>

      {/* Enhanced Decorative elements */}
      <div className="flex justify-center items-center mt-8 space-x-6">
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse shadow-lg shadow-cyan-400/50"></div>
        <div className="relative">
          <div className="w-4 h-4 border-2 border-cyan-400 rotate-45 animate-spin-slow shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute inset-0 w-4 h-4 bg-cyan-400/20 rotate-45 animate-ping"></div>
        </div>
        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse shadow-lg shadow-purple-500/50"></div>
      </div>

      {/* Enhanced Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent animate-scan-lines"></div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 0.8; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }
        
        @keyframes scan-lines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.5s both;
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-scan-lines {
          animation: scan-lines 8s linear infinite;
        }
      `}</style>
    </div>
  );
}