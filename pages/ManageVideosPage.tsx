
import React, { useState, useEffect } from 'react';
import { getAllVideos, getAllTags } from '../lib/videos';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';

const ManageVideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const allVideos = getAllVideos();
    const tags = getAllTags();
    setVideos(allVideos);
    setAvailableTags(tags);
  }, []);

  const filteredVideos = selectedTag === 'all' 
    ? videos 
    : videos.filter(video => video.tags.includes(selectedTag));

  const searchedVideos = filteredVideos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteVideo = (slug: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      // TODO: Implement delete functionality
      console.log('Deleting video:', slug);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center">
          Manage Videos
        </h1>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Tags</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{videos.length}</div>
            <div className="text-sm text-gray-400">Total Videos</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-400">{availableTags.length}</div>
            <div className="text-sm text-gray-400">Unique Tags</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{searchedVideos.length}</div>
            <div className="text-sm text-gray-400">Filtered Results</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(videos.reduce((sum, v) => {
                const [mins, secs] = v.duration.split(':').map(Number);
                return sum + (mins * 60) + (secs || 0);
              }, 0) / 60)}m
            </div>
            <div className="text-sm text-gray-400">Total Duration</div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchedVideos.map(video => (
            <div key={video.slug} className="relative group">
              <VideoCard video={video} views={0} />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteVideo(video.slug)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
                  title="Delete video"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {searchedVideos.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-300">No videos found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter settings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageVideosPage;
