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
  
  // NOTE TO DEVELOPER: This is where you place your ad details.
  // Replace the placeholder values below with your actual ad content.
  const SMART_LINK_URL = 'https://your-smart-link-goes-here.com'; // <-- PLACE YOUR SMART LINK/AFFILIATE URL HERE
  const AD_VIDEO_URL = 'https://videos.pexels.com/video-files/2759484/2759484-sd_640_360_30fps.mp4'; // <-- PLACE YOUR VIDEO AD URL HERE (.mp4, .webm, etc.)
  const AD_POSTER_URL = 'https://images.pexels.com/videos/2759484/pexels-photo-2759484.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'; // <-- PLACE A POSTER/FALLBACK IMAGE URL HERE

  // Don't render the ad if no video URL is provided.
  if (!AD_VIDEO_URL) {
      return null;
  }

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
          aria-label="Promotional video advertisement"
        >
          <video
            src={AD_VIDEO_URL}
            poster={AD_POSTER_URL}
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110"
            autoPlay
            muted
            loop
            playsInline // Important for mobile browsers
          >
            Your browser does not support the video tag.
          </video>
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
