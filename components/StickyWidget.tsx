import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';

const StickyWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show the widget after a short delay to not be too intrusive on page load.
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500); // Appear after 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  if (isDismissed || !isVisible) {
    return null;
  }
  
  // TODO: Replace this with your actual smart link
  const SMART_LINK_URL = 'https://your-smart-link-here.com';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
      <div className="relative group w-72 h-48 bg-gray-900 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden border border-cyan-500/30">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors z-20 p-1.5 rounded-full bg-black/40 hover:bg-black/60"
          aria-label="Dismiss"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <a
          href={SMART_LINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
          aria-label="Promotional advertisement"
        >
          <video
            src="https://assets.mixkit.co/videos/preview/mixkit-a-girl-in-a-leather-jacket-with-a-red-light-behind-her-4007-small.mp4"
            poster="https://i.postimg.cc/x1tbV43c/341bd6e23da75fcc2275ea802a920007-mp4-8-1280.jpg"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-4">
            <h4 className="font-bold text-white text-lg drop-shadow-md">Discover More</h4>
            <p className="text-sm text-gray-200 drop-shadow-md">Click to see our special offer!</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default StickyWidget;
