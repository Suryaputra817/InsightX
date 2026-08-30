import React from 'react';
import { useLocation } from 'react-router-dom';
import Reference3DBackground from './Reference3DBackground';

export function LogoMark({ className = 'w-6 h-6' }) {
  return (
    <div className={`rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#3b82f6] flex items-center justify-center font-black text-xs text-white shadow-md shadow-[#6366f1]/20 ${className}`}>
      IX
    </div>
  );
}

export default function Layout({ children }) {
  const location = useLocation();
  const isStagePage = location.pathname.startsWith('/stage/');

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden text-white font-sans relative select-none ${
      isStagePage ? 'bg-[#0a0b10]' : ''
    }`}>
      {/* Persistent Shared 3D Intelligence Background (only on main dashboard & non-stage pages) */}
      {!isStagePage && <Reference3DBackground />}

      {/* Full-Width Visual Canvas Content */}
      <main className="flex-1 w-full overflow-y-auto relative z-10 px-4 sm:px-8 lg:px-10 py-6 scrollbar-thin scrollbar-thumb-white/10">
        {children}
      </main>
    </div>
  );
}
