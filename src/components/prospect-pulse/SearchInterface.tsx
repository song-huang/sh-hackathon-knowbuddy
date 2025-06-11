import React, { useState } from 'react';

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  error?: string | null;
}

export default function SearchInterface({ onSearch, error }: SearchInterfaceProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const setExample = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
      <div className="w-full max-w-2xl">
        {/* Main Title */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Know Your
            <span className="bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
              {' '}Prospects
            </span>
            <br />In Seconds
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-lg mx-auto">
            AI-powered sales intelligence that transforms company names into actionable insights
          </p>
        </div>

        {/* Search Interface */}
        <div className="glass-effect rounded-2xl p-8 shadow-2xl ai-glow animate-scale-in">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Single Input Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 256 256">
                  <path d="m229.66,218.34-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter company name or website (e.g., KFC, McDonald's, starbucks.com)"
                className="w-full pl-12 pr-4 py-3.5 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                autoComplete="off"
              />
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={!query.trim()}
              className="w-full bg-[#ff6b35] hover:bg-[#e55a2b] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2 text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
                <path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z" />
              </svg>
              <span>Analyze with AI</span>
            </button>

            {/* Quick Examples */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-gray-500">Try:</span>
              <button
                type="button"
                onClick={() => setExample('KFC Singapore')}
                className="text-sm text-[#ff6b35] hover:text-[#e55a2b] font-medium"
              >
                KFC Singapore
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={() => setExample('Starbucks')}
                className="text-sm text-[#ff6b35] hover:text-[#e55a2b] font-medium"
              >
                Starbucks
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={() => setExample("McDonald's Malaysia")}
                className="text-sm text-[#ff6b35] hover:text-[#e55a2b] font-medium"
              >
                McDonald's Malaysia
              </button>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-slide-up">
          <div className="text-center text-white/80">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
                <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Instant Analysis</h3>
            <p className="text-sm">Get comprehensive company insights in under 30 seconds</p>
          </div>

          <div className="text-center text-white/80">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
                <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Smart Conversation Starters</h3>
            <p className="text-sm">AI-generated talking points tailored to each prospect</p>
          </div>

          <div className="text-center text-white/80">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256">
                <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Multi-Source Data</h3>
            <p className="text-sm">Website, social media, news, and review aggregation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
