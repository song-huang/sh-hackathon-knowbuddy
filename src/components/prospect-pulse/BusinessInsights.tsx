import React from 'react';
import { BusinessInsights as BusinessInsightsType } from '@/types';

interface BusinessInsightsProps {
  insights: BusinessInsightsType;
}

export default function BusinessInsights({ insights }: BusinessInsightsProps) {
  const defaultGrowthOpportunities = [
    "Digital ordering system expansion across all locations",
    "Enhanced customer analytics and loyalty programs",
    "Multi-location inventory management optimization"
  ];

  const defaultKeyStrengths = [
    "Strong brand recognition in Southeast Asian markets",
    "Established customer base with high loyalty",
    "Proven track record of successful expansion"
  ];

  const growthOpportunities = insights?.growthSignals || insights?.recentUpdates || defaultGrowthOpportunities;
  const keyStrengths = insights?.keyStrengths || defaultKeyStrengths;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
            <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Key Business Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h4 className="font-semibold text-green-600 mb-3 text-sm">🚀 Growth Opportunities</h4>
          <ul className="space-y-2 text-xs text-gray-700">
            {growthOpportunities.slice(0, 3).map((opportunity, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-blue-600 mb-3 text-sm">💪 Key Strengths</h4>
          <ul className="space-y-2 text-xs text-gray-700">
            {keyStrengths.slice(0, 3).map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Additional Insights */}
      {(insights?.challenges || insights?.painPoints || insights?.marketPosition) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(insights?.challenges || insights?.painPoints) && (
              <div>
                <h4 className="font-semibold text-orange-600 mb-3 text-sm">⚠️ Challenges & Pain Points</h4>
                <ul className="space-y-2 text-xs text-gray-700">
                  {(insights?.challenges || insights?.painPoints || []).slice(0, 3).map((challenge, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights?.marketPosition && (
              <div>
                <h4 className="font-semibold text-purple-600 mb-3 text-sm">📊 Market Position</h4>
                <p className="text-xs text-gray-700">{insights.marketPosition}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Customer Sentiment */}
      {insights?.customerSentiment && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-indigo-600 mb-3 text-sm">😊 Customer Sentiment</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(insights.customerSentiment).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-indigo-600 mb-1">
                  {typeof value === 'number' ? value.toFixed(1) : value}
                </div>
                <div className="text-xs text-gray-500 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
