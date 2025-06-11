'use client';

import { useState } from 'react';
import { ResultCardProps } from '@/types';

export default function ResultCard({ analysis, onExport, onCopy }: ResultCardProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['profile']));
  const [copiedText, setCopiedText] = useState<string>('');

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      onCopy?.(text);
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{analysis.profile.name}</h1>
            <p className="text-blue-100">{analysis.profile.description}</p>
          </div>
          <div className="flex gap-2">
            {onExport && (
              <button
                onClick={onExport}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Company Profile */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('profile')}
          className="w-full px-6 py-4 text-left hover:bg-gray-50 flex justify-between items-center"
        >
          <h2 className="text-lg font-semibold">Company Profile</h2>
          <span className={`transform transition-transform ${expandedSections.has('profile') ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {expandedSections.has('profile') && (
          <div className="px-6 pb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Basic Information</h3>
                <ul className="space-y-1 text-sm">
                  {analysis.profile.founded && <li><strong>Founded:</strong> {analysis.profile.founded}</li>}
                  {analysis.profile.size && <li><strong>Size:</strong> {analysis.profile.size}</li>}
                  <li><strong>Cuisine:</strong> {analysis.profile.cuisine}</li>
                  {analysis.profile.priceRange && <li><strong>Price Range:</strong> {analysis.profile.priceRange}</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Locations</h3>
                <ul className="space-y-1 text-sm">
                  {analysis.profile.locations.map((location, index) => (
                    <li key={index}>{location}</li>
                  ))}
                </ul>
              </div>
            </div>
            {analysis.profile.menuHighlights && analysis.profile.menuHighlights.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Menu Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.profile.menuHighlights.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Business Insights */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('insights')}
          className="w-full px-6 py-4 text-left hover:bg-gray-50 flex justify-between items-center"
        >
          <h2 className="text-lg font-semibold">Business Insights</h2>
          <span className={`transform transition-transform ${expandedSections.has('insights') ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {expandedSections.has('insights') && (
          <div className="px-6 pb-4 space-y-4">
            <div>
              <h3 className="font-medium text-green-700 mb-2">Key Strengths</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {analysis.insights.keyStrengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            {analysis.insights.challenges.length > 0 && (
              <div>
                <h3 className="font-medium text-orange-700 mb-2">Potential Challenges</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {analysis.insights.challenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.insights.recentUpdates.length > 0 && (
              <div>
                <h3 className="font-medium text-blue-700 mb-2">Recent Updates</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {analysis.insights.recentUpdates.map((update, index) => (
                    <li key={index}>{update}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sales Tools */}
      <div className="border-b">
        <button
          onClick={() => toggleSection('sales')}
          className="w-full px-6 py-4 text-left hover:bg-gray-50 flex justify-between items-center"
        >
          <h2 className="text-lg font-semibold">Sales Tools</h2>
          <span className={`transform transition-transform ${expandedSections.has('sales') ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        {expandedSections.has('sales') && (
          <div className="px-6 pb-4 space-y-6">
            {/* Conversation Starters */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Conversation Starters</h3>
              <div className="space-y-2">
                {analysis.salesTools.conversationStarters.map((starter, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md relative group">
                    <p className="text-sm pr-8">{starter}</p>
                    <button
                      onClick={() => handleCopy(starter, `starter-${index}`)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedText === `starter-${index}` ? '✓' : '📋'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential Objections */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Potential Objections & Responses</h3>
              <div className="space-y-3">
                {analysis.salesTools.potentialObjections.map((item, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="mb-2">
                      <strong className="text-red-700">Objection:</strong>
                      <p className="text-sm mt-1">{item.objection}</p>
                    </div>
                    <div>
                      <strong className="text-green-700">Response:</strong>
                      <p className="text-sm mt-1">{item.response}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Propositions */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Value Propositions</h3>
              <div className="space-y-2">
                {analysis.salesTools.valuePropositions.map((prop, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-md relative group">
                    <p className="text-sm pr-8">{prop}</p>
                    <button
                      onClick={() => handleCopy(prop, `value-${index}`)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copiedText === `value-${index}` ? '✓' : '📋'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sources */}
      <div className="px-6 py-4 bg-gray-50">
        <h3 className="font-medium text-gray-700 mb-2">Data Sources</h3>
        <div className="text-xs text-gray-600 space-y-1">
          {analysis.sources.map((source, index) => (
            <div key={index} className="flex justify-between">
              <span>{source.type}: {source.url}</span>
              <span>{formatDate(source.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
