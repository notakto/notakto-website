import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { playHoverSound, playButtonClickSound } from "@/services/sounds";
import { useSound } from "@/services/store";

// Base button styles for consistent theming
const baseButtonStyles = "relative overflow-hidden transition-all duration-300 font-bold text-white border-2 hover:scale-105 active:scale-95 group transform-gpu";

// Enhanced sound effect function with proper integration and variants
const useButtonSounds = (variant: 'primary' | 'secondary' | 'utility' = 'primary') => {
  const sfxMute = useSound((state) => state.sfxMute);
  
  const playButtonHoverSound = () => {
    // Synchronous call for hover sounds
    playHoverSound(sfxMute, variant);
    
    // Gentler haptic feedback for hover (reduced from 25ms to 15ms)
    if (typeof window !== 'undefined' && window.navigator.vibrate && !sfxMute) {
      window.navigator.vibrate(15);
    }
  };
  
  const playButtonClickSoundEffect = () => {
    // Synchronous call for click sounds
    playButtonClickSound(sfxMute);
    
    // Stronger haptic feedback for clicks
    if (typeof window !== 'undefined' && window.navigator.vibrate && !sfxMute) {
      window.navigator.vibrate(50);
    }
  };
  
  return { playButtonHoverSound, playButtonClickSoundEffect };
};

// Primary button for main game modes
export function PrimaryMenuButton({
    className,
    children,
    onMouseEnter,
    onClick,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    const { playButtonHoverSound, playButtonClickSoundEffect } = useButtonSounds('primary');
    
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        playButtonHoverSound();
        onMouseEnter?.(e);
    };
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playButtonClickSoundEffect();
        onClick?.(e);
    };

    return (
        <button
            className={clsx(
                baseButtonStyles,
                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-400 hover:to-blue-400",
                "border-2 border-cyan-400 hover:border-cyan-200 shadow-lg shadow-purple-500/30",
                "py-4 px-6 text-xl font-bold rounded-lg tracking-wide",
                "hover:shadow-xl hover:shadow-purple-500/50",
                "text-white hover:text-cyan-50 drop-shadow-lg",
                "before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400/0 before:via-cyan-400/20 before:to-cyan-400/0",
                "before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            {...props}
        >
            <span className="relative z-10 transition-all duration-300 group-hover:scale-105 font-bold text-shadow-lg">{children}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            {/* Pulse effect on hover */}
            <div className="absolute inset-0 rounded-lg bg-cyan-400/20 opacity-0 group-hover:opacity-100 group-hover:animate-ping"></div>
        </button>
    );
}

// Secondary button for community actions
export function SecondaryMenuButton({
    className,
    children,
    onMouseEnter,
    onClick,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    const { playButtonHoverSound, playButtonClickSoundEffect } = useButtonSounds('secondary');
    
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        playButtonHoverSound();
        onMouseEnter?.(e);
    };
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playButtonClickSoundEffect();
        onClick?.(e);
    };

    return (
        <button
            className={clsx(
                baseButtonStyles,
                "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-400",
                "border-2 border-emerald-400 hover:border-emerald-200 shadow-lg shadow-emerald-500/30",
                "py-4 px-6 text-lg font-bold rounded-lg tracking-wide",
                "hover:shadow-xl hover:shadow-emerald-500/50",
                "text-white hover:text-emerald-50 drop-shadow-lg",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2 font-bold transition-all duration-300 group-hover:scale-105">{children}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
    );
}

// Utility button for settings and other actions
export function UtilityMenuButton({
    className,
    children,
    onMouseEnter,
    onClick,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    const { playButtonHoverSound, playButtonClickSoundEffect } = useButtonSounds('utility');
    
    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        playButtonHoverSound();
        onMouseEnter?.(e);
    };
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        playButtonClickSoundEffect();
        onClick?.(e);
    };

    return (
        <button
            className={clsx(
                baseButtonStyles,
                "bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-500 hover:to-gray-500",
                "border-2 border-slate-400 hover:border-slate-200 shadow-lg shadow-slate-500/25",
                "py-3 px-4 text-base font-semibold rounded-lg tracking-wide",
                "hover:shadow-lg hover:shadow-slate-500/40",
                "text-white hover:text-slate-50 drop-shadow-lg",
                className
            )}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            {...props}
        >
            <span className="relative z-10 font-semibold transition-all duration-200 group-hover:scale-105">{children}</span>
        </button>
    );
}

// Icon button component for buttons with icons
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'utility';
}

export function IconMenuButton({ 
    icon, 
    children, 
    variant = 'secondary', 
    className,
    ...props 
}: IconButtonProps) {
    const ButtonComponent = variant === 'primary' ? PrimaryMenuButton : 
                           variant === 'secondary' ? SecondaryMenuButton : 
                           UtilityMenuButton;
    
    return (
        <ButtonComponent className={className} {...props}>
            {icon}
            <span>{children}</span>
        </ButtonComponent>
    );
}