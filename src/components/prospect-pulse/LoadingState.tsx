import React from 'react';

interface LoadingStateProps {
  steps: string[];
  currentStep: number;
}

export default function LoadingState({ steps, currentStep }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg
              className="w-10 h-10 text-primary lightning-flash"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z"/>
            </svg>
          </div>
          <div className="absolute -inset-2 bg-primary/5 rounded-full animate-ping" />
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          AI is analyzing...
        </h3>
        
        <div className="space-y-4 text-left max-w-xs mx-auto">
          {steps.map((step, index) => {
            let stepStatus: 'completed' | 'active' | 'pending' = 'pending';
            
            if (index < currentStep) {
              stepStatus = 'completed';
            } else if (index === currentStep) {
              stepStatus = 'active';
            }
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    stepStatus === 'completed'
                      ? 'bg-success'
                      : stepStatus === 'active'
                      ? 'bg-warning typing-indicator'
                      : 'bg-gray-300'
                  }`}
                />
                <span
                  className={`text-sm ${
                    stepStatus === 'completed' || stepStatus === 'active'
                      ? 'text-gray-700'
                      : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
