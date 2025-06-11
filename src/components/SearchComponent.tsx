'use client';

import { useState } from 'react';
import { SearchComponentProps } from '@/types';

export default function SearchComponent({ 
  onSearch, 
  loading = false, 
  placeholder = "Enter company name or website..." 
}: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading) {
      onSearch(query.trim());
      
      // Add to recent searches
      const updated = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const handleRecentSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    onSearch(searchTerm);
  };

  // Load recent searches on component mount
  useState(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {/* Recent Searches */}
      {recentSearches.length > 0 && !loading && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearch(search)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Examples */}
      {!loading && query === '' && (
        <div className="text-center text-gray-500">
          <p className="mb-3">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'McDonald\'s',
              'Starbucks',
              'dominos.com',
              'Local Pizza Restaurant'
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearch(example)}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
