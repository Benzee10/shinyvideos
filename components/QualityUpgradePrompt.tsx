
import React, { useState, useEffect } from 'react';
import { PlayIcon, SparklesIcon } from './Icons';

interface QualityUpgradePromptProps {
  onUpgradeClick: () => void;
}

const QualityUpgradePrompt: React.FC<QualityUpgradePromptProps> = ({ onUpgradeClick }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after 15 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl p-6 max-w-md w-full border border-purple-500/30 shadow-2xl animate-pulse">
        <div className="text-center">
          <SparklesIcon className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Upgrade Video Quality</h3>
          <p className="text-gray-200 mb-4">
            Watch this video in stunning 4K Ultra HD quality with premium access
          </p>
          <div className="bg-black/30 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Current Quality</div>
                <div className="text-white font-semibold">720p HD</div>
              </div>
              <div>
                <div className="text-gray-400">Premium Quality</div>
                <div className="text-yellow-400 font-semibold">4K UHD</div>
              </div>
            </div>
          </div>
          <button
            onClick={onUpgradeClick}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 touch-manipulation min-h-[60px] sm:min-h-[50px]"
          >
            <PlayIcon className="h-5 w-5" />
            Upgrade to 4K Now
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="mt-3 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default QualityUpgradePrompt;
