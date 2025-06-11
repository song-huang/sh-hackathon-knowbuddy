import React from 'react';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="relative z-10 p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          {/* Sidebar Toggle Button */}
          <button
            id="sidebarToggle"
            onClick={onToggleSidebar}
            className="lg:hidden w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shadow-lg hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
            </svg>
          </button>

          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <img
              src="/storehub_logo.jpeg"
              alt="StoreHub Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white gradient-text">
              StoreHub <span className="text-orange-400">Prospects</span>
            </h1>
            <p className="text-white/70 text-sm">
              AI Sales Intelligence • StoreHub Internal Tool
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white/80">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm">AI Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
