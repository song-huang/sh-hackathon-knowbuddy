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
          <div className="w-20 h-20 bg-[#ff6b35]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg
              className="w-10 h-10 text-[#ff6b35] lightning-flash"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z" />
            </svg>
          </div>
          <div className="absolute -inset-2 bg-[#ff6b35]/5 rounded-full animate-ping" />
        </div>

        <h3 className="text-3xl font-semibold text-gray-800 mb-8">
          AI is analyzing...
        </h3>

        <div className="space-y-4 text-left max-w-sm mx-auto">
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
                  className={`w-3 h-3 rounded-full ${stepStatus === 'completed'
                    ? 'bg-green-500'
                    : stepStatus === 'active'
                      ? 'bg-[#ff6b35] typing-indicator'
                      : 'bg-gray-400'
                    }`}
                />
                <span
                  className={`text-base ${stepStatus === 'completed' || stepStatus === 'active'
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
