import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllVideosWithDynamic, getAllTagsWithDynamic } from '../lib/videos';
import { getViews } from '../lib/analytics';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';
import VideoCardSkeleton from '../components/VideoCardSkeleton';
import SearchFilters from '../components/SearchFilters';

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentTag = searchParams.get('tag') || '';

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allVideos, tags] = await Promise.all([
          getAllVideosWithDynamic(),
          getAllTagsWithDynamic()
        ]);

        setVideos(allVideos);
        setFilteredVideos(allVideos);
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (term: string) => {
    applyFilters(term, getFiltersFromParams());
  };

  const handleFilter = (filters: { tags?: string[]; duration?: string; uploadDate?: string }) => {
    applyFilters(currentSearch, filters);
  };

  const getFiltersFromParams = () => ({
    tags: currentTag ? [currentTag] : undefined,
    duration: searchParams.get('duration') || undefined,
    uploadDate: searchParams.get('uploadDate') || undefined,
  });

  const applyFilters = (searchTerm: string, filters: { tags?: string[]; duration?: string; uploadDate?: string }) => {
    let filtered = [...videos];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(video =>
        filters.tags!.some(filterTag => video.tags.includes(filterTag))
      );
    }

    // Duration filter
    if (filters.duration) {
      filtered = filtered.filter(video => {
        const durationParts = video.duration.split(':');
        if (durationParts.length < 2) return false; // Handle potential malformed duration
        const mins = parseInt(durationParts[0], 10);
        if (isNaN(mins)) return false; // Handle potential NaN

        switch (filters.duration) {
          case 'short': return mins < 3;
          case 'medium': return mins >= 3 && mins <= 7;
          case 'long': return mins > 7;
          default: return true;
        }
      });
    }

    // Upload date filter (simplified - would need actual dates)
    if (filters.uploadDate) {
      // For demo purposes, just shuffle the order for different date filters
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    setFilteredVideos(filtered);
  };

  const renderSkeletons = (count: number) => (
    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex-shrink-0 w-72 sm:w-80">
          <VideoCardSkeleton />
        </div>
      ))}
    </div>
  );

  const isFiltered = currentSearch || currentTag || searchParams.get('duration') || searchParams.get('uploadDate');

  const getHeading = () => {
    if (currentSearch && currentTag) return `Search: "${currentSearch}" with tag "${currentTag}"`;
    if (currentSearch) return `Search Results: "${currentSearch}"`;
    if (currentTag) return `Videos tagged: "${currentTag}"`;
    return 'Filtered Results';
  };

  // Group videos by their first tag for display
  const getVideosByFirstTag = () => {
    const grouped: Record<string, Video[]> = {};

    for (const video of videos) {
      const firstTag = video.tags.length > 0 ? video.tags[0] : 'Untagged';
      if (!grouped[firstTag]) {
        grouped[firstTag] = [];
      }
      grouped[firstTag].push(video);
    }

    return grouped;
  };

  const groupedVideos = getVideosByFirstTag();
  const tags = Object.keys(groupedVideos);

  const renderedFilteredItems = filteredVideos.map(video => (
    <div key={video.slug} className="group">
      <VideoCard video={video} views={getViews(video.slug)} />
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
          availableTags={availableTags}
        />

        <div className="max-w-7xl mx-auto">
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
                tags.map(tag => (
                  <section key={`skeleton-tag-${tag}`}>
                    <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-cyan-400 pl-4">{tag}</h2>
                    {renderSkeletons(3)}
                  </section>
                ))
              ) : (
                tags.map(tag => (
                  <section key={tag}>
                    <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-cyan-400 pl-4">{tag}</h2>
                    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 horizontal-scroll">
                      {groupedVideos[tag].map(video => (
                        <div className="flex-shrink-0 w-72 sm:w-80" key={video.slug}>
                          <VideoCard video={video} views={getViews(video.slug)} />
                        </div>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;