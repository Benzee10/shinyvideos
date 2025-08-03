import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';

const WIDGET_CLOSED_KEY = 'affiliateWidgetClosed';
const WIDGET_SCRIPT_ID = 'sticky-widget-ad-script';

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

  useEffect(() => {
    // When the widget becomes visible, inject the ad script.
    // When it's hidden or unmounts, clean up the script.
    if (isVisible) {
      // Prevent adding the script if it already exists
      if (document.getElementById(WIDGET_SCRIPT_ID)) {
        return;
      }

      const script = document.createElement('script');
      script.id = WIDGET_SCRIPT_ID;
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = '//hasteninto.com/250e245cdac94a542844825eb95939b0/invoke.js';
      
      document.body.appendChild(script);

      return () => {
        const adScript = document.getElementById(WIDGET_SCRIPT_ID);
        if (adScript) {
          adScript.remove();
        }
        
        // The ad script might populate the container. It's good practice to clear it on cleanup.
        const adContainer = document.getElementById('container-250e245cdac94a542844825eb95939b0');
        if (adContainer) {
            adContainer.innerHTML = '';
        }
      };
    }
  }, [isVisible]);


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
        {/* The ad script will find this div by its ID and inject the ad content */}
        <div id="container-250e245cdac94a542844825eb95939b0"></div>
      </div>
    </div>
  );
};

export default StickyWidget;
