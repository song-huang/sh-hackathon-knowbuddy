'use client';

import React from 'react';
import DataSources from '@/components/prospect-pulse/DataSources';
import { DataSource } from '@/types';

export default function DataSourceHoverTestPage() {
  // Test data with various source types including search sources
  const testSources: DataSource[] = [
    // Search sources (should be highlighted)
    {
      type: 'search',
      url: 'https://google.com/search?q=KFC+Singapore+restaurant+menu+location',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      confidence: 0.80,
      dataPoints: 5,
      platform: 'Google Search'
    },
    {
      type: 'search',
      url: 'https://bing.com/search?q=McDonald%27s+Malaysia+franchise+info',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      confidence: 0.75,
      dataPoints: 4,
      platform: 'Bing Search'
    },
    {
      type: 'search',
      url: 'https://duckduckgo.com/?q=Starbucks+Coffee+Singapore+locations',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      confidence: 0.85,
      dataPoints: 6,
      platform: 'DuckDuckGo Search'
    },
    
    // Professional platforms
    {
      type: 'linkedin',
      url: 'https://linkedin.com/company/kfc-singapore',
      timestamp: new Date(Date.now() - 1000 * 60 * 10),
      confidence: 0.88,
      dataPoints: 12,
      platform: 'LinkedIn Company Page'
    },
    {
      type: 'glassdoor',
      url: 'https://glassdoor.com/Overview/Working-at-KFC-Singapore-EI_IE123456.htm',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      confidence: 0.82,
      dataPoints: 8,
      platform: 'Glassdoor Reviews'
    },
    
    // Review platforms
    {
      type: 'yelp',
      url: 'https://yelp.com/biz/kfc-singapore-orchard-road',
      timestamp: new Date(Date.now() - 1000 * 60 * 6),
      confidence: 0.92,
      dataPoints: 25,
      platform: 'Yelp Business Profile'
    },
    {
      type: 'zomato',
      url: 'https://zomato.com/singapore/kfc-orchard-road-singapore',
      timestamp: new Date(Date.now() - 1000 * 60 * 7),
      confidence: 0.87,
      dataPoints: 16,
      platform: 'Zomato Restaurant'
    },
    {
      type: 'tripadvisor',
      url: 'https://tripadvisor.com/Restaurant_Review-g294265-d1234567-Reviews-KFC_Singapore.html',
      timestamp: new Date(Date.now() - 1000 * 60 * 14),
      confidence: 0.80,
      dataPoints: 15,
      platform: 'TripAdvisor Reviews'
    },
    
    // Social media platforms
    {
      type: 'facebook',
      url: 'https://facebook.com/KFCSingapore',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      confidence: 0.90,
      dataPoints: 20,
      platform: 'Facebook Business Page'
    },
    {
      type: 'instagram',
      url: 'https://instagram.com/kfcsingapore',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      confidence: 0.85,
      dataPoints: 18,
      platform: 'Instagram Business Account'
    },
    {
      type: 'twitter',
      url: 'https://twitter.com/KFCSingapore',
      timestamp: new Date(Date.now() - 1000 * 60 * 18),
      confidence: 0.78,
      dataPoints: 10,
      platform: 'Twitter/X Account'
    },
    
    // Location and other platforms
    {
      type: 'foursquare',
      url: 'https://foursquare.com/v/kfc-singapore/4b123456789abcdef',
      timestamp: new Date(Date.now() - 1000 * 60 * 16),
      confidence: 0.73,
      dataPoints: 9,
      platform: 'Foursquare Venue'
    },
    
    // News and website
    {
      type: 'news',
      url: 'https://news.google.com/search?q=KFC+Singapore+expansion+2024',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      confidence: 0.85,
      dataPoints: 12,
      platform: 'Google News'
    },
    {
      type: 'website',
      url: 'https://kfc.com.sg',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      confidence: 0.95,
      dataPoints: 15,
      platform: 'Official Website'
    }
  ];

  // Test sources with very long URLs
  const longUrlSources: DataSource[] = [
    {
      type: 'search',
      url: 'https://google.com/search?q=KFC+Singapore+restaurant+menu+location+contact+information+delivery+hours+franchise+opportunities&hl=en&gl=sg&tbm=nws&source=lnt&tbs=qdr:m',
      timestamp: new Date(),
      confidence: 0.80,
      dataPoints: 5,
      platform: 'Google Search with Long Query'
    },
    {
      type: 'linkedin',
      url: 'https://linkedin.com/company/kentucky-fried-chicken-singapore-pte-ltd-franchise-operations-southeast-asia',
      timestamp: new Date(),
      confidence: 0.88,
      dataPoints: 12,
      platform: 'LinkedIn Long Company Name'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">DataSources Hover & URL Display Test</h1>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-blue-800 font-semibold mb-2">Testing Instructions:</h2>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>🖱️ <strong>Hover</strong> over any data source tag to see detailed tooltip with URL</li>
            <li>🔍 <strong>Search sources</strong> are highlighted with special styling and green ring</li>
            <li>📋 <strong>Click</strong> any tag to copy the URL to clipboard</li>
            <li>✅ <strong>Success notification</strong> appears when URL is copied</li>
            <li>🏷️ <strong>Platform information</strong> is shown in the tooltip</li>
            <li>📊 <strong>Confidence scores</strong> and data points are displayed</li>
          </ul>
        </div>

        {/* Test 1: Standard Sources */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 1: Standard Data Sources (14 sources)</h2>
          <p className="text-gray-600 mb-4">
            Includes search sources (highlighted), professional platforms, review sites, social media, and more.
          </p>
          <DataSources sources={testSources} />
        </div>

        {/* Test 2: Long URLs */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 2: Long URLs Handling</h2>
          <p className="text-gray-600 mb-4">
            Tests how the component handles very long URLs in tooltips and notifications.
          </p>
          <DataSources sources={longUrlSources} />
        </div>

        {/* Test 3: Empty Sources */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 3: Empty Sources (Default Display)</h2>
          <p className="text-gray-600 mb-4">
            Shows the default platform grid when no actual sources are available.
          </p>
          <DataSources sources={[]} />
        </div>

        {/* Test 4: Search Sources Only */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test 4: Search Sources Only</h2>
          <p className="text-gray-600 mb-4">
            Only search-type sources to test the special highlighting.
          </p>
          <DataSources sources={testSources.filter(s => s.type === 'search')} />
        </div>

        {/* Feature Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-green-800 font-semibold mb-2">Enhanced Features Implemented:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Hover Functionality:</h4>
              <ul className="space-y-1">
                <li>✅ Rich tooltip with detailed information</li>
                <li>✅ URL display with monospace font</li>
                <li>✅ Platform-specific information</li>
                <li>✅ Confidence scores and data points</li>
                <li>✅ Timestamp information</li>
                <li>✅ Visual indicators and icons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Interactive Features:</h4>
              <ul className="space-y-1">
                <li>✅ Click to copy URL to clipboard</li>
                <li>✅ Success notification with URL preview</li>
                <li>✅ Special highlighting for search sources</li>
                <li>✅ Hover effects and animations</li>
                <li>✅ Responsive tooltip positioning</li>
                <li>✅ Long URL handling and truncation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
