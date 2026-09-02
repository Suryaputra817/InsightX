import React, { useRef, useEffect } from 'react';

/**
 * 5D Motion Background:
 * Layer 1 (Z=0) — deep space dark base
 * Layer 2 (Z=1) — animated mesh grid with pulse
 * Layer 3 (Z=2) — large slow-drifting color orbs (depth / parallax feel)
 * Layer 4 (Z=3) — medium faster orbs
 * Layer 5 (Z=4) — floating particles + scanline sheen
 */
export default function Reference3DBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* ── Layer 1: Base deep-space gradient ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,#050e1f_0%,#020810_55%,#000408_100%)]" />

      {/* ── Layer 2: Animated perspective grid ── */}
      <div className="insightx-bg-grid" />

      {/* ── Layer 3: Large slow drifting orbs (deep / far) ── */}
      <div className="insightx-orb insightx-orb--a" />
      <div className="insightx-orb insightx-orb--b" />
      <div className="insightx-orb insightx-orb--c" />

      {/* ── Layer 4: Medium faster orbs (mid layer) ── */}
      <div className="insightx-orb insightx-orb--d" />
      <div className="insightx-orb insightx-orb--e" />

      {/* ── Layer 5: Floating particles (top / near) ── */}
      {Array.from({length: 22}).map((_,i) => (
        <div key={i} className="insightx-particle" style={{
          left: `${(i * 4.7 + 3) % 100}%`,
          top: `${(i * 7.3 + 10) % 100}%`,
          animationDelay: `${(i * 0.45) % 8}s`,
          animationDuration: `${6 + (i % 5)}s`,
          width: `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
          opacity: 0.15 + (i % 4) * 0.08,
        }}/>
      ))}

      {/* ── Scanline sheen overlay ── */}
      <div className="insightx-scanlines" />

      {/* ── Depth vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,16,0.1)_0%,transparent_30%,transparent_70%,rgba(2,8,16,0.85)_100%)]" />
    </div>
  );
}
