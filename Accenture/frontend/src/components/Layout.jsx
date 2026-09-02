import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import Reference3DBackground from './Reference3DBackground';

export function LogoMark({ className = 'w-6 h-6' }) {
  return (
    <div className={`rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#3b82f6] flex items-center justify-center font-black text-xs text-white shadow-md shadow-[#6366f1]/20 ${className}`}>
      IX
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-white font-sans relative select-none bg-[#050b16]">
      <Reference3DBackground />

      <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 lg:px-10 py-4 border-b border-white/[0.08] bg-[#08111f]/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 min-w-0" aria-label="InsightX home">
          <LogoMark />
          <div className="min-w-0">
            <div className="text-sm font-bold tracking-tight text-white">Insight<span className="text-[#7ca9ff]">X</span></div>
            <div className="hidden sm:block text-[10px] uppercase tracking-[0.16em] text-white/40">Business intelligence workspace</div>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white/80 transition-colors hover:border-[#7ca9ff]/40 hover:bg-[#7ca9ff]/10 hover:text-white"
        >
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>
      </header>

      <main className="flex-1 w-full overflow-y-auto relative z-10 px-4 sm:px-8 lg:px-10 py-6 scrollbar-thin scrollbar-thumb-white/10">
        {children}
      </main>
    </div>
  );
}
