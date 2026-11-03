import React, { useState, useEffect } from 'react';

/**
 * HeroBackgroundWaves
 * Provides the signature AutoOps School flowing sky-blue & warm yellow wave decoration
 * across the hero background, with a polished delayed entrance animation.
 *
 * Sequence:
 * 1. Initial Page Load: Hero content renders immediately over the clean base background.
 * 2. After ~450ms delay: Sky-blue waves smoothly slide & fade into position.
 * 3. After ~650ms delay: Warm yellow curved wave accents and glow elements gracefully follow.
 * 4. After ~800ms delay: Subtle accent dots fade in.
 *
 * Respects `prefers-reduced-motion` for accessibility (instantly rendered with zero delay).
 */
export const HeroBackgroundWaves = ({ variant = 'default', className = '' }) => {
  const [animReady, setAnimReady] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimReady(true);
      return;
    }

    // Trigger animation state after short initial content-first delay (450ms)
    const timer = setTimeout(() => {
      setAnimReady(true);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* Component Styles for Delayed Wave Reveal Transitions */}
      <style>{`
        /* Smooth cubic-bezier for natural organic liquid motion */
        .hb-wave-layer {
          transition: transform 1.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.25s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }

        /* Top-right sky blue waves: slide from top-right down into place */
        .hb-sky-top-init {
          opacity: 0;
          transform: translate(60px, -45px) scale(0.96);
        }
        .hb-sky-top-in {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        /* Bottom-left sky blue waves: slide from bottom-left up into place */
        .hb-sky-bot-init {
          opacity: 0;
          transform: translate(-50px, 45px) scale(0.96);
        }
        .hb-sky-bot-in {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        /* Yellow wave accents: enter with an elegant secondary delay */
        .hb-yellow-init {
          opacity: 0;
          transform: translate(35px, -25px) scale(0.95);
        }
        .hb-yellow-in {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        /* Bottom-right warm sweep: enter smoothly from bottom edge */
        .hb-bot-right-init {
          opacity: 0;
          transform: translate(40px, 40px) scale(0.96);
        }
        .hb-bot-right-in {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        /* Atmospheric ambient glows */
        .hb-glow-init {
          opacity: 0;
          transform: scale(0.85);
        }
        .hb-glow-in {
          opacity: 1;
          transform: scale(1);
        }

        /* Accent dots */
        .hb-dots-init {
          opacity: 0;
          transform: scale(0.6);
        }
        .hb-dots-in {
          opacity: 1;
          transform: scale(1);
        }

        @media (prefers-reduced-motion: reduce) {
          .hb-wave-layer,
          .hb-sky-top-init, .hb-sky-top-in,
          .hb-sky-bot-init, .hb-sky-bot-in,
          .hb-yellow-init, .hb-yellow-in,
          .hb-bot-right-init, .hb-bot-right-in,
          .hb-glow-init, .hb-glow-in,
          .hb-dots-init, .hb-dots-in {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Atmospheric ambient glows (Soft radial depth behind waves) */}
      <div
        className={`hb-wave-layer absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#DCEEFF]/40 via-[#EEF6FF]/20 to-transparent blur-3xl ${
          animReady ? 'hb-glow-in' : 'hb-glow-init'
        }`}
        style={{ transitionDelay: '300ms', transitionDuration: '1.4s' }}
      />
      <div
        className={`hb-wave-layer absolute -bottom-32 -right-20 w-[520px] h-[520px] rounded-full bg-gradient-to-tl from-[#FFD966]/25 via-[#FFF2BF]/20 to-transparent blur-3xl ${
          animReady ? 'hb-glow-in' : 'hb-glow-init'
        }`}
        style={{ transitionDelay: '500ms', transitionDuration: '1.4s' }}
      />
      <div
        className={`hb-wave-layer absolute top-1/3 right-1/4 w-[360px] h-[360px] rounded-full bg-gradient-to-b from-[#EBF4FE]/40 to-transparent blur-2xl ${
          animReady ? 'hb-glow-in' : 'hb-glow-init'
        }`}
        style={{ transitionDelay: '400ms', transitionDuration: '1.4s' }}
      />

      {/* Primary SVG Organic Flowing Waves */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 640"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hb-sky-top" x1="1" y1="0" x2="0.2" y2="1">
            <stop offset="0%" stopColor="#CBE4FF" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#E2F0FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#EEF6FF" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="hb-yellow-top" x1="1" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#FFD966" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#FFEAA3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF9E6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="hb-sky-bot" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stopColor="#CBE4FF" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#E0EFFF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#EEF6FF" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="hb-yellow-bot" x1="1" y1="1" x2="0.2" y2="0">
            <stop offset="0%" stopColor="#FFD966" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#FFE8A3" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFDF6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="hb-sky-mid" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#D5E8FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#EEF6FF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ========================================================================= */}
        {/* 1. SKY-BLUE TOP-RIGHT WAVES (Slide down & expand smoothly from top-right) */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-sky-top-in' : 'hb-sky-top-init'}`}
          style={{ transitionDelay: '0ms', transformOrigin: 'top right' }}
        >
          {/* Layer 1: Broadest, softest backdrop */}
          <path
            d="M820 0C980 45 1160 85 1440 45V0H820Z"
            fill="#E8F3FF"
            fillOpacity="0.85"
          />

          {/* Layer 2: Defined organic curve */}
          <path
            d="M960 0C1100 80 1260 135 1440 100V0H960Z"
            fill="#D4E8FF"
            fillOpacity="0.65"
          />

          {/* Layer 3: Deepest sky blue sweep */}
          <path
            d="M1090 0C1220 95 1330 160 1440 175V0H1090Z"
            fill="url(#hb-sky-top)"
          />
        </g>

        {/* ========================================================================= */}
        {/* 2. SKY-BLUE BOTTOM-LEFT WAVES (Rise up & expand from bottom-left corner)  */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-sky-bot-in' : 'hb-sky-bot-init'}`}
          style={{ transitionDelay: '100ms', transformOrigin: 'bottom left' }}
        >
          {/* Layer 1: Broadest base */}
          <path
            d="M0 360C140 375 290 450 420 640H0V360Z"
            fill="#EAF3FF"
            fillOpacity="0.9"
          />

          {/* Layer 2: Defined blue contour */}
          <path
            d="M0 430C110 440 230 500 320 640H0V430Z"
            fill="#D2E7FF"
            fillOpacity="0.7"
          />

          {/* Layer 3: Corner anchor sweep */}
          <path
            d="M0 500C70 510 160 550 210 640H0V500Z"
            fill="url(#hb-sky-bot)"
          />

          {/* Rising crest on left margin */}
          <path
            d="M0 290C50 310 95 350 120 400C85 365 45 330 0 320V290Z"
            fill="#CBE4FF"
            fillOpacity="0.45"
          />
        </g>

        {/* ========================================================================= */}
        {/* 3. WARM YELLOW CURVED WAVE ACCENTS (Follow blue waves with ~200ms delay) */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-yellow-in' : 'hb-yellow-init'}`}
          style={{ transitionDelay: '200ms', transformOrigin: 'top right' }}
        >
          {/* Top-Right Yellow Curved Wave Accent */}
          <path
            d="M1120 0C1230 50 1340 75 1440 70V28C1360 22 1270 12 1120 0Z"
            fill="url(#hb-yellow-top)"
          />

          {/* Delicate golden ribbon accent sweeping under the blue waves */}
          <path
            d="M1240 0C1320 65 1390 110 1440 125V105C1395 90 1335 55 1260 0H1240Z"
            fill="#FFD966"
            fillOpacity="0.55"
          />
        </g>

        <g
          className={`hb-wave-layer ${animReady ? 'hb-yellow-in' : 'hb-yellow-init'}`}
          style={{ transitionDelay: '250ms', transformOrigin: 'bottom left' }}
        >
          {/* Bottom-Left Yellow Curved Wave Accent */}
          <path
            d="M0 410C95 420 190 465 250 535L225 560C170 505 85 465 0 455V410Z"
            fill="url(#hb-yellow-top)"
          />
        </g>

        {/* ========================================================================= */}
        {/* 4. BOTTOM-RIGHT CORNER WAVES (Warm yellow & sky balance curves)           */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-bot-right-in' : 'hb-bot-right-init'}`}
          style={{ transitionDelay: '220ms', transformOrigin: 'bottom right' }}
        >
          {/* Warm cream/yellow sweep */}
          <path
            d="M1000 640C1150 575 1300 560 1440 550V640H1000Z"
            fill="#FFF4D6"
            fillOpacity="0.75"
          />

          {/* Yellow wave accent tongue */}
          <path
            d="M1120 640C1220 590 1340 580 1440 575V640H1120Z"
            fill="url(#hb-yellow-bot)"
          />

          {/* Sky blue under-wave */}
          <path
            d="M1220 640C1300 610 1375 605 1440 605V640H1220Z"
            fill="#D6EAFF"
            fillOpacity="0.65"
          />
        </g>

        {/* ========================================================================= */}
        {/* 5. FLOATING ACCENT DOTS (Subtle fade-in finishing touch)                  */}
        {/* ========================================================================= */}
        <g
          className={`hb-wave-layer ${animReady ? 'hb-dots-in' : 'hb-dots-init'}`}
          style={{ transitionDelay: '350ms' }}
        >
          {/* Accent dot cluster - top right */}
          <circle cx="1380" cy="50" r="3" fill="#3478F6" fillOpacity="0.3" />
          <circle cx="1405" cy="75" r="2" fill="#FFD966" fillOpacity="0.5" />
          <circle cx="1350" cy="95" r="2.5" fill="#3478F6" fillOpacity="0.25" />

          {/* Accent dot cluster - bottom left */}
          <circle cx="65" cy="540" r="3" fill="#3478F6" fillOpacity="0.35" />
          <circle cx="95" cy="515" r="2" fill="#FFD966" fillOpacity="0.6" />
          <circle cx="45" cy="480" r="2.5" fill="#3478F6" fillOpacity="0.25" />
        </g>
      </svg>
    </div>
  );
};

export default HeroBackgroundWaves;
