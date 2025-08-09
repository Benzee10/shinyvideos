
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from './Icons';
import { getViews } from '../lib/analytics';

interface RelatedVideosCarouselProps {
  videos: Video[];
  title: string;
  onVideoClick?: () => void;
}

const RelatedVideosCarousel: React.FC<RelatedVideosCarouselProps> = ({ 
  videos, 
  title, 
  onVideoClick 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card plus gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (videos.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white border-l-4 border-cyan-400 pl-4">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors duration-200 touch-manipulation"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors duration-200 touch-manipulation"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video) => (
          <Link
            key={video.slug}
            to={`/video/${video.slug}`}
            onClick={onVideoClick}
            className="flex-shrink-0 w-72 sm:w-80 group transform transition-transform duration-300 hover:-translate-y-1 touch-manipulation"
          >
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-800 shadow-lg">
              <img
                src={video.thumbnail}
                alt={video.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZpbGw9IiM5Q0E5QkEiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pgo8L3N2Zz4K';
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                  <PlayIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center text-sm text-gray-400 mt-1 gap-2">
                <span>{getViews(video.slug).toLocaleString()} views</span>
                <span>•</span>
                <span>{video.category}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedVideosCarousel;
