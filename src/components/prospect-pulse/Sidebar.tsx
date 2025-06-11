import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      id="mobileSidebar"
      className={`fixed left-0 top-0 h-full w-64 bg-storehub-bg border-r border-storehub-border z-50 shadow-lg transition-transform duration-300 lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-storehub-orange rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">PP</span>
            </div>
            <h1 className="text-xl font-bold gradient-text">ProspectPulse</h1>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 256 256">
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"/>
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-storehub-orange text-white shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.44,0,1.18,1.18,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"/>
            </svg>
            <span>Dashboard</span>
          </a>
          
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-storehub-gray hover:text-storehub-blue hover:bg-storehub-card hover:shadow-sm transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
              <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/>
            </svg>
            <span>Analytics</span>
          </a>
          
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-storehub-gray hover:text-storehub-blue hover:bg-storehub-card hover:shadow-sm transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V88H40ZM40,200V104H216v96Z"/>
            </svg>
            <span>Reports</span>
          </a>
          
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-storehub-gray hover:text-storehub-blue hover:bg-storehub-card hover:shadow-sm transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3.18-3.18L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3.18,3.18L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3.18,3.18L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3.18-3.18L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,192a64,64,0,1,1,64-64A64.07,64.07,0,0,1,128,192Z"/>
            </svg>
            <span>Settings</span>
          </a>
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-storehub-border bg-storehub-card">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-storehub-orange rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-medium">SH</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-storehub-blue">StoreHub</div>
            <div className="text-xs text-storehub-gray">Sales Intelligence</div>
          </div>
        </div>
      </div>
    </div>
  );
}
