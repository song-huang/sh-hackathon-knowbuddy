'use client';

import React, { useState } from 'react';
import DataSources from '@/components/prospect-pulse/DataSources';
import { DataSource } from '@/types';
import MockDataSourcesService from '@/services/mockDataSources';

export default function DataSourceTestPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState('KFC Singapore');

  // Generate mock sources for different restaurants
  const restaurantOptions = [
    'KFC Singapore',
    'McDonald\'s Malaysia',
    'Starbucks Coffee',
    'Pizza Hut',
    'Subway',
    'Din Tai Fung',
    'Shake Shack',
    'Domino\'s Pizza'
  ];

  // Test data that matches the actual API response structure
  const basicTestSources: DataSource[] = [
    {
      type: 'search',
      url: 'https://google.com/search',
      timestamp: new Date(),
      confidence: 0.8,
      dataPoints: 5
    },
    {
      type: 'website',
      url: 'https://example-restaurant.com',
      timestamp: new Date(),
      confidence: 0.9,
      dataPoints: 10
    },
    {
      type: 'facebook',
      url: 'https://facebook.com/restaurant',
      timestamp: new Date(),
      confidence: 0.7,
      dataPoints: 3
    },
    {
      type: 'news',
      url: 'https://news.example.com/article',
      timestamp: new Date(),
      confidence: 0.6,
      dataPoints: 2
    }
  ];

  // Enhanced test sources with new platforms
  const enhancedTestSources: DataSource[] = MockDataSourcesService.generateRestaurantSources(selectedRestaurant, 'Fast Food');

  // Professional platforms test
  const professionalSources: DataSource[] = [
    {
      type: 'linkedin',
      url: 'https://linkedin.com/company/kfc',
      timestamp: new Date(),
      confidence: 0.88,
      dataPoints: 12,
      platform: 'LinkedIn Company Page'
    },
    {
      type: 'glassdoor',
      url: 'https://glassdoor.com/Overview/Working-at-KFC',
      timestamp: new Date(),
      confidence: 0.82,
      dataPoints: 8,
      platform: 'Glassdoor Reviews'
    },
    {
      type: 'crunchbase',
      url: 'https://crunchbase.com/organization/kfc',
      timestamp: new Date(),
      confidence: 0.75,
      dataPoints: 6,
      platform: 'Crunchbase Profile'
    },
    {
      type: 'bloomberg',
      url: 'https://bloomberg.com/quote/YUM:US',
      timestamp: new Date(),
      confidence: 0.70,
      dataPoints: 5,
      platform: 'Bloomberg Terminal'
    }
  ];

  // Test with serialized timestamps (as they would come from API)
  const testSourcesWithStringTimestamps = testSources.map(source => ({
    ...source,
    timestamp: source.timestamp.toISOString() as any // Simulate API serialization
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Enhanced DataSources Component Test</h1>

        {/* Restaurant Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Restaurant Selector</h2>
          <div className="flex flex-wrap gap-2">
            {restaurantOptions.map((restaurant) => (
              <button
                key={restaurant}
                onClick={() => setSelectedRestaurant(restaurant)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedRestaurant === restaurant
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {restaurant}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Selected: <strong>{selectedRestaurant}</strong> - This will generate different mock data sources
          </p>
        </div>

        <div className="space-y-8">
          {/* Enhanced test with new platforms */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 1: Enhanced Platforms ({selectedRestaurant})</h2>
            <DataSources sources={enhancedTestSources} />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Sources:</strong> {enhancedTestSources.length} |
                <strong> High Quality:</strong> {MockDataSourcesService.getHighQualitySources(enhancedTestSources).length} |
                <strong> Total Data Points:</strong> {MockDataSourcesService.getTotalDataPoints(enhancedTestSources)} |
                <strong> Avg Confidence:</strong> {Math.round(MockDataSourcesService.getAverageConfidence(enhancedTestSources) * 100)}%
              </p>
            </div>
          </div>

          {/* Professional platforms test */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 2: Professional Platforms</h2>
            <DataSources sources={professionalSources} />
          </div>

          {/* Basic test with original sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 3: Basic Sources (Legacy)</h2>
            <DataSources sources={basicTestSources} />
          </div>

          {/* Test with empty sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 4: Empty Sources (Default Display)</h2>
            <DataSources sources={[]} />
          </div>

          {/* Test with mixed platforms */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 5: Mixed Platforms</h2>
            <DataSources sources={[...basicTestSources, ...professionalSources.slice(0, 2)]} />
          </div>
        </div>

        {/* Platform Coverage Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">Platform Coverage Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: 'Professional', platforms: ['LinkedIn', 'Glassdoor', 'Crunchbase', 'Bloomberg'], color: 'bg-blue-100 text-blue-800' },
              { category: 'Social Media', platforms: ['Facebook', 'Instagram', 'Twitter', 'Social'], color: 'bg-purple-100 text-purple-800' },
              { category: 'Reviews', platforms: ['Yelp', 'TripAdvisor', 'Google', 'Reviews'], color: 'bg-yellow-100 text-yellow-800' },
              { category: 'Food & Location', platforms: ['Zomato', 'Foursquare', 'Maps', 'Menu'], color: 'bg-green-100 text-green-800' }
            ].map((category) => (
              <div key={category.category} className={`p-4 rounded-lg ${category.color}`}>
                <h4 className="font-semibold mb-2">{category.category}</h4>
                <ul className="text-sm space-y-1">
                  {category.platforms.map((platform) => (
                    <li key={platform}>• {platform}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-800 font-semibold mb-2">Enhanced DataSources Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700 text-sm">
            <div>
              <h4 className="font-semibold mb-2">New Platforms Added:</h4>
              <ul className="space-y-1">
                <li>✅ LinkedIn - Professional network data</li>
                <li>✅ Glassdoor - Company reviews & insights</li>
                <li>✅ Crunchbase - Business intelligence</li>
                <li>✅ Bloomberg - Financial data</li>
                <li>✅ Zomato - Food delivery & reviews</li>
                <li>✅ Foursquare - Location data</li>
                <li>✅ TripAdvisor - Travel reviews</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Enhanced Features:</h4>
              <ul className="space-y-1">
                <li>✅ Platform-specific colors & styling</li>
                <li>✅ Confidence score display</li>
                <li>✅ Data quality indicators</li>
                <li>✅ Rich tooltips with metadata</li>
                <li>✅ Support for 8+ sources in grid</li>
                <li>✅ Professional platform categorization</li>
                <li>✅ Mock data generation service</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h3 className="text-green-800 font-semibold mb-2">Business Value:</h3>
          <p className="text-green-700 text-sm mb-2">
            <strong>Comprehensive Data Coverage:</strong> Now supports 15+ platforms including professional networks, social media, review sites, and industry-specific sources.
          </p>
          <p className="text-green-700 text-sm mb-2">
            <strong>Enhanced Sales Intelligence:</strong> LinkedIn and Glassdoor integration provides deeper company insights for B2B sales.
          </p>
          <p className="text-green-700 text-sm">
            <strong>Restaurant-Focused:</strong> Zomato, Foursquare, and TripAdvisor integration specifically targets restaurant industry data.
          </p>
        </div>
      </div>
    </div>
  );
}
