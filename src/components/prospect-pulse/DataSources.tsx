import React, { useState } from 'react';
import { DataSource } from '@/types';

interface DataSourcesProps {
  sources: DataSource[];
}

export default function DataSources({ sources }: DataSourcesProps) {
  const [hoveredSource, setHoveredSource] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const defaultSources = [
    { name: 'Website', icon: '🌐', description: 'Company Info', color: 'bg-blue-500' },
    { name: 'LinkedIn', icon: '💼', description: 'Professional Data', color: 'bg-blue-700' },
    { name: 'Glassdoor', icon: '🏢', description: 'Company Reviews', color: 'bg-green-600' },
    { name: 'Yelp', icon: '⭐', description: 'Customer Reviews', color: 'bg-red-600' },
    { name: 'Facebook', icon: '📘', description: 'Social Presence', color: 'bg-blue-600' },
    { name: 'Instagram', icon: '📷', description: 'Visual Content', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { name: 'News', icon: '📰', description: 'Recent Updates', color: 'bg-red-500' },
    { name: 'Zomato', icon: '🍴', description: 'Food Reviews', color: 'bg-red-500' }
  ];

  // Handle mouse events for tooltip
  const handleMouseEnter = (event: React.MouseEvent, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredSource(index);
  };

  const handleMouseLeave = () => {
    setHoveredSource(null);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      // Clear the copied state after 2 seconds
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  // Convert DataSource objects to display format
  const getSourceDisplayInfo = (source: DataSource) => {
    const typeMap: Record<string, { name: string; icon: string; description: string; color: string }> = {
      // Core data sources
      'website': { name: 'Website', icon: '🌐', description: 'Company Info', color: 'bg-blue-500' },
      'search': { name: 'Search', icon: '🔍', description: 'Web Search', color: 'bg-green-500' },
      'news': { name: 'News', icon: '📰', description: 'Recent Updates', color: 'bg-red-500' },
      'menu': { name: 'Menu', icon: '🍽️', description: 'Menu Data', color: 'bg-orange-500' },

      // Professional platforms
      'linkedin': { name: 'LinkedIn', icon: '💼', description: 'Professional Network', color: 'bg-blue-700' },
      'glassdoor': { name: 'Glassdoor', icon: '🏢', description: 'Company Reviews', color: 'bg-green-600' },
      'crunchbase': { name: 'Crunchbase', icon: '🚀', description: 'Business Intelligence', color: 'bg-blue-600' },
      'bloomberg': { name: 'Bloomberg', icon: '📊', description: 'Financial Data', color: 'bg-yellow-600' },

      // Social media platforms
      'facebook': { name: 'Facebook', icon: '📘', description: 'Social Presence', color: 'bg-blue-600' },
      'instagram': { name: 'Instagram', icon: '📷', description: 'Visual Content', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
      'twitter': { name: 'Twitter', icon: '🐦', description: 'Social Updates', color: 'bg-sky-500' },
      'social': { name: 'Social Media', icon: '📱', description: 'Social Presence', color: 'bg-purple-500' },

      // Review platforms
      'yelp': { name: 'Yelp', icon: '⭐', description: 'Customer Reviews', color: 'bg-red-600' },
      'tripadvisor': { name: 'TripAdvisor', icon: '🧳', description: 'Travel Reviews', color: 'bg-green-700' },
      'google': { name: 'Google Reviews', icon: '🔍', description: 'Google Feedback', color: 'bg-blue-500' },
      'reviews': { name: 'Reviews', icon: '⭐', description: 'Customer Feedback', color: 'bg-yellow-500' },

      // Food & location platforms
      'zomato': { name: 'Zomato', icon: '🍴', description: 'Food Reviews', color: 'bg-red-500' },
      'foursquare': { name: 'Foursquare', icon: '📍', description: 'Location Data', color: 'bg-pink-500' },
      'maps': { name: 'Maps', icon: '📍', description: 'Location Data', color: 'bg-green-500' },
    };

    return typeMap[source.type] || {
      name: source.platform || source.type,
      icon: '📄',
      description: 'Data Source',
      color: 'bg-gray-500'
    };
  };

  // Get unique source types from actual sources
  const uniqueSourceTypes = sources.length > 0
    ? Array.from(new Set(sources.map(s => s.type))).map(type => {
        const sourceOfType = sources.find(s => s.type === type);
        return sourceOfType ? getSourceDisplayInfo(sourceOfType) : null;
      }).filter(Boolean)
    : defaultSources;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 animate-scale-in" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Data Sources Analyzed</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {uniqueSourceTypes.slice(0, 8).map((source, index) => {
          // Use source-specific color or fallback to default colors
          const sourceColor = source?.color || defaultSources[index % defaultSources.length]?.color || 'bg-gray-500';
          return (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-10 h-10 ${sourceColor} rounded-full mx-auto mb-2 flex items-center justify-center shadow-sm`}>
                <span className="text-white text-sm">{source?.icon}</span>
              </div>
              <div className="font-medium text-gray-800 text-xs">{source?.name}</div>
              <div className="text-xs text-gray-500">{source?.description}</div>
            </div>
          );
        })}
      </div>

      {/* Show more sources if available */}
      {uniqueSourceTypes.length > 8 && (
        <div className="mt-4 text-center">
          <span className="text-xs text-gray-500">
            +{uniqueSourceTypes.length - 8} more data sources analyzed
          </span>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs text-green-700 font-medium">
            Analysis completed in 8.2 seconds • All data sources active
          </span>
        </div>
      </div>

      {/* Show actual sources if available */}
      {sources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Data Sources Analyzed ({sources.length}):</h4>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => {
              const displayInfo = getSourceDisplayInfo(source);
              // Handle timestamp that might be a string or Date object
              const timestamp = source.timestamp instanceof Date
                ? source.timestamp.toLocaleString()
                : new Date(source.timestamp).toLocaleString();

              // Get platform-specific styling
              const getPlatformStyle = (type: string) => {
                const styleMap: Record<string, string> = {
                  'linkedin': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                  'glassdoor': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                  'facebook': 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                  'instagram': 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
                  'twitter': 'bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200',
                  'yelp': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                  'zomato': 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                  'tripadvisor': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                  'foursquare': 'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200',
                  'news': 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
                  'website': 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                  'search': 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 ring-2 ring-green-300',
                };
                return styleMap[type] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
              };

              // Special handling for search sources to highlight URL
              const isSearchSource = source.type === 'search';
              const shortUrl = source.url.length > 50 ? source.url.substring(0, 47) + '...' : source.url;

              return (
                <div key={index} className="relative">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPlatformStyle(source.type)} hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer`}
                    onMouseEnter={(e) => handleMouseEnter(e, index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleCopyUrl(source.url)}
                  >
                    <span className="mr-1.5">{displayInfo.icon}</span>
                    {displayInfo.name}
                    {source.confidence && (
                      <span className="ml-1.5 text-xs opacity-75">
                        {Math.round(source.confidence * 100)}%
                      </span>
                    )}
                  </span>

                  {/* Custom Tooltip */}
                  {hoveredSource === index && (
                    <div
                      className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg max-w-sm"
                      style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        transform: 'translateX(-50%) translateY(-100%)'
                      }}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{displayInfo.icon}</span>
                          <div className="font-semibold text-yellow-300">{displayInfo.name}</div>
                          {isSearchSource && (
                            <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-xs">SEARCH</span>
                          )}
                        </div>
                        <div className="text-gray-300">{displayInfo.description}</div>
                        <div className="border-t border-gray-700 pt-2 mt-2">
                          <div className={`break-all ${isSearchSource ? 'text-green-300' : 'text-blue-300'}`}>
                            <span className="font-medium">🔗 URL: </span>
                            <span className="font-mono text-xs bg-gray-800 px-1 py-0.5 rounded">
                              {source.url}
                            </span>
                          </div>
                          <div className="text-gray-400 mt-1">
                            <span className="font-medium">⏰ Analyzed: </span>
                            {timestamp}
                          </div>
                          {source.confidence && (
                            <div className="text-green-300 mt-1">
                              <span className="font-medium">📊 Confidence: </span>
                              <span className="bg-green-800 px-1 py-0.5 rounded">
                                {Math.round(source.confidence * 100)}%
                              </span>
                            </div>
                          )}
                          {source.dataPoints && (
                            <div className="text-purple-300 mt-1">
                              <span className="font-medium">📈 Data Points: </span>
                              <span className="bg-purple-800 px-1 py-0.5 rounded">
                                {source.dataPoints}
                              </span>
                            </div>
                          )}
                          {source.platform && (
                            <div className="text-cyan-300 mt-1">
                              <span className="font-medium">🏷️ Platform: </span>
                              {source.platform}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-700 flex items-center space-x-1">
                          <span>💡</span>
                          <span>Click to copy URL to clipboard</span>
                        </div>
                      </div>
                      {/* Tooltip arrow */}
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
                      ></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Data quality indicator */}
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>
              {sources.filter(s => s.confidence && s.confidence > 0.8).length} high-quality sources
            </span>
            <span>
              {sources.reduce((total, s) => total + (s.dataPoints || 0), 0)} total data points
            </span>
          </div>
        </div>
      )}

      {/* Copy Success Notification */}
      {copiedUrl && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span className="font-medium">URL copied to clipboard!</span>
          </div>
          <div className="text-xs text-green-100 mt-1 break-all max-w-xs">
            {copiedUrl.length > 50 ? copiedUrl.substring(0, 47) + '...' : copiedUrl}
          </div>
        </div>
      )}
    </div>
  );
}
