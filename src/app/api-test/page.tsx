'use client';

import React, { useState } from 'react';

export default function ApiTestPage() {
  const [searchResult, setSearchResult] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSearchApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/prospect/search?query=KFC Singapore');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setSearchResult(data);
      console.log('Search API Response:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search API failed');
      console.error('Search API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testAnalysisApi = async () => {
    if (!searchResult) {
      setError('Please run search test first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/prospect/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: searchResult.id,
          comprehensiveData: (searchResult as any).comprehensiveData,
          searchData: (searchResult as any).searchData,
          sources: (searchResult as any).sources,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setAnalysisResult(data);
      console.log('Analysis API Response:', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis API failed');
      console.error('Analysis API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">API Integration Test</h1>
        
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="flex space-x-4">
            <button
              onClick={testSearchApi}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              {loading ? 'Testing...' : 'Test Search API'}
            </button>
            <button
              onClick={testAnalysisApi}
              disabled={loading || !searchResult}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              {loading ? 'Testing...' : 'Test Analysis API'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold">Error:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResult && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Search API Results</h2>
            <div className="bg-gray-50 rounded-md p-4 overflow-auto">
              <pre className="text-sm">{JSON.stringify(searchResult, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Analysis API Results</h2>
            <div className="bg-gray-50 rounded-md p-4 overflow-auto">
              <pre className="text-sm">{JSON.stringify(analysisResult, null, 2)}</pre>
            </div>
          </div>
        )}

        {/* API Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">API Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${searchResult ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Search API</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${analysisResult ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Analysis API</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-blue-800 font-semibold mb-2">Instructions:</h3>
          <ol className="text-blue-700 text-sm space-y-1">
            <li>1. Click "Test Search API" to test the search functionality</li>
            <li>2. If successful, click "Test Analysis API" to test AI analysis</li>
            <li>3. Check the console for detailed logs</li>
            <li>4. Verify that both APIs return real data (not mock data)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
