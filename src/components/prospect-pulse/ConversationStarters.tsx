import React from 'react';

interface ConversationStartersProps {
  conversationStarters: string[];
  onCopy: (text: string) => void;
}

export default function ConversationStarters({ conversationStarters, onCopy }: ConversationStartersProps) {
  const defaultStarters = [
    "I noticed your restaurant has been expanding rapidly. How are you managing POS operations across multiple locations?",
    "Your digital ordering growth is impressive. I'd love to show you how StoreHub can optimize your omnichannel strategy.",
    "With your focus on customer experience, our analytics could help identify peak hour optimization opportunities."
  ];

  const starters = conversationStarters.length > 0 ? conversationStarters : defaultStarters;
  const colors = ['blue', 'green', 'orange'];

  return (
    <div className="bg-white rounded-xl shadow-md p-5 animate-slide-up">
      <div className="flex items-center space-x-3 mb-5">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 256 256">
            <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Conversation Starters</h3>
      </div>
      
      <div className="space-y-3">
        {starters.slice(0, 3).map((starter, index) => {
          const color = colors[index];
          return (
            <div 
              key={index}
              className={`bg-gray-50 rounded-lg p-3 border-l-4 border-${color}-500`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 bg-${color}-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700 text-sm">"{starter}"</p>
              </div>
              <button 
                onClick={() => onCopy(starter)}
                className={`mt-2 text-xs text-${color}-500 hover:text-${color}-600 font-medium`}
              >
                📋 Copy
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
