import React from 'react';
import { SearchResponse, AnalyzeResponse } from '@/types';
import CompanyOverview from './CompanyOverview';
import ConversationStarters from './ConversationStarters';
import ObjectionHandling from './ObjectionHandling';
import BusinessInsights from './BusinessInsights';
import DataSources from './DataSources';

interface ResultsSectionProps {
  searchData: SearchResponse;
  analysisData: AnalyzeResponse;
  onNewSearch: () => void;
}

export default function ResultsSection({ 
  searchData, 
  analysisData, 
  onNewSearch 
}: ResultsSectionProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-0">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNewSearch}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>
              </svg>
              <span>New Search</span>
            </button>
            <div className="h-4 w-px bg-gray-300" />
            <h1 className="text-lg font-semibold text-gray-800">ProspectPulse</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium">
              Export Report
            </button>
            <button className="border border-gray-300 hover:border-primary text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium">
              Save to CRM
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Company Overview Card */}
        <CompanyOverview 
          searchData={searchData}
          profile={analysisData.profile}
        />

        {/* AI Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Sales Conversation Starters */}
          <ConversationStarters 
            conversationStarters={analysisData.salesTools?.conversationStarters || []}
            onCopy={copyToClipboard}
          />

          {/* Objection Handling */}
          <ObjectionHandling 
            objections={analysisData.salesTools?.potentialObjections || []}
            onCopy={copyToClipboard}
          />
        </div>

        {/* Key Insights */}
        <BusinessInsights insights={analysisData.insights} />

        {/* Data Sources */}
        <DataSources sources={analysisData.sources || []} />
      </div>
    </div>
  );
}
