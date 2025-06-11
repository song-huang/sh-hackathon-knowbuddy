import React from 'react';

interface Objection {
  objection: string;
  response: string;
}

interface ObjectionHandlingProps {
  objections: Objection[];
  onCopy: (text: string) => void;
}

export default function ObjectionHandling({ objections, onCopy }: ObjectionHandlingProps) {
  const defaultObjections: Objection[] = [
    {
      objection: "We already have a POS system that works fine.",
      response: "I understand your current system works. StoreHub integrates seamlessly while providing advanced analytics that can increase efficiency by 20-30%, especially for multi-location operations like yours."
    }
  ];

  const objectionsToShow = objections.length > 0 ? objections : defaultObjections;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
            <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Objection Handling</h3>
      </div>
      
      <div className="space-y-3">
        {objectionsToShow.slice(0, 2).map((objection, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="mb-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-red-600 text-xs font-semibold">Objection:</span>
              </div>
              <p className="text-gray-700 text-xs ml-4">"{objection.objection}"</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-600 text-xs font-semibold">Response:</span>
              </div>
              <p className="text-gray-700 text-xs ml-4">"{objection.response}"</p>
            </div>
            
            <button 
              onClick={() => onCopy(objection.response)}
              className="mt-2 text-xs text-blue-500 hover:text-blue-600 font-medium"
            >
              📋 Copy Response
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
