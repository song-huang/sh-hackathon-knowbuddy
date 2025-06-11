'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to the enhanced demo page
    window.location.href = '/demo.html';
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">ProspectPulse</h1>
        <p className="text-gray-400">Redirecting to enhanced demo...</p>
      </div>
    </div>
  );
}
