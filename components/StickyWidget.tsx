import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';

const WIDGET_CLOSED_KEY = 'affiliateWidgetClosed';

const StickyWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the widget was closed during this session
    const isClosed = sessionStorage.getItem(WIDGET_CLOSED_KEY);
    if (!isClosed) {
      // Use a timeout to delay the widget's appearance, making it less intrusive
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Appear after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem(WIDGET_CLOSED_KEY, 'true');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[90vw] bg-gray-800 border border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 transform transition-all duration-500 animate-slide-in-right">
      <div className="relative p-4">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 p-1 bg-gray-700 hover:bg-red-500 rounded-full text-white transition-colors"
          aria-label="Close widget"
        >
          <XIcon className="w-5 h-5" />
        </button>
        <div className="text-center">
          {/* === PASTE YOUR AFFILIATE SMART LINK WIDGET/CODE HERE === */}
          <h4 className="font-bold text-lg text-cyan-300 mb-2">Special Offer!</h4>
          <p className="text-gray-300 text-sm mb-3">
            Check out this exclusive deal from our affiliate partner.
          </p>
          <a
            href="#" // TODO: Replace with your affiliate link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            Learn More
          </a>
          {/* ======================================================== */}
        </div>
      </div>
    </div>
  );
};

export default StickyWidget;
