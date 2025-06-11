'use client';

import React from 'react';
import DataSources from '@/components/prospect-pulse/DataSources';
import { DataSource } from '@/types';

export default function DataSourceTestPage() {
  // Test data that matches the actual API response structure
  const testSources: DataSource[] = [
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
      type: 'social',
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

  // Test with serialized timestamps (as they would come from API)
  const testSourcesWithStringTimestamps = testSources.map(source => ({
    ...source,
    timestamp: source.timestamp.toISOString() as any // Simulate API serialization
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">DataSources Component Test</h1>
        
        <div className="space-y-8">
          {/* Test with Date objects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 1: With Date Objects</h2>
            <DataSources sources={testSources} />
          </div>

          {/* Test with string timestamps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 2: With String Timestamps (API Response)</h2>
            <DataSources sources={testSourcesWithStringTimestamps} />
          </div>

          {/* Test with empty sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 3: With Empty Sources (Default Display)</h2>
            <DataSources sources={[]} />
          </div>

          {/* Test with single source */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test 4: With Single Source</h2>
            <DataSources sources={[testSources[0]]} />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-800 font-semibold mb-2">DataSources Component Fix:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>✅ Fixed type mismatch: Now accepts DataSource[] instead of string[]</li>
            <li>✅ Handles both Date objects and string timestamps</li>
            <li>✅ Maps source types to appropriate icons and descriptions</li>
            <li>✅ Shows unique source types in grid display</li>
            <li>✅ Displays detailed source information with tooltips</li>
            <li>✅ Gracefully handles empty sources array</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h3 className="text-green-800 font-semibold mb-2">Error Resolution:</h3>
          <p className="text-green-700 text-sm">
            <strong>Original Error:</strong> "Objects are not valid as a React child (found: object with keys {type, url, timestamp})"
          </p>
          <p className="text-green-700 text-sm mt-2">
            <strong>Root Cause:</strong> DataSources component expected string[] but received DataSource[] objects
          </p>
          <p className="text-green-700 text-sm mt-2">
            <strong>Solution:</strong> Updated component to properly handle DataSource objects and render them correctly
          </p>
        </div>
      </div>
    </div>
  );
}
