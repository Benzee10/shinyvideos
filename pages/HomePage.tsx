import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllVideos, getVideosByCategory, getAllVideosWithDynamic, getVideosByCategoryWithDynamic } from '../lib/videos';
import VideoCard from '../components/VideoCard';
import { ChevronDownIcon } from '../components/Icons';
import { getViews } from '../lib/analytics';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import AdBanner from '../components/AdBanner';
import SmartCTAButton from '../components/SmartCTAButton';
import RelatedVideosCarousel from '../components/RelatedVideosCarousel'; // Assuming this component exists
import SocialProofNotifications from '../components/SocialProofNotifications'; // Assuming this component exists

interface HomePageProps {
  searchQuery: string;
}

const categoryColors: Record<string, string> = {
  'Sasha E': 'border-red-400',
  'Melissa Stratton': 'border-green-400',
  'Nikoleta': 'border-indigo-50',
};


const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const [loading, setLoading] = useState(true);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [categorizedVideos, setCategorizedVideos] = useState<Record<string, Video[]>>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  const handleSmartLinkRedirect = () => {
    window.open('https://redirect01-z56s-git-main-benzee10000s-projects.vercel.app/', '_blank');
  };

  // Shuffle videos for the carousel
  const shuffledVideos = useMemo(() => {
    const videos = [...allVideos];
    for (let i = videos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [videos[i], videos[j]] = [videos[j], videos[i]];
    }
    return videos;
  }, [allVideos]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const [videos, categorized] = await Promise.all([
          getAllVideosWithDynamic(),
          getVideosByCategoryWithDynamic()
        ]);
        setAllVideos(videos);
        setCategorizedVideos(categorized);
      } catch (error) {
        console.error('Error loading videos:', error);
        // Fallback to static videos
        setAllVideos(getAllVideos());
        setCategorizedVideos(getVideosByCategory());
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const categories = useMemo(() => Object.keys(categorizedVideos).sort((a,b) => a === 'User Uploads' ? 1 : b === 'User Uploads' ? -1 : a.localeCompare(b)), [categorizedVideos]);

  const recentVideos = useMemo(() => {
    return [...allVideos]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 5);
  }, [allVideos]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allVideos.forEach(video => {
      video.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [allVideos]);

  const handleTagClick = (tag: string | null) => {
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  const filteredVideos = useMemo(() => {
    let videos = allVideos;

    if (selectedTag) {
      videos = videos.filter(video => video.tags.includes(selectedTag));
    }

    const lowercasedQuery = searchQuery.toLowerCase().trim();
    if (lowercasedQuery) {
       videos = videos.filter(video => 
        video.title.toLowerCase().includes(lowercasedQuery) ||
        video.description.toLowerCase().includes(lowercasedQuery) ||
        video.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
    }

    return videos;
  }, [searchQuery, allVideos, selectedTag]);

  const getHeading = () => {
    if (searchQuery) {
      return `Results for "${searchQuery}"`;
    }
    if(selectedTag){
      return `Videos tagged #${selectedTag}`;
    }
    return 'All Videos';
  }

  const isFiltered = searchQuery || selectedTag;

  const renderedFilteredItems = useMemo(() => {
    if (!isFiltered) return [];

    const items: JSX.Element[] = [];
    filteredVideos.forEach((video, index) => {
        items.push(<VideoCard key={video.slug} video={video} views={getViews(video.slug)} />);
        // Insert an ad after the 4th video, then every 8 videos after that.
        if (index === 3 || (index > 3 && (index - 3) % 8 === 0)) {
            items.push(<AdBanner key={`ad-${index}`} placement="home-card" />);
        }
    });
    return items;
  }, [filteredVideos, isFiltered]);

  const renderSkeletons = (count: number) => (
    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 horizontal-scroll">
      {[...Array(count)].map((_, index) => (
        <div className="flex-shrink-0 w-72 sm:w-80" key={`skeleton-${index}`}>
          <VideoCardSkeleton />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Recent & Trending Section */}
      {!isFiltered && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-pink-400 pl-4">Recent & Trending</h2>
          {loading ? renderSkeletons(5) : (
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 horizontal-scroll">
              {recentVideos.map(video => (
                <div className="flex-shrink-0 w-72 sm:w-80" key={`recent-${video.slug}`}>
                  <VideoCard video={video} views={getViews(video.slug)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ad Banner */}
      {!isFiltered && !loading && (
        <div className="mb-12">
          <AdBanner placement="home-banner" />
        </div>
      )}

      {/* Premium Access Section */}
      {!isFiltered && !loading && (
        <div className="mb-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-xl border border-cyan-500/20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">🔥 Premium Members Only</h2>
            <p className="text-xl text-gray-300 mb-6">Access exclusive content, HD quality, and ad-free browsing</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* This button can be repurposed for Video Quality Upgrade Prompts */}
              <SmartCTAButton text="Upgrade to HD/4K" variant="primary" size="lg" onClick={handleSmartLinkRedirect} />
              <SmartCTAButton text="Start Free Trial" variant="secondary" size="lg" />
            </div>
          </div>
        </div>
      )}

       {/* Tag Filter Bar */}
      <div className="mb-8 pb-4 border-b border-gray-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleTagClick(null)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
              !selectedTag
                ? 'bg-cyan-500 text-white shadow-md'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All Videos
          </button>
          <button
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            aria-controls="tag-list"
            aria-expanded={isTagsExpanded}
          >
            <span>{isTagsExpanded ? 'Hide Tags' : 'Show Tags'}</span>
            <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isTagsExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div
          id="tag-list"
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isTagsExpanded ? 'max-h-96 mt-4' : 'max-h-0'}`}
        >
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-800">
            {allTags.map(tag => (
              <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
                    selectedTag === tag
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Now Carousel */}
      {!isFiltered && !loading && (
        <RelatedVideosCarousel
          videos={shuffledVideos.slice(0, 12)}
          title="🔥 Trending Now"
          onVideoClick={handleSmartLinkRedirect}
        />
      )}

      {isFiltered ? (
        <>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 border-b-2 border-cyan-400 pb-3">
            {getHeading()}
          </h1>
          {renderedFilteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {renderedFilteredItems}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-300">No videos found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter settings.</p>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-12">
          {loading ? (
            categories.map(category => (
              <section key={`skeleton-cat-${category}`}>
                <h2 className={`text-2xl font-bold text-white mb-4 border-l-4 ${categoryColors[category] || 'border-gray-400'} pl-4`}>{category}</h2>
                {renderSkeletons(categorizedVideos[category]?.length || 3)}
              </section>
            ))
          ) : (
            categories.map(category => (
              <section key={category}>
                <h2 className={`text-2xl font-bold text-white mb-4 border-l-4 ${categoryColors[category] || 'border-gray-400'} pl-4`}>{category}</h2>
                <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 horizontal-scroll">
                  {categorizedVideos[category].map(video => (
                    <div className="flex-shrink-0 w-72 sm:w-80" key={`${category}-${video.slug}`}>
                      <VideoCard video={video} views={getViews(video.slug)} />
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      )}

      {/* Social Proof Notifications */}
      <SocialProofNotifications />
    </div>
  );
};

export default HomePage;