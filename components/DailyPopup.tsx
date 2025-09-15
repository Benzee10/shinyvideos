
import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';

const POPUP_SHOWN_KEY = 'dailyPopupShown';
const POPUP_DELAY = 5000; // 5 seconds delay before showing popup

const DailyPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const smartLink = "https://whatsappad.vercel.app/";

  useEffect(() => {
    const checkAndShowPopup = () => {
      const lastShown = localStorage.getItem(POPUP_SHOWN_KEY);
      const now = new Date();
      const today = now.toDateString();

      // Check if popup was already shown today
      if (lastShown !== today) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, POPUP_DELAY);
        
        return () => clearTimeout(timer);
      }
    };

    checkAndShowPopup();
  }, []);

  const handlePopupClick = () => {
    // Mark as shown for today
    const today = new Date().toDateString();
    localStorage.setItem(POPUP_SHOWN_KEY, today);
    
    // Redirect to smart link
    window.open(smartLink, '_blank', 'noopener,noreferrer');
    
    // Close popup
    setIsVisible(false);
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date().toDateString();
    localStorage.setItem(POPUP_SHOWN_KEY, today);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative bg-gradient-to-br from-purple-900 to-pink-900 p-8 rounded-2xl shadow-2xl border border-purple-500/30 max-w-md mx-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
        onClick={handlePopupClick}
      >
        {/* Close button */}
        <button
          onClick={handleCloseClick}
          className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-red-500 rounded-full text-white transition-colors z-10"
          aria-label="Close popup"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Popup content */}
        <div className="text-center">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🔥</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Exclusive Premium Access!
            </h2>
            <p className="text-gray-200 mb-6">
              Limited time offer - Get instant access to premium content and exclusive features!
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-black/20 p-4 rounded-lg">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>✨ HD Quality Videos</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-300 mt-1">
                <span>🚫 Ad-Free Experience</span>
                <span className="text-green-400">FREE</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-300 mt-1">
                <span>⚡ Unlimited Downloads</span>
                <span className="text-green-400">FREE</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-cyan-500/25">
              <div className="text-lg">Click Anywhere to Claim</div>
              <div className="text-sm opacity-90">👆 Tap this popup to continue</div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            * Offer valid for today only
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyPopup;
