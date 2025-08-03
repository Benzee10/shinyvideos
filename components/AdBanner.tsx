
import React, { useEffect, useRef } from 'react';

// Using a more specific placement type to distinguish ad slots
type AdPlacement = 'home-banner' | 'watch-top-banner' | 'watch-bottom-banner' | 'watch-sidebar' | 'home-card';

type AdBannerProps = {
  placement: AdPlacement;
  className?: string;
};

// ================== START OF AD CODE CONFIGURATION ==================
const adConfigs: Record<AdPlacement, any> = {
  'home-banner': {
    type: 'atOptions',
    key: '21fc2a87277a3f1a11b4bae6ebe8e4ae',
    format: 'iframe', height: 90, width: 728, params: {},
    src: '//hasteninto.com/21fc2a87277a3f1a11b4bae6ebe8e4ae/invoke.js',
  },
  'watch-top-banner': {
    type: 'atOptions',
    key: '21fc2a87277a3f1a11b4bae6ebe8e4ae',
    format: 'iframe', height: 90, width: 728, params: {},
    src: '//hasteninto.com/21fc2a87277a3f1a11b4bae6ebe8e4ae/invoke.js',
  },
  'watch-bottom-banner': {
    type: 'atOptions',
    key: 'a4c333fb004952693ea06fa3ed37a702',
    format: 'iframe', height: 90, width: 728, params: {},
    src: '//diarrhoeaeaglesunday.com/a4c333fb004952693ea06fa3ed37a702/invoke.js',
  },
  'watch-sidebar': {
    type: 'invoke',
    src: '//hasteninto.com/250e245cdac94a542844825eb95939b0/invoke.js',
    containerId: 'container-250e245cdac94a542844825eb95939b0',
    height: 250, width: 300,
  },
  'home-card': {
    type: 'atOptions',
    key: 'f0b8205b82b5eaeada8196d14b514c1a',
    format: 'iframe', height: 50, width: 320, params: {},
    src: '//hasteninto.com/f0b8205b82b5eaeada8196d14b514c1a/invoke.js',
  }
};
// =================== END OF AD CODE CONFIGURATION ===================

const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const config = adConfigs[placement];

  useEffect(() => {
    const adContainer = adContainerRef.current;
    if (!adContainer || adContainer.hasChildNodes()) {
      return;
    }
    
    // Clear container to be safe
    adContainer.innerHTML = '';

    // ================== START OF AD CODE INJECTION ==================
    if (config.type === 'atOptions') {
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.text = `atOptions = {'key' : '${config.key}','format' : '${config.format}','height' : ${config.height},'width' : ${config.width},'params' : ${JSON.stringify(config.params || {})}};`;

      const adLoaderScript = document.createElement('script');
      adLoaderScript.type = 'text/javascript';
      adLoaderScript.src = config.src;
      adLoaderScript.async = true;

      adContainer.appendChild(configScript);
      adContainer.appendChild(adLoaderScript);
    } else if (config.type === 'invoke') {
      const containerDiv = document.createElement('div');
      containerDiv.id = config.containerId;
      
      const adLoaderScript = document.createElement('script');
      adLoaderScript.async = true;
      adLoaderScript.setAttribute('data-cfasync', 'false');
      adLoaderScript.src = config.src;
      
      adContainer.appendChild(containerDiv);
      adContainer.appendChild(adLoaderScript);
    }
    // =================== END OF AD CODE INJECTION ===================
    
    // Cleanup on unmount to prevent memory leaks in a single-page app
    return () => {
      if (adContainer) {
        adContainer.innerHTML = '';
      }
    };
  }, [placement, config]);

  const baseClasses = "flex items-center justify-center bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-700 text-gray-500 overflow-hidden";
  
  // Outer container styles for layout within the page
  const placementContainerClasses: Record<AdPlacement, string> = {
    'home-banner': 'w-full',
    'watch-top-banner': 'w-full',
    'watch-bottom-banner': 'w-full',
    'watch-sidebar': 'w-full', // The parent controls width
    'home-card': 'w-full', // The parent grid cell controls width
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
        ref={adContainerRef} 
        style={adDimensions}
        className="flex justify-center items-center"
      >
        {/* Ad content is dynamically injected here */}
      </div>
    </div>
  );
};

export default AdBanner;
