import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroPhotoRef = useRef(null);

  useEffect(() => {
    // IIFE animation helper & fallback
    const appears = document.querySelectorAll('.appear');

    appears.forEach((el) => {
      el.addEventListener(
        'animationend',
        () => {
          el.classList.add('is-in');
        },
        { once: true }
      );
    });

    if (heroPhotoRef.current) {
      heroPhotoRef.current.addEventListener(
        'animationend',
        () => {
          heroPhotoRef.current?.classList.add('is-in');
        },
        { once: true }
      );
    }

    // Two rAF check for animation support fallback
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let isAnimated = false;
        if (appears.length > 0 && typeof appears[0].getAnimations === 'function') {
          const anims = appears[0].getAnimations();
          if (anims.length > 0 && (anims[0].playState === 'running' || anims[0].playState === 'finished')) {
            isAnimated = true;
          }
        }
        if (!isAnimated) {
          appears.forEach((el) => el.classList.add('is-in'));
          if (heroPhotoRef.current) heroPhotoRef.current.classList.add('is-in');
        }
      });
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 901) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [menuOpen]);

  return (
    <>
      <style>{`
        /* ============================================================
           InsightX — AI Business Investigator Single Viewport
           ============================================================ */

        html, body { background: #000000 !important; color: #ffffff; }
        
        :root {
          --bg: #000000;
          --text: #ffffff;
          --muted: #9a9a9a;
          --stat: #d8d8d8;
          --border: rgba(255, 255, 255, 0.16);
          --border-soft: rgba(255, 255, 255, 0.12);

          --logo: 15.5px;
          --logo-mark: 22px;
          --nav: 14px;
          --nav-h: 40px;
          --btn: 13.5px;
          --btn-h: 40px;
          --hero-btn-h: 42px;
          --h1: 48px;
          --lede: 15.5px;
          --badge: 12.5px;
          --stat-size: 13.5px;
          --header-y: 22px;
          --header-x: 40px;
          --stats-x: 72px;
          --stats-y: 36px;
          --hero-gap: 85px;
          --copy-max: 860px;
          --lede-max: 520px;
        }

        html, body {
          background: #000000;
          background: var(--bg, #000000);
          color: #ffffff;
          color: var(--text, #ffffff);
          font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          overflow-x: hidden;
          position: relative;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        a { color: inherit; text-decoration: none; }
        button { font-family: inherit; }

        /* Grain texture at z-index 100 */
        .grain {
          position: fixed;
          inset: 0;
          z-index: 100;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 128px;
        }

        /* Hero Video Background */
        .hero-photo {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          opacity: 1;
        }

        .hero-photo-scrim {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
        }

        /* Single viewport page grid */
        .page {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-height: 100dvh;
        }

        /* Header layout */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--header-y) var(--header-x) 10px;
          z-index: 50;
          position: relative;
        }

        .logo {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-size: var(--logo);
          font-weight: 600;
          letter-spacing: -0.03em;
          color: #fff;
          text-decoration: none;
        }

        .logo-suffix {
          font-weight: 700;
          color: #6366f1;
        }

        /* Left Arrow Navigation System (Positioned on Left - Vertically Centered) */
        .left-arrow-nav {
          position: fixed;
          left: var(--header-x, clamp(32px, 4vw, 64px));
          top: 25%;

          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
          z-index: 45;
          pointer-events: auto;
        }

        .arrow-nav-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          padding: 3px 0;
          color: rgba(255, 255, 255, 0.62);
          font-family: inherit;
          font-size: 15.5px;
          font-weight: 500;
          letter-spacing: -0.01em;
          text-decoration: none;
          cursor: pointer;
          transform-origin: left center;
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, color;
        }

        .arrow-nav-symbol {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1;
          color: rgba(255, 255, 255, 0.45);
          transform: translateX(0);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform, color;
        }

        .arrow-nav-text {
          transition: color 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Hover Effect:
           1. Text smoothly increases in size (scale ~1.08)
           2. Text becomes brighter
           3. Arrow becomes more visible
           4. Arrow moves 6–12px LEFT (still pointing RIGHT →)
           5. Complete navigation item subtly shifts LEFT
           6. Arrow and text feel like they are moving together */
        .arrow-nav-item:hover {
          color: #ffffff;
          transform: translateX(-4px) scale(1.08);
        }

        .arrow-nav-item:hover .arrow-nav-symbol {
          color: #ffffff;
          transform: translateX(-9px);
        }

        .arrow-nav-item:hover .arrow-nav-text {
          color: #ffffff;
        }

        /* Active State */
        .arrow-nav-item.is-active {
          color: #ffffff;
          font-weight: 600;
          transform: scale(1.04);
        }

        .arrow-nav-item.is-active .arrow-nav-symbol {
          color: #6366f1;
        }

        .arrow-nav-item.is-active .arrow-nav-text {
          color: #ffffff;
        }

        /* Shared button styles */
        .btn {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: var(--btn-h);
          padding: 0 16px;
          border-radius: 6px;
          font-size: var(--btn);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.35s ease, border 0.35s ease, box-shadow 0.35s ease, color 0.35s ease, filter 0.35s ease;
        }

        .btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.45) 48%, transparent 76%);
          transform: translateX(-130%);
          transition: transform 0.65s ease;
          pointer-events: none;
        }

        .btn:hover::after {
          transform: translateX(130%);
        }

        /* Solid button */
        .btn-solid {
          background: linear-gradient(180deg, #ffffff 0%, #e7e7e7 48%, #cfcfcf 100%);
          color: #111;
          border: 1px solid #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.95);
        }

        .btn-solid:hover {
          background: linear-gradient(180deg, #ffffff 0%, #f3f6ff 42%, #d5def2 100%);
          border-color: #f2f6ff;
          box-shadow: inset 0 1px 0 #fff, 0 0 22px rgba(186,208,255,0.35), 0 8px 18px rgba(255,255,255,0.12);
        }

        .header-cta {
          justify-self: end;
        }

        /* Hero Ghost Button */
        .btn-ghost-hero {
          background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(0,0,0,0.5) 46%, rgba(150,170,200,0.1));
          color: #fff;
          border: 1px solid rgba(198,198,198,0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          height: var(--hero-btn-h);
          padding: 0 18px;
        }

        .btn-ghost-hero:hover {
          border-color: rgba(220,230,255,0.8);
          box-shadow: 0 0 24px rgba(170,200,255,0.28);
        }

        .hero-btn-solid {
          height: var(--hero-btn-h);
          padding: 0 18px;
        }

        .hero-btn-solid:hover {
          box-shadow: inset 0 1px 0 #fff, 0 0 26px rgba(186,208,255,0.4), 0 8px 18px rgba(255,255,255,0.14);
        }

        /* Burger button */
        .burger {
          display: none;
          width: 42px;
          height: 42px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: rgba(8,8,8,0.55);
          z-index: 60;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
        }

        .burger span {
          display: block;
          width: 16px;
          height: 1.5px;
          background: #ffffff;
          border-radius: 1px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }

        body.menu-open .burger span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }
        body.menu-open .burger span:nth-child(2) {
          opacity: 0;
        }
        body.menu-open .burger span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* Menu backdrop */
        .menu-backdrop {
          display: none;
        }

        /* Hero Container (Centered) */
        .hero {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 24px 48px;
          min-height: 0;
          flex: 1;
        }

        .hero-copy {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: var(--copy-max);
          width: 100%;
        }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 22px;
          padding: 9px 15px;
          border: 0;
          border-radius: 5px;
          background: linear-gradient(90deg, #7d7d7d 0%, #2a2a2a 52%, #0a0a0a 100%);
          color: #f2f2f2;
          font-size: var(--badge);
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .badge-star {
          display: inline-flex;
          animation: in-star 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both;
        }

        /* H1 */
        .headline {
          font-size: var(--h1);
          font-weight: 500;
          letter-spacing: -0.045em;
          line-height: 1.12;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .headline-line {
          display: block;
          overflow: hidden;
          padding: 0.06em 0.15em 0.14em;
        }

        .headline em {
          font-family: "Instrument Serif", "Times New Roman", Times, serif;
          font-style: italic;
          font-weight: 400;
          font-size: 1.08em;
          letter-spacing: -0.03em;
          color: #9a9a9a;
          animation: in-em 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.72s both;
        }

        /* Lede */
        .lede {
          max-width: var(--lede-max);
          margin-top: 18px;
          color: #9a9a9a;
          font-size: var(--lede);
          font-weight: 400;
          line-height: 1.55;
          letter-spacing: -0.015em;
        }

        /* Hero Actions */
        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        /* Stats Footer */
        .stats {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 0 var(--stats-x) var(--stats-y);
          padding-bottom: max(var(--stats-y), env(safe-area-inset-bottom));
          color: var(--stat);
        }

        .stat {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          font-size: var(--stat-size);
          letter-spacing: -0.015em;
          white-space: nowrap;
        }

        .stat-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: #e8e8e8;
        }

        .stat-icon-wide {
          width: 38px;
          height: 21px;
          flex-shrink: 0;
        }

        /* ============================================================
           Entrance Motion & Keyframes
           ============================================================ */

        .appear {
          opacity: 1;
          animation-duration: 1.05s;
          animation-fill-mode: both;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-delay: var(--d, 0.08s);
        }

        .appear--scale { animation-name: in-scale; }
        .appear--soft { animation-name: in-soft; }
        .appear--mask { animation-name: in-mask; }
        .appear--pop { animation-name: in-pop; }
        .appear--btn { animation-name: in-btn; }
        .appear--side { animation-name: in-side; }
        .appear--stat { animation-name: in-stat; }

        .appear.is-in {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
          clip-path: none !important;
          filter: none !important;
        }

        @keyframes in-scale {
          0% { opacity: 0; transform: scale(0.84); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes in-soft {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes in-mask {
          0% { opacity: 0; transform: translateY(40%); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes in-pop {
          0% { opacity: 0; transform: scale(0.9); }
          70% { transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes in-btn {
          0% { opacity: 0; transform: translateY(18px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes in-side {
          0% { opacity: 0; transform: translateX(22px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes in-stat {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes in-star {
          0% { transform: scale(0.2) rotate(-50deg); opacity: 0; }
          65% { transform: scale(1.2) rotate(8deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes in-em {
          0% { opacity: 0.35; filter: blur(4px); }
          100% { opacity: 1; filter: blur(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            transition: none !important;
            animation: none !important;
          }
          .appear, .hero-photo, .headline em, .badge-star {
            opacity: 1 !important;
            transform: none !important;
            clip-path: none !important;
            filter: none !important;
          }
        }

        /* ============================================================
           Responsive Breakpoints
           ============================================================ */

        /* Desktop Lock (≥901px) */
        @media (min-width: 901px) {
          html, body {
            height: 100%;
            overflow: hidden;
          }
          .page {
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
          }
        }

        @media (min-width: 1280px) and (max-width: 1599px) {
          :root {
            --h1: 54px;
            --lede: 16px;
            --header-x: 48px;
            --stats-x: 80px;
            --copy-max: 900px;
          }
        }

        @media (min-width: 1600px) {
          :root {
            --logo: 17px;
            --logo-mark: 24px;
            --nav: 15px;
            --nav-h: 44px;
            --btn: 15px;
            --btn-h: 44px;
            --hero-btn-h: 48px;
            --h1: 64px;
            --lede: 18px;
            --badge: 13.5px;
            --stat-size: 15px;
            --header-y: 28px;
            --header-x: 64px;
            --stats-x: 96px;
            --stats-y: 44px;
            --copy-max: 980px;
            --lede-max: 540px;
          }
          .nav-pill { padding: 0 20px; }
          .badge { margin-bottom: 26px; }
          .lede { margin-top: 22px; }
          .hero-actions { margin-top: 30px; gap: 12px; }
          .stat-icon { width: 22px; height: 22px; }
          .stat-icon-wide { width: 45px; height: 24px; }
        }

        @media (min-width: 1920px) {
          :root {
            --logo: 18px;
            --logo-mark: 26px;
            --nav: 16px;
            --nav-h: 48px;
            --btn: 16px;
            --btn-h: 48px;
            --hero-btn-h: 52px;
            --h1: 76px;
            --lede: 20px;
            --badge: 14.5px;
            --stat-size: 16px;
            --header-y: 32px;
            --header-x: 80px;
            --stats-x: 120px;
            --stats-y: 52px;
            --copy-max: 1120px;
            --lede-max: 620px;
          }
          .nav { gap: 10px; }
          .nav-pill { padding: 0 22px; }
          .btn { padding: 0 22px; }
          .badge { padding: 10px 15px; }
          .stat-icon-wide { width: 48px; height: 26px; }
        }

        @media (min-width: 2560px) {
          :root {
            --h1: 88px;
            --lede: 22px;
            --header-x: 120px;
            --stats-x: 160px;
            --copy-max: 1280px;
            --lede-max: 680px;
          }
        }

        @media (min-width: 901px) and (max-width: 1279px) {
          :root {
            --logo: 15px;
            --nav: 13px;
            --nav-h: 36px;
            --btn: 13px;
            --btn-h: 38px;
            --hero-btn-h: 40px;
            --h1: 42px;
            --lede: 15px;
            --badge: 12px;
            --stat-size: 12.5px;
            --header-y: 16px;
            --header-x: 28px;
            --stats-x: 36px;
            --stats-y: 28px;
            --hero-gap: 64px;
            --copy-max: 760px;
            --lede-max: 440px;
          }
          .nav-pill { padding: 0 14px; }
          .badge { margin-bottom: 16px; }
          .lede { margin-top: 14px; }
          .hero-actions { margin-top: 20px; }
        }

        @media (min-width: 901px) and (max-height: 850px) {
          :root {
            --header-y: 14px;
            --stats-y: 24px;
            --hero-gap: 48px;
            --h1: 40px;
          }
          .badge { margin-bottom: 12px; }
          .lede { margin-top: 12px; }
          .hero-actions { margin-top: 16px; }
        }

        @media (min-width: 901px) and (max-height: 720px) {
          :root {
            --h1: 34px;
            --lede: 14px;
            --hero-gap: 32px;
            --stats-y: 18px;
            --nav-h: 30px;
            --btn-h: 34px;
            --hero-btn-h: 36px;
          }
          .badge { margin-bottom: 8px; }
        }

        /* Mobile Viewport (≤900px) */
        @media (max-width: 900px) {
          html, body {
            height: auto;
            overflow-y: auto;
          }
          .page {
            min-height: 100vh;
            min-height: 100dvh;
            height: auto;
          }
          :root {
            --logo: 16px;
            --btn: 15px;
            --btn-h: 46px;
            --hero-btn-h: 48px;
            --h1: 36px;
            --lede: 16.5px;
            --badge: 13.5px;
            --stat-size: 15px;
            --header-y: 16px;
            --header-x: 18px;
            --stats-x: 20px;
            --stats-y: 28px;
            --hero-gap: 36px;
            --copy-max: 100%;
            --lede-max: 100%;
          }
          .header {
            grid-template-columns: 1fr auto auto;
            gap: 8px;
            padding-left: max(var(--header-x), env(safe-area-inset-left));
            padding-right: max(var(--header-x), env(safe-area-inset-right));
            padding-top: max(var(--header-y), env(safe-area-inset-top));
          }
          .logo, .header-cta, .burger {
            z-index: 80;
          }
          .burger {
            display: flex;
          }
          .nav {
            display: none;
          }
          .menu-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 40;
            background: rgba(8,8,8,0.42);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.28s ease, visibility 0.28s ease;
          }
          body.menu-open .menu-backdrop {
            opacity: 1;
            visibility: visible;
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
          }
          body.menu-open .nav {
            display: flex;
            position: fixed;
            inset: 0;
            z-index: 45;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 96px 22px 32px;
            padding-top: max(96px, calc(env(safe-area-inset-top) + 88px));
            background: transparent;
          }
          body.menu-open .nav-pill {
            width: 100%;
            height: 56px;
            font-size: 19px;
            border-radius: 10px;
          }
          body.menu-open {
            overflow: hidden;
          }
          .hero {
            padding: 20px 20px 64px;
            align-items: flex-end;
          }
          .stats {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            white-space: normal;
          }
        }

        @media (max-width: 560px) {
          :root {
            --h1: 34px;
            --lede: 16px;
            --header-x: 16px;
          }
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }
          .hero-actions .btn {
            width: 100%;
          }
        }
      `}</style>

      {/* 1. Grain overlay */}
      <div className="grain" aria-hidden="true" />

      {/* 2. Hero video background */}
      <video
        ref={heroPhotoRef}
        className="hero-photo appear"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260818_072341_50851634-bbc3-4c33-9acc-7647d4db44aa.mp4"
      />
      <div className="hero-photo-scrim" aria-hidden="true" />

      {/* 3. Single-viewport page */}
      <div className="page">
        {/* Mobile menu backdrop */}
        <div
          className="menu-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Header (3-column grid) */}
        <header className="header">
          {/* Left: Logo */}
          <Link
            to="/"
            className="logo appear appear--scale"
            style={{ '--d': '0.08s' }}
            aria-label="InsightX"
          >
            <svg
              className="stat-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: 'var(--logo-mark)', height: 'var(--logo-mark)' }}
            >
              <g transform="rotate(-30 12 12)">
                <circle cx="7.3" cy="3.2" r="1.45" />
                <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
                <circle cx="16.7" cy="20.8" r="1.45" />
              </g>
            </svg>
            <span>Insight<span className="logo-suffix">X</span></span>
          </Link>

          {/* Right: Burger Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="burger appear appear--scale"
              style={{ '--d': '0.34s' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-controls="site-nav"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </header>

        {/* ============================================================
            Left Arrow Navigation (Vertically arranged on LEFT side)
            ============================================================ */}
        <nav className="left-arrow-nav appear appear--side" style={{ '--d': '0.22s' }} aria-label="Observatory Navigation">
          <Link
            to="/dashboard"
            className="arrow-nav-item"
          >
            <span className="arrow-nav-symbol">→</span>
            <span className="arrow-nav-text">Dashboard</span>
          </Link>

          <Link
            to="/investigations"
            className="arrow-nav-item"
          >
            <span className="arrow-nav-symbol">→</span>
            <span className="arrow-nav-text">Investigations</span>
          </Link>

          <Link
            to="/investigations/revenue-decline"
            className="arrow-nav-item"
          >
            <span className="arrow-nav-symbol">→</span>
            <span className="arrow-nav-text">Evidence</span>
          </Link>

          <Link
            to="/recommendations"
            className="arrow-nav-item"
          >
            <span className="arrow-nav-symbol">→</span>
            <span className="arrow-nav-text">Recommendations</span>
          </Link>

          <Link
            to="/actions"
            className="arrow-nav-item"
          >
            <span className="arrow-nav-symbol">→</span>
            <span className="arrow-nav-text">Actions</span>
          </Link>
        </nav>

        {/* Hero (Bottom-centered) */}
        <main className="hero" id="top">
          <div className="hero-copy">
            {/* Badge */}
            <div className="badge appear appear--pop" style={{ '--d': '0.22s' }}>
              <span className="badge-star">
                <svg width="18" height="20" viewBox="0 0 24 24" fill="white" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.45))' }}>
                  <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
                </svg>
              </span>
              <span>AI Business Investigator</span>
            </div>

            {/* H1 (Two masked lines featuring InsightX core promise) */}
            <h1 className="headline">
              <span className="headline-line">
                <span className="appear appear--mask" style={{ '--d': '0.42s', display: 'inline-block' }}>
                  Your dashboard shows <em>what changed.</em>
                </span>
              </span>
              <span className="headline-line">
                <span className="appear appear--mask" style={{ '--d': '0.62s', display: 'inline-block' }}>
                  We explain why.
                </span>
              </span>
            </h1>

            {/* Lede */}
            <p className="lede appear appear--soft" style={{ '--d': '0.82s', animationDuration: '1.25s' }}>
              AI-powered business investigation that detects anomalies, connects evidence, evaluates possible causes, and recommends the next action.
            </p>

            {/* Hero Actions */}
            <div className="hero-actions">
              <Link
                to="/dashboard"
                className="btn btn-solid hero-btn-solid appear appear--btn"
                style={{ '--d': '0.96s' }}
              >
                Start an Investigation
              </Link>
              <Link
                to="/investigations/revenue-decline"
                className="btn btn-ghost-hero appear appear--side"
                style={{ '--d': '1.10s' }}
              >
                Explore NovaMart Anomaly
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
