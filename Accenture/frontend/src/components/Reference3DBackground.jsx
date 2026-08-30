import React from 'react';

// A quiet, CSS-only background keeps data screens readable and avoids the GPU,
// video, and animation cost of the previous observatory scene.
export default function Reference3DBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden insightx-background" aria-hidden="true">
      <div className="insightx-background__grid" />
      <div className="insightx-background__glow insightx-background__glow--top" />
      <div className="insightx-background__glow insightx-background__glow--bottom" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,22,0.25)_0%,rgba(5,11,22,0.78)_72%,#050b16_100%)]" />
    </div>
  );
}
