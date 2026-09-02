import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { ChevronLeft, ChevronRight, Layers, Compass } from 'lucide-react';
import { NAV_ROUTES, getRouteIndex } from './FloatingNavigation';

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? '60%' : '-60%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(8px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? '-60%' : '60%',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(8px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function SlidingPageContainer({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = getRouteIndex(location.pathname);
  const prevIndexRef = useRef(currentIndex);

  const direction = currentIndex >= prevIndexRef.current ? 1 : -1;

  useEffect(() => {
    prevIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      navigate(NAV_ROUTES[currentIndex - 1].path);
    }
  };

  const handleNext = () => {
    if (currentIndex < NAV_ROUTES.length - 1) {
      navigate(NAV_ROUTES[currentIndex + 1].path);
    }
  };

  // Keyboard navigation (Left / Right Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid overriding if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
      {/* Interactive Main Stage Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center">
        {/* Left Arrow Interactive Control (<) */}
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-40 p-2.5 sm:p-3.5 rounded-2xl bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/30 text-white/60 hover:text-white backdrop-blur-xl transition-all duration-300 transform-gpu hover:scale-110 hover:-translate-x-1 shadow-2xl group cursor-pointer"
            title={`Previous: ${NAV_ROUTES[currentIndex - 1].name}`}
            aria-label="Previous Stage"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        {/* Right Arrow Interactive Control (>) */}
        {currentIndex < NAV_ROUTES.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-40 p-2.5 sm:p-3.5 rounded-2xl bg-black/40 hover:bg-black/70 border border-white/10 hover:border-white/30 text-white/60 hover:text-white backdrop-blur-xl transition-all duration-300 transform-gpu hover:scale-110 hover:translate-x-1 shadow-2xl group cursor-pointer"
            title={`Next: ${NAV_ROUTES[currentIndex + 1].name}`}
            aria-label="Next Stage"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}

        {/* Animated Active Stage Panel */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full overflow-y-auto px-4 sm:px-12 lg:px-16 py-6 pb-20 scrollbar-thin scrollbar-thumb-white/10"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Interactive Stage Indicator Bar */}
      <footer className="h-14 w-full flex items-center justify-between px-6 sm:px-12 z-30 shrink-0 border-t border-white/[0.05] bg-[#0c0c0c]/60 backdrop-blur-xl pointer-events-auto">
        <div className="flex items-center space-x-3 text-xs text-white/50">
          <Compass className="w-3.5 h-3.5 text-[#6366f1]" />
          <span className="font-mono text-white/80">Stage {String(currentIndex + 1).padStart(2, '0')} / 05</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline font-semibold text-white/90">{NAV_ROUTES[currentIndex].name}</span>
        </div>

        {/* Interactive Step Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {NAV_ROUTES.map((route, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={route.name}
                onClick={() => navigate(route.path)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-8 sm:w-10 bg-gradient-to-r from-[#6366f1] to-[#3b82f6] shadow-sm shadow-[#6366f1]/50'
                    : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/40 hover:w-4'
                }`}
                title={`Go to ${route.name}`}
                aria-label={`Go to ${route.name}`}
              />
            );
          })}
        </div>

        {/* Stage Name / Shortcut Hint */}
        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-white/40">
          <span>Use</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white/70 font-mono text-[10px]">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-white/70 font-mono text-[10px]">→</kbd>
          <span>to navigate stages</span>
        </div>
      </footer>
    </div>
  );
}
