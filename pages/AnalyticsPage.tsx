
import React, { useState, useEffect } from 'react';
import { getAllVideos, getVideosByCategory } from '../lib/videos';
import { getStoredProgress } from '../lib/progress';
import { getFavorites } from '../lib/favorites';

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalWatchTime: 0,
    favoriteCount: 0,
    categoryStats: {} as Record<string, number>,
    popularTags: [] as { tag: string; count: number }[],
    recentActivity: [] as any[]
  });

  useEffect(() => {
    const videos = getAllVideos();
    const categorized = getVideosByCategory();
    const progress = getStoredProgress();
    const favorites = getFavorites();

    // Calculate stats
    const totalViews = Object.keys(progress).length;
    const totalWatchTime = Object.values(progress).reduce((sum, p) => sum + p.currentTime, 0);
    
    // Category stats
    const categoryStats: Record<string, number> = {};
    Object.keys(categorized).forEach(category => {
      categoryStats[category] = categorized[category].length;
    });

    // Popular tags
    const tagCounts: Record<string, number> = {};
    videos.forEach(video => {
      video.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const popularTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setAnalytics({
      totalVideos: videos.length,
      totalViews,
      totalWatchTime: Math.round(totalWatchTime / 60), // in minutes
      favoriteCount: favorites.length,
      categoryStats,
      popularTags,
      recentActivity: Object.values(progress)
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
    });
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center">
          Analytics Dashboard
        </h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Videos</h3>
            <p className="text-3xl font-bold mt-2">{analytics.totalVideos}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium opacity-90">Total Views</h3>
            <p className="text-3xl font-bold mt-2">{analytics.totalViews}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium opacity-90">Watch Time</h3>
            <p className="text-3xl font-bold mt-2">{analytics.totalWatchTime}m</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium opacity-90">Favorites</h3>
            <p className="text-3xl font-bold mt-2">{analytics.favoriteCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tag Distribution */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Top Tags</h2>
            <div className="space-y-3">
              {Object.entries(analytics.tagStats).slice(0, 10).map(([tag, count]) => (
                <div key={tag} className="flex justify-between items-center">
                  <span className="text-gray-300">{tag}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-cyan-500 h-2 rounded-full" 
                        style={{ width: `${(count / analytics.totalVideos) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {analytics.popularTags.map(({ tag, count }) => (
                <span 
                  key={tag} 
                  className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <span className="bg-gray-600 text-xs px-1.5 py-0.5 rounded-full">{count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
