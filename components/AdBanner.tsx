import React from 'react';

type AdBannerProps = {
  type: 'banner' | 'sidebar' | 'card';
  className?: string;
};

const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const baseClasses = "flex items-center justify-center bg-gray-800/20 rounded-lg border-2 border-dashed border-gray-700 text-gray-500";
  
  const typeClasses = {
    banner: 'min-h-[90px] w-full',
    sidebar: 'min-h-[90px] w-full',
    card: 'aspect-video w-full'
  };

  const textClasses = {
      banner: 'text-lg',
      sidebar: 'text-md',
      card: 'text-md'
  }

  // To implement ads, you can either:
  // 1. Paste your ad code (like a script tag) directly inside the div below.
  //
  // 2. Or, for more complex script-based ads that need to be dynamically loaded,
  //    you can use a React effect (useEffect hook) to append the script to the DOM.
  //    This is a safer approach for many ad networks to avoid issues with React's rendering lifecycle.

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {<script type="text/javascript">
	atOptions = {
		'key' : '21fc2a87277a3f1a11b4bae6ebe8e4ae',
		'format' : 'iframe',
		'height' : 90,
		'width' : 728,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//hasteninto.com/21fc2a87277a3f1a11b4bae6ebe8e4ae/invoke.js"></script>}
      <span className={`font-semibold ${textClasses[type]}`}>Advertisement</span>
       {<script type="text/javascript">
	atOptions = {
		'key' : '21fc2a87277a3f1a11b4bae6ebe8e4ae',
		'format' : 'iframe',
		'height' : 90,
		'width' : 728,
		'params' : {}
	};
</script>
<script type="text/javascript" src="//hasteninto.com/21fc2a87277a3f1a11b4bae6ebe8e4ae/invoke.js"></script>}
    </div>
  );
};

export default AdBanner;
