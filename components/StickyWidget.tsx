import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';

const WIDGET_CLOSED_KEY = 'affiliateWidgetClosed';

// List of video URLs provided by the user
const videoUrls = [
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b9991c5d4f2.73297277.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b996f8e2100.68901658.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b99880ff529.06142108.mp4",
  "https://images-assets.project1content.com/assets/brand/1241/tgp/3421/cell/page_1/adId_0/680b9964d538f7.59762869.mp4"
];

// Updated smart link for monetization
const smartLink = "https://redirect01-z56s-git-main-benzee10000s-projects.vercel.app/"; 

const StickyWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [randomVideo, setRandomVideo] = useState('');

  useEffect(() => {
    // Select a random video on component mount
    setRandomVideo(videoUrls[Math.floor(Math.random() * videoUrls.length)]);

    const isClosed = sessionStorage.getItem(WIDGET_CLOSED_KEY);
    if (!isClosed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Appear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    // Prevent the link from being followed when closing the widget
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem(WIDGET_CLOSED_KEY, 'true');
  };

  if (!isVisible || !randomVideo) {
    return null;
  }

  return (
    <div className="group fixed bottom-4 right-4 z-50 w-64 max-w-[90vw] bg-gray-900 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 transform transition-all duration-500 animate-slide-in-right overflow-hidden">
      <a href={smartLink} target="_blank" rel="noopener noreferrer" className="block relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 z-20 p-1 bg-gray-800/70 hover:bg-red-500 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
          aria-label="Close widget"
        >
          <XIcon className="w-5 h-5" />
        </button>
        
        {/* Video Player */}
        <video
          key={randomVideo} // Key ensures React remounts the component if src changes
          src={randomVideo}
          autoPlay
          loop
          muted
          playsInline // Essential for autoplay on mobile browsers
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
        
        {/* "Join Now" Button Overlay */}
        <div className="absolute inset-0 bg-black/10 transition-all group-hover:bg-black/40 flex items-center justify-center pointer-events-none">
          {/* Gradient for better text readability on the button */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Button container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 transform opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
              Join Now
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default StickyWidget;
