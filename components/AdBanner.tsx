import React from 'react';

// Using a more specific placement type to distinguish ad slots
type AdPlacement = 'home-banner' | 'watch-top-banner' | 'watch-bottom-banner' | 'watch-sidebar' | 'home-card';

type AdBannerProps = {
  placement: AdPlacement;
  className?: string;
};

// Ad dimensions for different placements
const adConfigs: Record<AdPlacement, { width: number; height: number }> = {
  'home-banner': { width: 728, height: 90 },
  'watch-top-banner': { width: 728, height: 90 },
  'watch-bottom-banner': { width: 728, height: 90 },
  'watch-sidebar': { width: 300, height: 250 },
  'home-card': { width: 320, height: 50 }
};

const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const config = adConfigs[placement];
  const smartLink = "https://redirect01-z56s-git-main-benzee10000s-projects.vercel.app/";

  const baseClasses = "flex items-center justify-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30 text-white cursor-pointer hover:from-purple-800/40 hover:to-pink-800/40 transition-all duration-300";

  // Outer container styles for layout within the page
  const placementContainerClasses: Record<AdPlacement, string> = {
    'home-banner': 'w-full',
    'watch-top-banner': 'w-full',
    'watch-bottom-banner': 'w-full',
    'watch-sidebar': 'w-full',
    'home-card': 'w-full',
  };

  // Inner container styles to define the ad's dimensions
  const adDimensions = {
      width: `${config.width}px`,
      height: `${config.height}px`,
      maxWidth: '100%',
  };

  return (
    <div className={`${baseClasses} ${placementContainerClasses[placement]} ${className}`} style={{ minHeight: config.height }}>
      <div
        style={adDimensions}
        className="flex justify-center items-center relative cursor-pointer group"
        onClick={() => window.open(smartLink, '_blank')}
      >
        <div className="text-center p-4">
          <div className="text-lg font-bold mb-2">🔥 Premium Access</div>
          <div className="text-sm opacity-80">Click for exclusive content</div>
          <div className="text-xs mt-1 opacity-60">Sponsored</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      </div>
    </div>
  );
};

export default AdBanner;