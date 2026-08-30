import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function LogoMark({ className = 'w-6 h-6' }) {
  return (
    <div className={`rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#3b82f6] flex items-center justify-center font-black text-xs text-white shadow-md shadow-[#6366f1]/20 ${className}`}>
      IX
    </div>
  );
}

export const NAV_ROUTES = [
  { name: 'Dashboard', path: '/dashboard', index: 0 },
  { name: 'Investigations', path: '/investigations', index: 1 },
  { name: 'Evidence', path: '/investigations/revenue-decline/evidence', index: 2 },
  { name: 'Recommendations', path: '/recommendations', index: 3 },
  { name: 'Actions', path: '/actions', index: 4 }
];

export function getRouteIndex(pathname) {
  if (pathname.startsWith('/investigations/') && pathname.includes('evidence')) return 2;
  if (pathname.startsWith('/investigations/')) return 1;
  const match = NAV_ROUTES.find(r => pathname === r.path || (r.path !== '/dashboard' && pathname.startsWith(r.path)));
  return match ? match.index : 0;
}

export default function FloatingNavigation() {
  const location = useLocation();

  const isItemActive = (item) => {
    if (item.path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (item.name === 'Evidence') {
      return location.pathname.includes('evidence');
    }
    if (item.name === 'Investigations') {
      return location.pathname.startsWith('/investigations') && !location.pathname.includes('evidence');
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Top Left Floating Brand Mark */}
      <div className="fixed top-6 left-8 sm:left-12 z-50 pointer-events-auto">
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          <LogoMark />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white leading-none">
              Insight<span className="text-[#6366f1]">X</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-white/40 font-semibold mt-0.5">
              AI Business Investigator
            </span>
          </div>
        </Link>
      </div>

      {/* Left Minimal Floating Text Navigation (No boxes, no borders, no pills) */}
      <nav 
        className="fixed left-8 sm:left-12 top-1/2 -translate-y-1/2 z-40 flex flex-col items-start gap-6 pointer-events-auto select-none"
        aria-label="Observatory Navigation"
      >
        {NAV_ROUTES.map((item) => {
          const active = isItemActive(item);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group inline-flex items-center gap-2.5 text-[15px] sm:text-base font-medium tracking-tight transition-all duration-300 transform-gpu bg-transparent border-0 p-0 outline-none ${
                active 
                  ? 'text-white font-semibold scale-[1.06]' 
                  : 'text-white/50 hover:text-white hover:-translate-x-1 hover:scale-[1.08]'
              }`}
            >
              <span 
                className={`text-sm transition-all duration-300 inline-block will-change-transform ${
                  active 
                    ? 'text-[#6366f1] font-bold' 
                    : 'text-white/40 group-hover:text-white group-hover:-translate-x-2.5'
                }`}
              >
                →
              </span>
              <span className="transition-colors duration-300">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
