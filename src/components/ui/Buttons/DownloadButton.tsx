import { SecondaryMenuButton } from './MenuButtonVariants';
import { useState, useEffect } from 'react';

interface PlatformInfo {
  name: string;
  icon: string;
  downloadUrl?: string;
}

const platforms: Record<string, PlatformInfo> = {
  android: { name: 'Android', icon: '📱', downloadUrl: '#' },
  ios: { name: 'iOS', icon: '🍎', downloadUrl: '#' },
  windows: { name: 'Windows', icon: '🪟', downloadUrl: '#' },
  macos: { name: 'macOS', icon: '💻', downloadUrl: '#' },
  linux: { name: 'Linux', icon: '🐧', downloadUrl: '#' }
};

function detectPlatform(): string {
  if (typeof window === 'undefined') return 'windows';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/mac os x/.test(userAgent)) return 'macos';
  if (/linux/.test(userAgent)) return 'linux';
  if (/win/.test(userAgent)) return 'windows';
  
  return 'windows'; // default fallback
}

interface DownloadButtonProps {
  className?: string;
  onDownloadClick?: (platform: string) => void;
}

export function DownloadAppButton({ className, onDownloadClick }: DownloadButtonProps) {
  const [platform, setPlatform] = useState<string>('windows');
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const handleMainButtonClick = () => {
    setShowAllPlatforms(true);
  };

  const handlePlatformSelect = (selectedPlatform: string) => {
    if (onDownloadClick) {
      onDownloadClick(selectedPlatform);
    } else {
      // Default behavior - show coming soon message
      alert(`Download for ${platforms[selectedPlatform].name} coming soon! 🚀`);
    }
    setShowAllPlatforms(false);
  };

  if (showAllPlatforms) {
    return (
      <div className="space-y-3">
        <div className="text-center text-lg font-bold text-cyan-300 mb-3">
          📱 Choose Your Platform
        </div>
        {Object.entries(platforms).map(([key, platformInfo]) => (
          <SecondaryMenuButton
            key={key}
            onClick={() => handlePlatformSelect(key)}
            className="w-full"
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-2xl">{platformInfo.icon}</span>
              <span className="text-lg font-semibold">Download for {platformInfo.name}</span>
            </span>
          </SecondaryMenuButton>
        ))}
        <button
          onClick={() => setShowAllPlatforms(false)}
          className="w-full text-cyan-300 hover:text-white text-base py-3 px-4 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200 font-medium"
        >
          ← Back to Menu
        </button>
      </div>
    );
  }

  return (
    <SecondaryMenuButton onClick={handleMainButtonClick} className={`w-full ${className}`}>
      <span className="flex items-center justify-center gap-3">
        <span className="text-2xl">📱</span>
        <span className="text-lg font-semibold">Download App</span>
      </span>
    </SecondaryMenuButton>
  );
}