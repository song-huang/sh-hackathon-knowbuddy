'use client';

import React, { useState } from 'react';
import { dataCollectionService } from '@/services/dataCollection';

export default function EnhancedDataTestPage() {
  const [query, setQuery] = useState('KFC Singapore');
  const [location, setLocation] = useState('Singapore');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testQueries = [
    { name: 'KFC Singapore', location: 'Singapore' },
    { name: 'McDonald\'s Malaysia', location: 'Malaysia' },
    { name: 'Starbucks Coffee', location: 'Singapore' },
    { name: 'Pizza Hut', location: 'Singapore' },
    { name: 'Din Tai Fung', location: 'Singapore' },
    { name: 'Shake Shack', location: 'Singapore' }
  ];

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      console.log('Starting enhanced data collection for:', query, location);
      const result = await dataCollectionService.searchCompanyInfoComprehensive(query, location);
      console.log('Enhanced data collection result:', result);
      setResults(result);
    } catch (err) {
      console.error('Enhanced data collection failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderPlatformData = (title: string, data: any, bgColor: string) => {
    if (!data) return null;

    return (
      <div className={`${bgColor} rounded-lg p-4 mb-4`}>
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <div className="text-sm text-gray-700">
          <pre className="whitespace-pre-wrap overflow-auto max-h-40 bg-white/50 p-2 rounded text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  const renderSourcesSummary = (sources: any[]) => {
    if (!sources || sources.length === 0) return null;

    const sourcesByType = sources.reduce((acc, source) => {
      acc[source.type] = (acc[source.type] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">Data Sources Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(sourcesByType).map(([type, count]) => (
            <div key={type} className="bg-white rounded p-2 text-center">
              <div className="font-medium text-blue-700 capitalize">{type}</div>
              <div className="text-sm text-blue-600">{count as number} source{(count as number) > 1 ? 's' : ''}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-blue-700">
          <strong>Total Sources:</strong> {sources.length} | 
          <strong> High Quality:</strong> {sources.filter(s => s.confidence && s.confidence > 0.8).length} | 
          <strong> Total Data Points:</strong> {sources.reduce((sum, s) => sum + (s.dataPoints || 0), 0)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Enhanced Data Collection Test</h1>
        
        {/* Search Interface */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Enhanced Platform Data Collection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company/Restaurant Name</label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter location"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !query}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium"
              >
                {loading ? 'Collecting Data...' : 'Test Enhanced Collection'}
              </button>
            </div>
          </div>

          {/* Quick Test Buttons */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Quick Tests:</p>
            <div className="flex flex-wrap gap-2">
              {testQueries.map((test, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(test.name);
                    setLocation(test.location);
                  }}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm"
                >
                  {test.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Collecting data from multiple platforms...</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>• LinkedIn company data</p>
              <p>• Glassdoor reviews</p>
              <p>• Yelp business info</p>
              <p>• Zomato restaurant data</p>
              <p>• TripAdvisor reviews</p>
              <p>• Foursquare venue data</p>
              <p>• Enhanced social media</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Sources Summary */}
            {renderSourcesSummary(results.sources)}

            {/* Platform Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Professional Platforms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Platforms</h3>
                {renderPlatformData('LinkedIn Data', results.data.linkedinData, 'bg-blue-50')}
                {renderPlatformData('Glassdoor Data', results.data.glassdoorData, 'bg-green-50')}
              </div>

              {/* Review Platforms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Platforms</h3>
                {renderPlatformData('Yelp Data', results.data.yelpData, 'bg-red-50')}
                {renderPlatformData('TripAdvisor Data', results.data.tripadvisorData, 'bg-yellow-50')}
              </div>

              {/* Food & Location Platforms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Food & Location</h3>
                {renderPlatformData('Zomato Data', results.data.zomatoData, 'bg-orange-50')}
                {renderPlatformData('Foursquare Data', results.data.foursquareData, 'bg-purple-50')}
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media</h3>
                {renderPlatformData('Social Media Data', results.data.socialData, 'bg-pink-50')}
              </div>
            </div>

            {/* Legacy Data */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Legacy Data (Basic Info)</h3>
              {renderPlatformData('Basic Search Results', results.data.basicInfo, 'bg-gray-100')}
              {renderPlatformData('Business Data', results.data.businessData, 'bg-gray-100')}
              {renderPlatformData('Menu Data', results.data.menuData, 'bg-gray-100')}
              {renderPlatformData('News Data', results.data.newsData, 'bg-gray-100')}
            </div>
          </div>
        )}

        {/* Feature Overview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-800 font-semibold mb-2">Enhanced Data Collection Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700 text-sm">
            <div>
              <h4 className="font-semibold mb-2">New Platform Integrations:</h4>
              <ul className="space-y-1">
                <li>✅ LinkedIn - Company profiles & employee data</li>
                <li>✅ Glassdoor - Company reviews & salary data</li>
                <li>✅ Yelp - Business info & customer reviews</li>
                <li>✅ Zomato - Restaurant data & food reviews</li>
                <li>✅ TripAdvisor - Travel & restaurant reviews</li>
                <li>✅ Foursquare - Venue data & check-ins</li>
                <li>✅ Enhanced Social Media - Rich engagement data</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Quality Improvements:</h4>
              <ul className="space-y-1">
                <li>✅ Confidence scoring for each source</li>
                <li>✅ Data point counting for richness metrics</li>
                <li>✅ Platform-specific error handling</li>
                <li>✅ Comprehensive review aggregation</li>
                <li>✅ Enhanced social media metrics</li>
                <li>✅ Professional network insights</li>
                <li>✅ Restaurant-specific data collection</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
