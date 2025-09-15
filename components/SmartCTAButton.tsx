
import React from 'react';

interface SmartCTAButtonProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SmartCTAButton: React.FC<SmartCTAButtonProps> = ({ 
  text = "Get Premium Access", 
  variant = 'primary',
  size = 'md',
  className = '' 
}) => {
  const smartLink = "https://whatsappad.vercel.app/";
  
  const baseClasses = "font-bold rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer text-center";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/25",
    secondary: "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg hover:shadow-pink-500/25",
    premium: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg hover:shadow-yellow-500/25"
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const handleClick = () => {
    window.open(smartLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {text}
    </button>
  );
};

export default SmartCTAButton;
