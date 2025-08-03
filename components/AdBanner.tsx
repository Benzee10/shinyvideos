import React from 'react';

// NOTE TO DEVELOPER: This is where you place your ad link and a default image.
const SMART_LINK_URL = 'https://your-smart-link-goes-here.com'; // <-- REPLACE WITH YOUR SMART LINK
const DEFAULT_AD_IMAGE_URL = 'https://i.pinimg.com/originals/4e/7b/56/4e7b56a5350df80d54ec22d682b18e29.gif';

type AdBannerProps = {
  type: 'banner' | 'sidebar' | 'card';
  className?: string;
  imageUrl?: string; // Optional prop for custom image
};

const AdBanner: React.FC<AdBannerProps> = ({ type, className = '', imageUrl = DEFAULT_AD_IMAGE_URL }) => {
  // Base styling for the ad container.
  const baseClasses = "bg-gray-800/20 rounded-lg overflow-hidden";
  
  // Specific styling for each ad type to control dimensions.
  const typeClasses = {
    banner: 'min-h-[90px] w-full',
    sidebar: 'min-h-[90px] w-full',
    card: 'aspect-video w-full'
  };

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${className}`}
      // Add imageUrl to key to ensure React re-mounts the component if the image changes
      key={`${type}-${imageUrl}`} 
    >
      <a
        href={SMART_LINK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Advertisement"
        className="block w-full h-full"
      >
        <img
          src={imageUrl}
          alt="Advertisement"
          className="w-full h-full object-cover"
        />
      </a>
    </div>
  );
};

export default AdBanner;
