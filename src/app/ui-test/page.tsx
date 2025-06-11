'use client';

import React, { useState } from 'react';
import LoadingState from '@/components/prospect-pulse/LoadingState';

export default function UITestPage() {
  const [showLoading, setShowLoading] = useState(false);

  const loadingSteps = [
    "Searching company website...",
    "Analyzing social media presence...",
    "Gathering recent news and updates...",
    "Generating sales insights..."
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Test Controls */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">UI Components Test</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowLoading(!showLoading)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              {showLoading ? 'Hide Loading' : 'Show Loading'}
            </button>
            <a
              href="/prospect-pulse"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Test Main Page
            </a>
          </div>
        </div>
      </div>

      {/* Loading State Test */}
      {showLoading && (
        <div className="fixed inset-0 z-50">
          <LoadingState steps={loadingSteps} currentStep={1} />
        </div>
      )}

      {/* UI Test Content */}
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        
        {/* Gradient Text Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Gradient Text Test</h2>
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-lg">
            <h3 className="text-4xl font-bold text-white mb-4">
              Know Your
              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-500 bg-clip-text text-transparent font-extrabold">
                {' '}Prospects
              </span>
              <br />In Seconds
            </h3>
            <p className="text-white/80">Testing gradient text rendering</p>
          </div>
        </div>

        {/* Search Input Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Search Input Test</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 256 256">
                <path d="m229.66,218.34-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Enter company name (e.g., KFC Singapore, McDonald's)"
              className="w-full pl-12 pr-4 py-3.5 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 placeholder:text-gray-500"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Color Palette Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Color Palette Test</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Primary Orange</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Secondary Blue</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Gradient</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Background</p>
            </div>
          </div>
        </div>

        {/* Animation Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Animation Test</h2>
          <div className="space-y-4">
            <div className="animate-fade-in bg-blue-100 p-4 rounded-lg">
              <p>Fade In Animation</p>
            </div>
            <div className="animate-slide-up bg-green-100 p-4 rounded-lg">
              <p>Slide Up Animation</p>
            </div>
            <div className="animate-scale-in bg-purple-100 p-4 rounded-lg">
              <p>Scale In Animation</p>
            </div>
            <div className="animate-pulse-slow bg-yellow-100 p-4 rounded-lg">
              <p>Pulse Slow Animation</p>
            </div>
          </div>
        </div>

        {/* Glass Effect Test */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-lg">
          <div className="glass-effect rounded-xl p-6 ai-glow">
            <h3 className="text-xl font-semibold mb-2">Glass Effect Test</h3>
            <p className="text-gray-600">This should have a glass/blur effect with a subtle glow</p>
          </div>
        </div>

      </div>

      {/* Fixed Issues Summary */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-green-800 font-semibold mb-2">UI Fixes Applied:</h3>
          <ul className="text-green-700 text-sm space-y-1">
            <li>✅ Fixed loading state background - now uses gradient instead of white</li>
            <li>✅ Enhanced "Prospects" text gradient - more vibrant orange to yellow</li>
            <li>✅ Shortened search placeholder text to prevent truncation</li>
            <li>✅ Added proper Tailwind configuration with custom colors</li>
            <li>✅ Improved animation definitions and keyframes</li>
            <li>✅ Added backdrop blur and glass effects</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
