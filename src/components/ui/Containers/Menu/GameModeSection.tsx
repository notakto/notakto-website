'use client';

import { MenuButton } from '@/components/ui/Buttons/MenuButton';

interface GameModeSectionProps {
  /** Handler function when a game mode is selected */
  onStartGame: (mode: 'vsPlayer' | 'vsComputer' | 'liveMatch') => void;
  /** Current user authentication state */
  isAuthenticated: boolean;
  /** Custom CSS classes for the section container */
  className?: string;
}

/**
 * GameModeSection Component
 * 
 * A dedicated section component that groups all game mode buttons with proper
 * visual hierarchy and responsive design. Part of Phase 2 menu redesign to
 * create distinct sections for better UX and desktop responsiveness.
 * 
 * Features:
 * - Section header with game mode title
 * - Visual grouping with subtle background and borders
 * - Responsive button layout (1→2→3 columns)
 * - Integration with existing MenuContainer layout
 * - Authentication-aware button states
 */
const GameModeSection: React.FC<GameModeSectionProps> = ({
  onStartGame,
  isAuthenticated,
  className = ""
}) => {
  return (
    <section className={`w-full ${className}`}>
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Your Challenge
        </h2>
        <p className="text-gray-300 text-sm font-medium">
          Select a game mode to start playing
        </p>
      </div>

      {/* Game Mode Cards Container */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-lg">
        {/* Game Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* VS Player Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25">
            <div className="p-4">
              <div className="mb-3 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-blue-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="font-semibold text-blue-200 text-lg">Local Match</h3>
                <p className="text-xs text-blue-300/70 mt-1">Play with a friend nearby</p>
              </div>
              <MenuButton 
                onClick={() => onStartGame('vsPlayer')}
                className="w-full bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30"
              >
                Play vs Player
              </MenuButton>
            </div>
          </div>

          {/* VS Computer Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25">
            <div className="p-4">
              <div className="mb-3 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-red-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-semibold text-red-200 text-lg">AI Challenge</h3>
                <p className="text-xs text-red-300/70 mt-1">Test your skills against AI</p>
              </div>
              <MenuButton 
                onClick={() => onStartGame('vsComputer')}
                className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-400/30"
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? 'Play vs Computer' : 'Sign In Required'}
              </MenuButton>
            </div>
            {!isAuthenticated && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                <div className="bg-black/70 px-3 py-1 rounded-md">
                  <span className="text-xs text-yellow-300">🔒 Authentication Required</span>
                </div>
              </div>
            )}
          </div>

          {/* Live Match Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 md:col-span-2 lg:col-span-1">
            <div className="p-4">
              <div className="mb-3 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="font-semibold text-green-200 text-lg">Online Match</h3>
                <p className="text-xs text-green-300/70 mt-1">Play with others worldwide</p>
              </div>
              <MenuButton 
                onClick={() => onStartGame('liveMatch')}
                className="w-full bg-green-500/20 hover:bg-green-500/30 border-green-400/30"
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? 'Live Match' : 'Sign In Required'}
              </MenuButton>
            </div>
            {!isAuthenticated && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
                <div className="bg-black/70 px-3 py-1 rounded-md">
                  <span className="text-xs text-yellow-300">🔒 Authentication Required</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Footer */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-center text-xs text-gray-400">
            Each game mode offers unique challenges and experiences
          </p>
        </div>
      </div>
    </section>
  );
};

export default GameModeSection;