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
              <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"/>
            </svg>
          </button>
          
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">PP</span>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-white gradient-text">
              ProspectPulse
            </h1>
            <p className="text-white/70 text-sm">
              AI Sales Intelligence • Hybrid v2.0
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Navigation Menu for larger screens */}
          <nav className="hidden lg:flex items-center space-x-6 text-white/80">
            <a href="#" className="hover:text-white transition-colors text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="hover:text-white transition-colors text-sm font-medium">
              Analytics
            </a>
            <a href="#" className="hover:text-white transition-colors text-sm font-medium">
              Reports
            </a>
            <a href="#" className="hover:text-white transition-colors text-sm font-medium">
              Settings
            </a>
          </nav>
          
          <div className="flex items-center space-x-2 text-white/80">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm">AI Ready</span>
          </div>
        </div>
      </div>
    </header>
  );
}
