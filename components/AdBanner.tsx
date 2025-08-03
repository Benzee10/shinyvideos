import React, { useEffect, useRef } from 'react';

type AdBannerProps = {
  type: 'banner' | 'sidebar' | 'card';
  className?: string;
};

// ================== START OF AD CODE CONFIGURATION ==================
const adConfigs = {
  banner: {
    key: '21fc2a87277a3f1a11b4bae6ebe8e4ae',
    format: 'iframe',
    height: 90,
    width: 728,
    params: {},
    src: '//hasteninto.com/21fc2a87277a3f1a11b4bae6ebe8e4ae/invoke.js',
  },
  sidebar: {
    key: 'a4c333fb004952693ea06fa3ed37a702',
    format: 'iframe',
    height: 90,
    width: 728,
    params: {},
    src: '//diarrhoeaeaglesunday.com/a4c333fb004952693ea06fa3ed37a702/invoke.js',
  },
  card: {
    key: 'f0b8205b82b5eaeada8196d14b514c1a',
    format: 'iframe',
    height: 50,
    width: 320,
    params: {},
    src: '//hasteninto.com/f0b8205b82b5eaeada8196d14b514c1a/invoke.js',
  }
};
// =================== END OF AD CODE CONFIGURATION ===================

const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adContainer = adContainerRef.current;
    if (!adContainer) return;

    // To prevent re-injecting scripts on re-renders, e.g., in React StrictMode.
    if (adContainer.hasChildNodes()) {
      return;
    }

    const config = adConfigs[type];
    if (!config) return;

    // ================== START OF AD CODE INJECTION ==================
    // Create the ad configuration script
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      atOptions = {
        'key' : '${config.key}',
        'format' : '${config.format}',
        'height' : ${config.height},
        'width' : ${config.width},
        'params' : ${JSON.stringify(config.params)}
      };
    `;

    // Create the main ad-loading script
    const adLoaderScript = document.createElement('script');
    adLoaderScript.type = 'text/javascript';
    adLoaderScript.src = config.src;
    adLoaderScript.async = true;

    // Append the scripts to the container div
    adContainer.appendChild(configScript);
    adContainer.appendChild(adLoaderScript);
    // =================== END OF AD CODE INJECTION ===================

    // Note: No cleanup is performed. Ad scripts often create global variables and
    // have other side effects that are difficult to clean up reliably.
  }, [type]);

  const baseClasses = "flex items-center justify-center bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-700 text-gray-500 overflow-hidden";
  
  // Adjust container sizes based on ad dimensions
  const typeClasses = {
    banner: 'min-h-[90px] w-full',
    sidebar: 'min-h-[90px] w-full', // The ad script is 728x90, we give it a 90px tall container. Width is responsive.
    card: 'min-h-[50px] w-full' // The ad script is 320x50. The parent card has correct width.
  };
  
  const adContainerDimensions = {
      banner: 'max-w-[728px] h-[90px]',
      sidebar: 'w-full h-[90px]', // The script might serve a responsive ad. We let the ad fill container width.
      card: 'max-w-[320px] h-[50px]'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {/* Container for the script-injected ad. */}
      {/* Third-party ad script will be injected into this div by the useEffect hook */}
      <div 
        ref={adContainerRef} 
        className={`flex justify-center items-center ${adContainerDimensions[type]}`}
      >
        {/* Ad content is dynamically injected here */}
      </div>
    </div>
  );
};

export default AdBanner;
