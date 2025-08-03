import React, { useEffect, useRef } from 'react';

type AdBannerProps = {
  type: 'banner' | 'sidebar' | 'card';
  className?: string;
};

const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only inject the ad script for the 'banner' type.
    if (type !== 'banner' || !adContainerRef.current) return;

    // To prevent re-injecting scripts on re-renders, e.g., in React StrictMode.
    if (adContainerRef.current.hasChildNodes()) {
      return;
    }

    const adContainer = adContainerRef.current;
    
    // ================== START OF AD CODE LOGIC ==================
    // Create the ad configuration script
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.text = `
      atOptions = {
        'key' : '21fc2a87277a3f1a11b4bae6ebe8e4ae',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // Create the main ad-loading script
    const adLoaderScript = document.createElement('script');
    adLoaderScript.type = 'text/javascript';
    adLoaderScript.src = '//hasteninto.com/21fc2a87277a3f1a11b4bae6ebe8e4ae/invoke.js';
    adLoaderScript.async = true;

    // Append the scripts to the container div
    adContainer.appendChild(configScript);
    adContainer.appendChild(adLoaderScript);
    // =================== END OF AD CODE LOGIC ===================

    // Note: No cleanup is performed. Ad scripts often create global variables and
    // have other side effects that are difficult to clean up reliably. Removing
    // the script tags themselves might not stop the ad from running or could
    // lead to errors if the ad logic is still trying to execute.
  }, [type]);

  const baseClasses = "flex items-center justify-center bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-700 text-gray-500 overflow-hidden";
  
  const typeClasses = {
    banner: 'min-h-[90px] w-full',
    sidebar: 'min-h-[90px] w-full',
    card: 'aspect-video w-full'
  };

  if (type === 'banner') {
    // This container is for the script-injected banner ad.
    // The ad script specifies 728x90 dimensions. This container will center it.
    return (
      <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
        {/* ================== START OF AD CODE ================== */}
        <div ref={adContainerRef} className="flex justify-center items-center w-full max-w-[728px] h-[90px]">
          {/* Third-party ad script will be injected here by the useEffect hook */}
        </div>
        {/* =================== END OF AD CODE =================== */}
      </div>
    );
  }

  // Fallback for other ad types ('sidebar', 'card') - Keep the existing placeholder
  const adContentStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2937', // bg-gray-800 from Tailwind config
    color: 'white',
    textAlign: 'center',
    padding: '1rem',
    fontFamily: "'Inter', sans-serif"
  };
  
  const headingStyle: React.CSSProperties = {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#22d3ee', // cyan-400
    marginBottom: '0.5rem'
  };
  
  const textStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#d1d5db', // gray-300
    marginBottom: '1rem'
  };

  const buttonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.5rem 1.5rem',
    backgroundColor: '#06b6d4', // cyan-500
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {/* This is a placeholder for non-banner ad types */}
      <div style={adContentStyle}>
        <div>
          <h3 style={headingStyle}>Premium Ad Slot</h3>
          <p style={textStyle}>Reach your audience with our targeted advertising solutions.</p>
          <a
            href="#" // Placeholder for advertiser link
            target="_blank"
            rel="noopener noreferrer"
            style={buttonStyle}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#0891b2')} // cyan-600
            onMouseOut={e => (e.currentTarget.style.backgroundColor = '#06b6d4')} // cyan-500
          >
            Advertise With Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
