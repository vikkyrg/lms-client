import React, { useState, useEffect } from 'react';

/**
 * HeroBackgroundWaves
 * 
 * Restored original large, smooth, layered flowing wave design
 * recolored to the official AutoOps School brand identity:
 * - Primary Blue: #1F70F7
 * - Light Blue: #DCEBFF
 * - Very Light Blue: #EFF6FF
 * - Crisp White: #FFFFFF
 * - Logo-inspired subtle gradient accent (Blue -> Purple -> Magenta) applied minimally.
 * 
 * Completely eliminates all yellow waves, dots, crosses, and thin lines while preserving
 * the exact fluid curved proportions, layering, and smooth entrance animation.
 */
export const HeroBackgroundWaves = ({ variant = 'default', className = '' }) => {
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimReady(true);
      return;
    }

    const timer = setTimeout(() => {
      setAnimReady(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* Wave Transition Styles */}
      <style>{`
        .hb-wave-layer {
          transition: transform 1.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.25s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        .hb-sky-top-init {
          opacity: 0;
          transform: translate(60px, -45px) scale(0.96);
        }
        .hb-sky-top-in {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .hb-sky-bot-init {
          opacity: 0;
          transform: translate(-50px, 45px) scale(0.96);
        }
        .hb-sky-bot-in {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .hb-accent-top-init {
          opacity: 0;
          transform: translate(35px, -25px) scale(0.95);
        }
        .hb-accent-top-in {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .hb-bot-right-init {
          opacity: 0;
          transform: translate(40px, 40px) scale(0.96);
        }
        .hb-bot-right-in {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .hb-glow-init {
          opacity: 0;
          transform: scale(0.85);
        }
        .hb-glow-in {
          opacity: 1;
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .hb-wave-layer,
          .hb-sky-top-init, .hb-sky-top-in,
          .hb-sky-bot-init, .hb-sky-bot-in,
          .hb-accent-top-init, .hb-accent-top-in,
          .hb-bot-right-init, .hb-bot-right-in,
          .hb-glow-init, .hb-glow-in {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Atmospheric ambient soft blue depth behind waves */}
      <div
        className={`hb-wave-layer absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#DCEBFF]/50 via-[#EFF6FF]/30 to-transparent blur-3xl ${
          animReady ? 'hb-glow-in' : 'hb-glow-init'
        }`}
        style={{ transitionDelay: '150ms', transitionDuration: '1.4s' }}
      />
      <div
        className={`hb-wave-layer absolute -bottom-32 -right-20 w-[540px] h-[540px] rounded-full bg-gradient-to-tl from-[#DCEBFF]/45 via-[#EFF6FF]/25 to-transparent blur-3xl ${
          animReady ? 'hb-glow-in' : 'hb-glow-init'
        }`}
        style={{ transitionDelay: '300ms', transitionDuration: '1.4s' }}
      />

      {/* Restored Large, Layered Organic SVG Waves */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 640"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Top-Right Sky/Light Blue Gradient */}
          <linearGradient id="hb-blue-top" x1="1" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#CBE4FF" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#DCEBFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
          </linearGradient>

          {/* Top-Right Secondary Soft Accent (Light Indigo / Blue) */}
          <linearGradient id="hb-accent-top" x1="1" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#BFDBFE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
          </linearGradient>

          {/* Bottom-Left Stronger Primary Blue Wave Gradient */}
          <linearGradient id="hb-blue-bot-strong" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stopColor="#1F70F7" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#60A5FA" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
          </linearGradient>

          {/* Bottom-Left Base Wave Soft Fill */}
          <linearGradient id="hb-blue-bot-base" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stopColor="#DCEBFF" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#E6F1FE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0" />
          </linearGradient>

          {/* Bottom-Right Blue Curve Gradient */}
          <linearGradient id="hb-blue-bot-right" x1="1" y1="1" x2="0.2" y2="0">
            <stop offset="0%" stopColor="#BFDBFE" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#DBEAFE" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Logo-inspired subtle ribbon gradient (small refined accent only) */}
          <linearGradient id="hb-logo-ribbon" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F70F7" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#6366F1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* ========================================================================= */}
        {/* 1. TOP-RIGHT LAYER: Large, Smooth Flowing Curves (Light Blue & White)     */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-sky-top-in' : 'hb-sky-top-init'}`}
          style={{ transitionDelay: '0ms', transformOrigin: 'top right' }}
        >
          {/* Layer 1: Broadest, softest backdrop curve */}
          <path
            d="M820 0C980 45 1160 85 1440 45V0H820Z"
            fill="#EFF6FF"
            fillOpacity="0.85"
          />

          {/* Layer 2: Defined smooth organic curve */}
          <path
            d="M960 0C1100 80 1260 135 1440 100V0H960Z"
            fill="#DCEBFF"
            fillOpacity="0.65"
          />

          {/* Layer 3: Deepest sky blue sweep */}
          <path
            d="M1090 0C1220 95 1330 160 1440 175V0H1090Z"
            fill="url(#hb-blue-top)"
          />
        </g>

        {/* ========================================================================= */}
        {/* 2. BOTTOM-LEFT LAYER: Large, Smooth Anchor Curves (Slightly Stronger Blue) */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-sky-bot-in' : 'hb-sky-bot-init'}`}
          style={{ transitionDelay: '100ms', transformOrigin: 'bottom left' }}
        >
          {/* Layer 1: Broadest base curve */}
          <path
            d="M0 360C140 375 290 450 420 640H0V360Z"
            fill="#EFF6FF"
            fillOpacity="0.9"
          />

          {/* Layer 2: Defined light blue contour */}
          <path
            d="M0 430C110 440 230 500 320 640H0V430Z"
            fill="#DCEBFF"
            fillOpacity="0.75"
          />

          {/* Layer 3: Corner anchor sweep with stronger brand blue presence */}
          <path
            d="M0 500C70 510 160 550 210 640H0V500Z"
            fill="url(#hb-blue-bot-strong)"
          />

          {/* Rising crest on left margin */}
          <path
            d="M0 290C50 310 95 350 120 400C85 365 45 330 0 320V290Z"
            fill="#BFDBFE"
            fillOpacity="0.45"
          />
        </g>

        {/* ========================================================================= */}
        {/* 3. REFINED CURVED ACCENTS (Replacing former yellow arcs with brand blue)   */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-accent-top-in' : 'hb-accent-top-init'}`}
          style={{ transitionDelay: '200ms', transformOrigin: 'top right' }}
        >
          {/* Top-Right curved wave accent */}
          <path
            d="M1120 0C1230 50 1340 75 1440 70V28C1360 22 1270 12 1120 0Z"
            fill="url(#hb-accent-top)"
          />

          {/* Delicate ribbon accent with subtle brand gradient */}
          <path
            d="M1240 0C1320 65 1390 110 1440 125V105C1395 90 1335 55 1260 0H1240Z"
            fill="url(#hb-logo-ribbon)"
          />
        </g>

        <g
          className={`hb-wave-layer ${animReady ? 'hb-accent-top-in' : 'hb-accent-top-init'}`}
          style={{ transitionDelay: '250ms', transformOrigin: 'bottom left' }}
        >
          {/* Bottom-Left curved wave accent */}
          <path
            d="M0 410C95 420 190 465 250 535L225 560C170 505 85 465 0 455V410Z"
            fill="url(#hb-accent-top)"
          />
        </g>

        {/* ========================================================================= */}
        {/* 4. BOTTOM-RIGHT CORNER WAVES (Smooth Light Blue Balances)                  */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-bot-right-in' : 'hb-bot-right-init'}`}
          style={{ transitionDelay: '220ms', transformOrigin: 'bottom right' }}
        >
          {/* Smooth very light blue sweep */}
          <path
            d="M1000 640C1150 575 1300 560 1440 550V640H1000Z"
            fill="#EFF6FF"
            fillOpacity="0.75"
          />

          {/* Light blue wave accent */}
          <path
            d="M1120 640C1220 590 1340 580 1440 575V640H1120Z"
            fill="url(#hb-blue-bot-right)"
          />

          {/* Base soft blue under-wave */}
          <path
            d="M1220 640C1300 610 1375 605 1440 605V640H1220Z"
            fill="#DCEBFF"
            fillOpacity="0.65"
          />
        </g>
      </svg>
    </div>
  );
};

export default HeroBackgroundWaves;
