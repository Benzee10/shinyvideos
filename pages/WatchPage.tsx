import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideoBySlug, getAllVideos, getAllVideosWithDynamic } from '../lib/videos';
import { Video } from '../types';
import Tag from '../components/Tag';
import { ClockIcon, EyeIcon, FolderIcon } from '../components/Icons';
import { trackView, getViews } from '../lib/analytics';
import { saveProgress, getProgress, clearProgress } from '../lib/progress';
import AdBanner from '../components/AdBanner';
import SmartCTAButton from '../components/SmartCTAButton';
import FakeDownloadButtons from '../components/FakeDownloadButtons';
import QualityUpgradePrompt from '../components/QualityUpgradePrompt';
import SocialProofNotifications from '../components/SocialProofNotifications';
import RelatedVideosCarousel from '../components/RelatedVideosCarousel';

const WatchPageSkeleton = () => (
  <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content Skeleton */}
      <div className="lg:w-3/4">
        {/* Ad Banner Skeleton */}
        <div className="min-h-[90px] w-full bg-gray-700 rounded-lg mb-4"></div>
        <div className="aspect-video mb-4 bg-gray-700 rounded-lg"></div>
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
      <div className="lg:w-1/4">
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

  const handleSmartLinkRedirect = () => {
    window.open('https://redirect01-z56s-git-main-benzee10000s-projects.vercel.app/', '_blank');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const videoElement = document.querySelector('video') as HTMLVideoElement;
      if (!videoElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (videoElement.paused) {
            videoElement.play();
          } else {
            videoElement.pause();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 10);
          break;
        case 'f':
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            videoElement.requestFullscreen();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [video]);

  useEffect(() => {
    setLoading(true);
    setVideo(null); // Reset video on slug change

    const loadVideo = async () => {
      if (slug) {
        // First try static videos for quick response
        let currentVideo = getVideoBySlug(slug);
        
        // If not found in static, load from dynamic files
        if (!currentVideo) {
          const allVideos = await getAllVideosWithDynamic();
          currentVideo = allVideos.find(v => v.slug === slug);
        }

        if(currentVideo){
          setVideo(currentVideo);

          // Track the view and update the state to re-render with the new count
          trackView(slug);
          setViewCount(getViews(slug));

          // Load all videos for related suggestions
          const allVideos = await getAllVideosWithDynamic();
          // Suggest related videos, prioritizing the same category
          const sameCategory = allVideos.filter(v => v.category === currentVideo.category && v.slug !== slug);
          const otherVideos = allVideos.filter(v => v.category !== currentVideo.category && v.slug !== slug);

          setRelatedVideos([...sameCategory, ...otherVideos].slice(0, 10));
        }
      }
      setLoading(false);
    };

    // Simulate fetch delay and load video
    const timer = setTimeout(loadVideo, 1000);

    // Scroll to top when slug changes
    window.scrollTo(0, 0);

    return () => clearTimeout(timer);
  }, [slug]);

  const upNextItems = useMemo(() => {
    const items: JSX.Element[] = relatedVideos.map(relatedVideo => (
      <Link to={`/video/${relatedVideo.slug}`} key={relatedVideo.slug} className="flex items-start gap-4 bg-gray-800/50 p-3 rounded-lg hover:bg-gray-700/70 transition-colors duration-200 group">
        <div className="w-2/5 flex-shrink-0">
          <img src={relatedVideo.thumbnail} alt={relatedVideo.title} className="rounded-md aspect-video object-cover" />
        </div>
        <div className="w-3/5">
          <h3 className="text-md font-semibold text-white group-hover:text-lime-300 transition-colors duration-200 line-clamp-2">{relatedVideo.title}</h3>
          <p className="text-sm text-gray-400 line-clamp-1">{relatedVideo.category}</p>
        </div>
      </Link>
    ));

    // Insert an ad at position 2 (index 1) if there are enough videos
    if (items.length > 1) {
      items.splice(1, 0, <AdBanner key="sidebar-ad" placement="watch-sidebar" />);
    }

    return items;
  }, [relatedVideos]);

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

  const isMp4 = video.videoUrl.toLowerCase().endsWith('.mp4');

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Ad Banner Above Video */}
          <div className="mb-4">
            <AdBanner placement="watch-top-banner" />
          </div>

          <div className="aspect-video mb-4 bg-black rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/10 relative">
            {isMp4 ? (
              <video
                src={video.videoUrl}
                controls
                poster={video.thumbnail}
                className="w-full h-full"
                onLoadedMetadata={(e) => {
                  const progress = getProgress(video.slug);
                  if (progress && progress.currentTime > 10) {
                    e.currentTarget.currentTime = progress.currentTime;
                  }
                }}
                onTimeUpdate={(e) => {
                  const currentTime = e.currentTarget.currentTime;
                  const duration = e.currentTarget.duration;
                  if (duration > 0) {
                    saveProgress(video.slug, currentTime, duration);
                  }
                }}
                onEnded={() => {
                  clearProgress(video.slug);
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={video.videoUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                loading="lazy"
              ></iframe>
            )}
          </div>

          {/* Download Buttons Below Video */}
          <div className="my-6">
            <FakeDownloadButtons onDownloadClick={handleSmartLinkRedirect} />
          </div>

          {/* Ad Banner Below Download Buttons */}
          <div className="my-6">
            <AdBanner placement="watch-bottom-banner" />
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
          
          {/* Premium Access CTA */}
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-lg border border-purple-500/30 mt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Want More Premium Content?</h3>
              <p className="text-gray-300 mb-4">Unlock exclusive videos and premium features</p>
              <SmartCTAButton text="Get VIP Access Now" variant="premium" size="lg" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/4">
          <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-lime-400 pl-4">Up Next</h2>
          <div className="space-y-4">
            {upNextItems.slice(0, 8)}
          </div>
        </div>
      </div>
      
      {/* Related Videos Carousel */}
      {relatedVideos.length > 0 && (
        <div className="mt-12">
          <RelatedVideosCarousel 
            videos={relatedVideos} 
            title="More Videos You'll Love"
            onVideoClick={handleSmartLinkRedirect}
          />
        </div>
      )}
      
      {/* Quality Upgrade Prompt */}
      <QualityUpgradePrompt onUpgradeClick={handleSmartLinkRedirect} />
      
      {/* Social Proof Notifications */}
      <SocialProofNotifications />
    </div>
  );
};

export default WatchPage;