
import React from 'react';

interface TagProps {
  text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {
  const colors = [
    'bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/70',
    'bg-lime-900/50 text-lime-300 hover:bg-lime-800/70',
    'bg-pink-900/50 text-pink-300 hover:bg-pink-800/70',
    'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800/70',
    'bg-amber-900/50 text-amber-300 hover:bg-amber-800/70',
  ];
  
  // Simple hash to get a consistent color for a tag
  const colorClass = colors[text.length % colors.length];

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer ${colorClass}`}>
      #{text}
    </span>
  );
};

export default Tag;
