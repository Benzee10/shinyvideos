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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
    updateSearchParams({ search: term });
  };

  const updateSearchParams = (params: Record<string, string | undefined>, clearAll: boolean = false) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (clearAll) {
      newSearchParams.forEach((_, key) => {
        if (!['search'].includes(key)) {
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
    console.log("Updated search params:", newSearchParams.toString());
  };

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
      {/* Search Bar */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Search videos, actresses, or tags..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-gray-900/70 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
        />
      </div>
    </div>
  );
};

export default SearchFilters;