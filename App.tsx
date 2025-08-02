
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import { FilmIcon, SearchIcon } from './components/Icons';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#111827] text-gray-200">
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-cyan-400 transition-colors duration-300">
                <FilmIcon className="h-8 w-8 text-cyan-400" />
                <span>VideoTube</span>
              </Link>

              {/* Search Bar */}
              <div className="relative flex-grow max-w-xs ml-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                      aria-label="Search videos"
                  />
              </div>
            </div>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
            <Route path="/video/:slug" element={<WatchPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
