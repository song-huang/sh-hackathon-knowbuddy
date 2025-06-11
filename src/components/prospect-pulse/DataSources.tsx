import React from 'react';
import { DataSource } from '@/types';

interface DataSourcesProps {
  sources: DataSource[];
}

export default function DataSources({ sources }: DataSourcesProps) {
  const defaultSources = [
    { name: 'Website', icon: '🌐', description: 'Company Info' },
    { name: 'Facebook', icon: '📘', description: 'Social Presence' },
    { name: 'Instagram', icon: '📷', description: 'Visual Content' },
    { name: 'News', icon: '📰', description: 'Recent Updates' }
  ];

  // Convert DataSource objects to display format
  const getSourceDisplayInfo = (source: DataSource) => {
    const typeMap: Record<string, { name: string; icon: string; description: string }> = {
      'website': { name: 'Website', icon: '🌐', description: 'Company Info' },
      'social': { name: 'Social Media', icon: '📱', description: 'Social Presence' },
      'news': { name: 'News', icon: '📰', description: 'Recent Updates' },
      'reviews': { name: 'Reviews', icon: '⭐', description: 'Customer Feedback' },
      'search': { name: 'Search', icon: '🔍', description: 'Web Search' },
      'maps': { name: 'Maps', icon: '📍', description: 'Location Data' },
      'menu': { name: 'Menu', icon: '🍽️', description: 'Menu Data' }
    };

    return typeMap[source.type] || { name: source.type, icon: '📄', description: 'Data Source' };
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
        {uniqueSourceTypes.slice(0, 4).map((source, index) => {
          const bgColors = ['bg-blue-500', 'bg-blue-700', 'bg-gradient-to-br from-purple-500 to-pink-500', 'bg-red-500'];
          return (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 ${bgColors[index]} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                <span className="text-white text-sm">{source?.icon}</span>
              </div>
              <div className="font-medium text-gray-800 text-xs">{source?.name}</div>
              <div className="text-xs text-gray-500">{source?.description}</div>
            </div>
          );
        })}
      </div>
      
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
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sources Used:</h4>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, index) => {
              const displayInfo = getSourceDisplayInfo(source);
              // Handle timestamp that might be a string or Date object
              const timestamp = source.timestamp instanceof Date
                ? source.timestamp.toLocaleString()
                : new Date(source.timestamp).toLocaleString();

              return (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  title={`${source.url} - ${timestamp}`}
                >
                  <span className="mr-1">{displayInfo.icon}</span>
                  {displayInfo.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
