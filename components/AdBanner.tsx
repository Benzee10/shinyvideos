import React, { useEffect, useRef } from 'react';

type AdBannerProps = {
  type: 'banner' | 'sidebar' | 'card';
  className?: string;
};

const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  const baseClasses = "bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-700 text-gray-500";
  
  const typeClasses = {
    banner: 'min-h-[90px] w-full flex items-center justify-center overflow-hidden',
    sidebar: 'flex items-center justify-center min-h-[90px] w-full',
    card: 'flex items-center justify-center aspect-video w-full'
  };

  const textClasses = {
      banner: 'text-lg',
      sidebar: 'text-md',
      card: 'text-md'
  }

  useEffect(() => {
    // We only want to apply the ad script to banners, and only once per mount.
    if (type === 'banner' && adContainerRef.current && adContainerRef.current.childElementCount === 0) {
      
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      // Using innerHTML is fine here as we control the string content.
      configScript.innerHTML = `
        atOptions = {
          'key' : '21fc2a87277a3f1a11b4bae6ebe8e4ae',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;

      const adScript = document.createElement('script');
      adScript.type = 'text/javascript';
      adScript.src = '//hasteninto.com/21fc2a87277a3f1a11b4bae6ebe8e4ae/invoke.js';
      
      adContainerRef.current.appendChild(configScript);
      adContainerRef.current.appendChild(adScript);
    }
  }, [type]);

  return (
    <div
      ref={adContainerRef}
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
      // Add a key that changes with type to ensure React re-mounts the component
      // when the ad type changes, which is important for the useEffect logic.
      key={type} 
    >
      {type !== 'banner' && (
        <span className={`font-semibold ${textClasses[type]}`}>Advertisement</span>
      )}
    </div>
  );
};

export default AdBanner;
