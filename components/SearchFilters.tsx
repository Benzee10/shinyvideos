import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SearchFiltersProps {
  onSearch: (term: string) => void;
  onFilter: (filters: { tags?: string[]; duration?: string; uploadDate?: string }) => void;
  availableTags: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onSearch, 
  onFilter, 
  availableTags 
}) => {
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recent');
  const [durationFilter, setDurationFilter] = useState(searchParams.get('duration') || '');
  const [uploadDateFilter, setUploadDateFilter] = useState(searchParams.get('uploadDate') || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
    updateSearchParams({ search: term });
  };

  const handleFilterChange = () => {
    onFilter({
      tags: selectedTag ? [selectedTag] : undefined,
      duration: durationFilter || undefined,
      uploadDate: uploadDateFilter || undefined,
    });
    updateSearchParams({
      tag: selectedTag || undefined,
      duration: durationFilter || undefined,
      uploadDate: uploadDateFilter || undefined,
      sort: sortBy || undefined
    });
  };

  const toggleTag = (tag: string) => {
    const updatedTag = selectedTag === tag ? '' : tag; // Simple toggle for one tag
    setSelectedTag(updatedTag);
    onFilter({
      tags: updatedTag ? [updatedTag] : undefined,
      duration: durationFilter || undefined,
      uploadDate: uploadDateFilter || undefined,
    });
    updateSearchParams({ tag: updatedTag || undefined });
  };

  const clearFilters = () => {
    setSelectedTag('');
    setDurationFilter('');
    setUploadDateFilter('');
    setSortBy('recent');
    onFilter({});
    updateSearchParams({}, true); // Clear all search params
  };

  const updateSearchParams = (params: Record<string, string | undefined>, clearAll: boolean = false) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (clearAll) {
      newSearchParams.forEach((_, key) => {
        if (!['search'].includes(key)) { // Keep search param if present
          newSearchParams.delete(key);
        }
      });
    } else {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          newSearchParams.set(key, value);
        } else {
          newSearchParams.delete(key);
        }
      });
    }
    // Use navigate or history.push if you are in a routing context that supports it
    // For this example, we'll assume a basic update mechanism is available or just log
    // In a real React Router app, you would use `navigate` or similar
    console.log("Updated search params:", newSearchParams.toString());
  };


  return (
    <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search videos, actresses, or tags..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Toggle Advanced Filters */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium mb-4"
      >
        {isExpanded ? '▼' : '▶'} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="space-y-4">
          

          {/* Duration Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
            <select
              value={durationFilter}
              onChange={(e) => {
                setDurationFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white"
            >
              <option value="">Any Duration</option>
              <option value="short">Short (&lt; 3 min)</option>
              <option value="medium">Medium (3-7 min)</option>
              <option value="long">Long (&gt; 7 min)</option>
            </select>
          </div>

          {/* Upload Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Upload Date</label>
            <select
              value={uploadDateFilter}
              onChange={(e) => {
                setUploadDateFilter(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>


          {/* Tags Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {availableTags.slice(0, 20).map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    toggleTag(tag);
                    // handleFilterChange(); // Moved logic inside toggleTag
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTag === tag // Changed to check against selectedTag state
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="text-red-400 hover:text-red-300 text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;