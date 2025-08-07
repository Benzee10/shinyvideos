
import React, { useState } from 'react';

interface SearchFiltersProps {
  onSearch: (term: string) => void;
  onFilter: (filters: { category?: string; tags?: string[]; duration?: string }) => void;
  categories: string[];
  availableTags: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  onSearch, 
  onFilter, 
  categories, 
  availableTags 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  const handleFilterChange = () => {
    onFilter({
      category: selectedCategory || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      duration: durationFilter || undefined
    });
  };

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setDurationFilter('');
    onFilter({});
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
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                handleFilterChange();
              }}
              className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-2 px-3 text-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

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
              <option value="short">Short (< 3 min)</option>
              <option value="medium">Medium (3-7 min)</option>
              <option value="long">Long (> 7 min)</option>
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
                    handleFilterChange();
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
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
