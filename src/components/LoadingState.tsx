'use client';

import { LoadingStateProps } from '@/types';

export default function LoadingState({ stage, progress = 0 }: LoadingStateProps) {
  const stages = {
    searching: {
      title: 'Searching for company information...',
      description: 'Gathering data from multiple sources',
      icon: '🔍',
    },
    analyzing: {
      title: 'Analyzing business data...',
      description: 'Processing company information and market insights',
      icon: '🧠',
    },
    generating: {
      title: 'Generating sales insights...',
      description: 'Creating personalized conversation starters and strategies',
      icon: '✨',
    },
  };

  const currentStage = stages[stage];
  const stageOrder = ['searching', 'analyzing', 'generating'];
  const currentStageIndex = stageOrder.indexOf(stage);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Main Loading Animation */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">
            {currentStage.icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentStage.title}
          </h2>
          <p className="text-gray-600">
            {currentStage.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStageIndex + 1) / stageOrder.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${((currentStageIndex + 1) / stageOrder.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Stage Indicators */}
        <div className="flex justify-between items-center">
          {stageOrder.map((stageName, index) => {
            const stageInfo = stages[stageName as keyof typeof stages];
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;
            
            return (
              <div key={stageName} className="flex flex-col items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2
                  ${isActive ? 'bg-blue-600 text-white animate-pulse' : 
                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className="text-center">
                  <div className={`text-xs font-medium ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {stageInfo.title.split(' ')[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s',
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-blue-700">
            {stage === 'searching' && "We're gathering information from multiple sources to give you the most comprehensive view of your prospect."}
            {stage === 'analyzing' && "Our AI is processing the collected data to identify key business insights and opportunities."}
            {stage === 'generating' && "We're creating personalized sales tools tailored specifically to this prospect's situation."}
          </p>
        </div>
      </div>
    </div>
  );
}
