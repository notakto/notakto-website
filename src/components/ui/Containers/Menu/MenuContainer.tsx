import { ReactNode } from "react";
import { ParticleBackground } from "../../Effects/ParticleBackground";

interface MenuContainerProps {
    children: ReactNode;
}

export default function MenuContainer({ children }: MenuContainerProps) {
    return (
        <div className="relative flex flex-col items-center min-h-screen justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden">
            {/* Animated particle background */}
            <ParticleBackground />
            
            {/* Scanline overlay effect */}
            <div className="fixed inset-0 pointer-events-none z-[1]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent animate-pulse"></div>
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_98%,rgba(6,182,212,0.03)_100%)] bg-[length:4px_100%]"></div>
            </div>
            
            {/* Main menu container */}
            <div className="relative z-10 w-full max-w-2xl mx-auto">
                {/* Background decoration with enhanced effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl backdrop-blur-sm border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
                    {/* Inner glow effect */}
                    <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-transparent via-cyan-500/5 to-transparent"></div>
                </div>
                
                {/* Main menu content */}
                <div className="relative z-20 p-8 space-y-8">
                    {children}
                </div>
                
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-400/60"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-cyan-400/60"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-cyan-400/60"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-400/60"></div>
            </div>
        </div>
    );
}