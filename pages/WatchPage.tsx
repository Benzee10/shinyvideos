import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideoBySlug, getAllVideos } from '../lib/videos';
import { Video } from '../types';
import Tag from '../components/Tag';
import { ClockIcon, EyeIcon, FolderIcon } from '../components/Icons';
import { trackView, getViews } from '../lib/analytics';

const WatchPageSkeleton = () => (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content Skeleton */}
      <div className="lg:w-2/3">
        <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-700 rounded-lg"></div>
        <div className="h-8 w-3/4 bg-gray-700 rounded mb-4"></div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
          <div className="h-5 w-24 bg-gray-700 rounded"></div>
          <div className="h-5 w-20 bg-gray-700 rounded"></div>
          <div className="h-5 w-28 bg-gray-700 rounded"></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="h-7 w-20 bg-gray-700 rounded-full"></div>
          <div className="h-7 w-24 bg-gray-700 rounded-full"></div>
          <div className="h-7 w-16 bg-gray-700 rounded-full"></div>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <div className="h-6 w-40 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="lg:w-1/3">
        <div className="h-8 w-32 mb-4 bg-gray-700 rounded"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 p-3">
              <div className="w-2/5 h-20 bg-gray-700 rounded-md"></div>
              <div className="w-3/5 space-y-2">
                <div className="h-5 bg-gray-700 rounded"></div>
                <div className="h-5 w-5/6 bg-gray-700 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


const WatchPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setVideo(null); // Reset video on slug change
    
    // Simulate fetch
    const timer = setTimeout(() => {
      if (slug) {
        const currentVideo = getVideoBySlug(slug);
        if(currentVideo){
          setVideo(currentVideo);

          // Track the view and update the state to re-render with the new count
          trackView(slug);
          setViewCount(getViews(slug));
          
          const allVideos = getAllVideos();
          // Suggest related videos, prioritizing the same category
          const sameCategory = allVideos.filter(v => v.category === currentVideo.category && v.slug !== slug);
          const otherVideos = allVideos.filter(v => v.category !== currentVideo.category && v.slug !== slug);
          
          setRelatedVideos([...sameCategory, ...otherVideos].slice(0, 5));
        }
      }
      setLoading(false);
    }, 1000);

    // Scroll to top when slug changes
    window.scrollTo(0, 0);

    return () => clearTimeout(timer);
  }, [slug]);

  if (loading) {
    return <WatchPageSkeleton />;
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white text-2xl">Video not found.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-2/3">
          <div className="aspect-w-16 aspect-h-9 mb-4 bg-black rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/10">
            <iframe
              src={video.videoUrl}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-3">{video.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-5 w-5" />
              <span>{video.category}</span>
            </div>
            <span className="text-gray-600 hidden sm:inline">•</span>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5" />
              <span>{video.duration}</span>
            </div>
            {viewCount !== null && (
              <>
                <span className="text-gray-600 hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                  <EyeIcon className="h-5 w-5" />
                  <span>{viewCount.toLocaleString()} views</span>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {video.tags.map(tag => (
              <Link to={`/?tag=${tag}`} key={tag}>
                <Tag text={tag} />
              </Link>
            ))}
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">Description</h2>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{video.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-lime-400 pl-4">Up Next</h2>
          <div className="space-y-4">
            {relatedVideos.map(relatedVideo => (
              <Link to={`/video/${relatedVideo.slug}`} key={relatedVideo.slug} className="flex items-start gap-4 bg-gray-800/50 p-3 rounded-lg hover:bg-gray-700/70 transition-colors duration-200 group">
                <div className="w-2/5 flex-shrink-0">
                  <img src={relatedVideo.thumbnail} alt={relatedVideo.title} className="rounded-md aspect-video object-cover" />
                </div>
                <div className="w-3/5">
                  <h3 className="text-md font-semibold text-white group-hover:text-lime-300 transition-colors duration-200 line-clamp-2">{relatedVideo.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1">{relatedVideo.category}</p>
                </div>
              </a >
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;