'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/prospect-pulse/Header';
import Sidebar from '@/components/prospect-pulse/Sidebar';
import SearchInterface from '@/components/prospect-pulse/SearchInterface';
import LoadingState from '@/components/prospect-pulse/LoadingState';
import ResultsSection from '@/components/prospect-pulse/ResultsSection';
import { SearchResponse, AnalyzeResponse } from '@/types';

export default function ProspectPulsePage() {
  // State management
  const [currentView, setCurrentView] = useState<'search' | 'loading' | 'results'>('search');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalyzeResponse | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Loading steps
  const loadingSteps = [
    "Searching company website...",
    "Analyzing social media presence...",
    "Gathering recent news and updates...",
    "Generating sales insights..."
  ];

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle search
  const handleSearch = async (query: string) => {
    try {
      setError(null);
      setCurrentView('loading');
      setLoadingStep(0);

      // Animate loading steps
      const stepInterval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev >= loadingSteps.length - 1) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);

      // Call search API
      const searchResponse = await fetch(`/api/prospect/search?query=${encodeURIComponent(query)}`);
      if (!searchResponse.ok) {
        throw new Error('Search failed');
      }

      const searchResult: SearchResponse = await searchResponse.json();
      setSearchData(searchResult);

      // Call analysis API
      const analysisResponse = await fetch('/api/prospect/analyze', {
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

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed');
      }

      const analysisResult: AnalyzeResponse = await analysisResponse.json();
      setAnalysisData(analysisResult);

      // Clear interval and show results
      clearInterval(stepInterval);
      setTimeout(() => {
        setCurrentView('results');
      }, 1000);

    } catch (error) {
      console.error('Search/Analysis error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      setCurrentView('search');
    }
  };

  // Handle new search
  const handleNewSearch = () => {
    setCurrentView('search');
    setSearchData(null);
    setAnalysisData(null);
    setLoadingStep(0);
    setError(null);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const sidebar = document.getElementById('mobileSidebar');
        const toggle = document.getElementById('sidebarToggle');

        if (sidebar && toggle &&
          !sidebar.contains(event.target as Node) &&
          !toggle.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="bg-background min-h-screen">
      {/* Mobile Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      {currentView === 'search' && (
        <div className="min-h-screen pb-10 gradient-bg relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
            <div
              className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: '2s' }}
            />
          </div>

          <Header onToggleSidebar={toggleSidebar} />
          <SearchInterface onSearch={handleSearch} error={error} />
        </div>
      )}

      {currentView === 'loading' && (
        <LoadingState
          steps={loadingSteps}
          currentStep={loadingStep}
        />
      )}

      {currentView === 'results' && searchData && analysisData && (
        <ResultsSection
          searchData={searchData}
          analysisData={analysisData}
          onNewSearch={handleNewSearch}
        />
      )}
    </div>
  );
}
