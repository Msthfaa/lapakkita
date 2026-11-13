'use client'

import React from 'react'

export interface AuthScenicBackgroundProps {
  children: React.ReactNode
  className?: string
}

export function AuthScenicBackground({ children, className = '' }: AuthScenicBackgroundProps) {
  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden flex flex-col justify-center items-center bg-[#FAF6E8] dark:bg-[#051510] transition-colors duration-500 selection:bg-[#1B6B50]/30 ${className}`}
    >
      {/* Self-contained CSS Animations */}
      <style>{`
        @keyframes scenicSparkleFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-8px) rotate(2deg) scale(1.04);
          }
        }
        @keyframes scenicSparkleTwinkle {
          0%, 100% {
            opacity: 0.82;
            transform: scale(0.96);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }
        @keyframes scenicSteamRise {
          0% {
            transform: translateY(0) scaleX(1);
            opacity: 0;
          }
          35% {
            opacity: 0.65;
          }
          70% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-18px) scaleX(1.2);
            opacity: 0;
          }
        }
        @keyframes scenicCharBob {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>

      {/* ========================================================= */}
      {/* FIXED VIEWPORT SCENIC BACKDROP (ZERO OVERFLOW, ZERO LAG)  */}
      {/* ========================================================= */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
        aria-hidden="true"
      >
        {/* Soft Ambient Sky Radial Warmth */}
        <div
          className="absolute top-0 right-0 w-[55vw] max-w-[650px] h-[45vh] max-h-[500px] rounded-full pointer-events-none transition-opacity duration-700"
          style={{
            background:
              'radial-gradient(circle at 75% 25%, rgba(217, 131, 39, 0.16) 0%, rgba(236, 232, 175, 0.25) 45%, transparent 75%)',
          }}
        />

        {/* Soft Ambient Horizon & Card Contrast Glow */}
        <div
          className="absolute bottom-[16vh] sm:bottom-[20vh] lg:bottom-[22vh] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1100px] h-[260px] rounded-full pointer-events-none opacity-60 dark:opacity-30 blur-3xl transition-opacity duration-700"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(37, 133, 100, 0.38) 0%, rgba(27, 107, 80, 0.22) 42%, rgba(245, 158, 11, 0.12) 70%, transparent 85%)',
          }}
        />

        {/* ========================================================= */}
        {/* TOP-RIGHT: GOLDEN TWINKLING DIAMOND SPARKLES              */}
        {/* ========================================================= */}
        <div className="absolute top-4 sm:top-8 md:top-10 right-4 sm:right-8 md:right-14 z-[2] flex items-center justify-center">
          <svg
            className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 overflow-visible drop-shadow-[0_2px_14px_rgba(217,131,39,0.38)] dark:drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-all duration-500"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Primary Golden Sparkle Gradient */}
              <linearGradient id="scenicGoldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="30%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D98327" />
              </linearGradient>

              {/* Secondary Amber Sparkle Gradient */}
              <linearGradient id="scenicGoldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>

            {/* STAR 1: HERO LARGE DIAMOND SPARKLE (Center: 135, 60) */}
            <g
              style={{
                transformOrigin: '135px 60px',
                animation: 'scenicSparkleFloat 6s ease-in-out infinite',
              }}
            >
              <path
                d="M 135 15 Q 135 60 90 60 Q 135 60 135 105 Q 135 60 180 60 Q 135 60 135 15 Z"
                fill="url(#scenicGoldGrad1)"
                stroke="#FDE68A"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M 135 24 Q 135 60 171 60 Q 146 52 135 24 Z"
                fill="#FFFBEB"
                fillOpacity="0.65"
              />
              <polygon
                points="135,46 149,60 135,74 121,60"
                fill="#FFFFFF"
                fillOpacity="0.85"
              />
            </g>

            {/* STAR 2: MEDIUM-LARGE DIAMOND SPARKLE (Center: 65, 40) */}
            <g
              style={{
                transformOrigin: '65px 40px',
                animation: 'scenicSparkleFloat 5s ease-in-out infinite 1.2s',
              }}
            >
              <path
                d="M 65 10 Q 65 40 35 40 Q 65 40 65 70 Q 65 40 95 40 Q 65 40 65 10 Z"
                fill="url(#scenicGoldGrad2)"
                stroke="#FEF3C7"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M 65 18 Q 65 40 87 40 Q 72 34 65 18 Z"
                fill="#FFFFFF"
                fillOpacity="0.55"
              />
              <polygon
                points="65,30 75,40 65,50 55,40"
                fill="#FFFBEB"
                fillOpacity="0.75"
              />
            </g>

            {/* STAR 3: SUB-HERO DIAMOND SPARKLE (Center: 155, 140) */}
            <g
              style={{
                transformOrigin: '155px 140px',
                animation: 'scenicSparkleFloat 7s ease-in-out infinite 2.4s',
              }}
            >
              <path
                d="M 155 95 Q 155 140 110 140 Q 155 140 155 185 Q 155 140 200 140 Q 155 140 155 95 Z"
                fill="url(#scenicGoldGrad1)"
                stroke="#FDE68A"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M 155 106 Q 155 140 189 140 Q 166 132 155 106 Z"
                fill="#FFFBEB"
                fillOpacity="0.6"
              />
              <polygon
                points="155,126 169,140 155,154 141,140"
                fill="#FFFFFF"
                fillOpacity="0.8"
              />
            </g>

            {/* STAR 4: ACCENT SMALL SPARKLE (Center: 85, 115) */}
            <g
              style={{
                transformOrigin: '85px 115px',
                animation: 'scenicSparkleTwinkle 4s ease-in-out infinite 0.8s',
              }}
            >
              <path
                d="M 85 92 Q 85 115 62 115 Q 85 115 85 138 Q 85 115 108 115 Q 85 115 85 92 Z"
                fill="url(#scenicGoldGrad2)"
                stroke="#FEF3C7"
                strokeWidth="1"
              />
              <polygon
                points="85,107 93,115 85,123 77,115"
                fill="#FFFFFF"
                fillOpacity="0.85"
              />
            </g>

            {/* MINI GLINT DOTS */}
            <circle cx="32" cy="78" r="3.5" fill="#F59E0B" opacity="0.8" />
            <circle cx="32" cy="78" r="1.5" fill="#FFFFFF" />
            <circle cx="118" cy="18" r="2.5" fill="#D98327" opacity="0.8" />
            <circle cx="118" cy="18" r="1" fill="#FFFFFF" />
            <circle cx="188" cy="98" r="3" fill="#FBBF24" opacity="0.75" />
            <circle cx="188" cy="98" r="1.2" fill="#FFFFFF" />
          </svg>
        </div>

        {/* ========================================================= */}
        {/* SCENIC LOWER LANDSCAPE: GREEN HILLS & PEEKING ORNAMENTS   */}
        {/* ========================================================= */}
        <div className="absolute bottom-0 inset-x-0 w-full h-[26vh] sm:h-[30vh] lg:h-[34vh] min-h-[195px] max-h-[350px] pointer-events-none select-none z-[4]">
          {/* ------------------------------------------------------- */}
          {/* LAYER 1: BACK ROLLING HILL (Adds atmospheric depth)     */}
          {/* ------------------------------------------------------- */}
          <div className="absolute inset-0 w-full h-full z-[1]">
            <svg
              viewBox="0 0 1440 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full block"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="scenicHillGradBack" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#18644C" />
                  <stop offset="45%" stopColor="#145741" />
                  <stop offset="100%" stopColor="#0E3D2F" />
                </linearGradient>
                <linearGradient id="scenicHillGradBackDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#104936" />
                  <stop offset="100%" stopColor="#061D15" />
                </linearGradient>
              </defs>
              <path
                d="M 0,115 C 360,50 960,45 1440,110 L 1440,360 L 0,360 Z"
                className="fill-[url(#scenicHillGradBack)] dark:fill-[url(#scenicHillGradBackDark)] transition-colors duration-500"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* ------------------------------------------------------- */}
          {/* LAYER 2: PEEKING UMKM ORNAMENTS (LIFTED & REPOSITIONED) */}
          {/* ------------------------------------------------------- */}

          {/* LEFT ORNAMENT GROUP: CUTE BREAD CHARACTER, MILK BOTTLE, KLEPON */}
          <div
            className="absolute left-[-16px] sm:left-2 md:left-6 lg:left-14 xl:left-20 z-[2] pointer-events-none select-none transition-all duration-700 ease-out origin-bottom-left scale-[0.62] sm:scale-[0.74] md:scale-[0.88] lg:scale-100"
            style={{ bottom: 'calc(65% - 42px)' }}
          >
            <svg
              className="w-[340px] h-[270px] overflow-visible drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
              viewBox="0 0 340 270"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Baked Bread Warm Artisan Gradient */}
                <linearGradient id="breadSkinGrad" x1="30%" y1="0%" x2="70%" y2="100%">
                  <stop offset="0%" stopColor="#FCD34D" />
                  <stop offset="35%" stopColor="#F59E0B" />
                  <stop offset="85%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>

                {/* Fresh Milk / Jamu Golden Drink Gradient */}
                <linearGradient id="jamuDrinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF9C3" />
                  <stop offset="50%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#FACC15" />
                </linearGradient>

                {/* Klepon Fresh Leaf Green Gradient */}
                <linearGradient id="kleponGrad1" x1="20%" y1="15%" x2="80%" y2="85%">
                  <stop offset="0%" stopColor="#86EFAC" />
                  <stop offset="60%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#15803D" />
                </linearGradient>

                {/* Steam Flow Gradient */}
                <linearGradient id="steamGradLeft" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* --- ELEMENT A: BOTOL SUSU SEGAR / JAMU TRADISIONAL (Behind Bread) --- */}
              <g transform="translate(190, 20)">
                {/* Bottle Cap (Forest Green) */}
                <rect x="22" y="0" width="32" height="14" rx="4" fill="#1B6B50" stroke="#145741" strokeWidth="1.5" />
                <line x1="26" y1="4" x2="26" y2="10" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="38" y1="4" x2="38" y2="10" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="50" y1="4" x2="50" y2="10" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" />

                {/* Bottle Collar */}
                <rect x="25" y="14" width="26" height="8" rx="2" fill="#F1F5F9" opacity="0.9" />

                {/* Glass Bottle Body with Jamu / Milk */}
                <path
                  d="M 26 22 C 26 38 4 58 4 92 L 4 200 C 4 212 14 220 24 220 L 52 220 C 62 220 72 212 72 200 L 72 92 C 72 58 50 38 50 22 Z"
                  fill="url(#jamuDrinkGrad)"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />

                {/* Glass Bottle Highlights */}
                <path
                  d="M 12 90 L 12 195 C 12 200 15 204 20 204"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <path
                  d="M 20 90 L 20 185"
                  stroke="#FFFFFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.45"
                />

                {/* Traditional Susu / Jamu Label */}
                <rect
                  x="8"
                  y="110"
                  width="60"
                  height="58"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#1B6B50"
                  strokeWidth="1.5"
                />
                {/* Herb Leaf Emblem */}
                <path
                  d="M 38 116 C 44 119 46 125 43 128 C 39 130 35 127 34 122 C 34 118 36 116 38 116 Z"
                  fill="#1B6B50"
                />
                <text
                  x="38"
                  y="142"
                  textAnchor="middle"
                  fill="#1B6B50"
                  fontSize="12"
                  fontWeight="800"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  letterSpacing="1"
                >
                  JAMU
                </text>
                <text
                  x="38"
                  y="157"
                  textAnchor="middle"
                  fill="#D97706"
                  fontSize="7.5"
                  fontWeight="700"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  SEGAR ALAMI
                </text>
              </g>

              {/* --- ELEMENT B: CUTE SMILING ROTI / KUE KARAKTER (Main Left Hero) --- */}
              <g
                transform="translate(65, 55)"
                style={{
                  animation: 'scenicCharBob 5s ease-in-out infinite',
                }}
              >
                {/* Roti Body Contour */}
                <path
                  d="M 75 10 C 125 10 148 40 148 95 C 148 145 128 175 75 175 C 22 175 2 145 2 95 C 2 40 25 10 75 10 Z"
                  fill="url(#breadSkinGrad)"
                  stroke="#92400E"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Baked Crust Score Lines / Texture */}
                <path
                  d="M 50 36 C 75 46 100 36 100 36"
                  stroke="#B45309"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.45"
                />
                <path
                  d="M 40 56 C 75 68 110 56 110 56"
                  stroke="#B45309"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  opacity="0.4"
                />

                {/* Top Golden Butter Pat with Melted Droplet */}
                <rect
                  x="62"
                  y="16"
                  width="24"
                  height="16"
                  rx="4"
                  fill="#FEF08A"
                  stroke="#FACC15"
                  strokeWidth="1.5"
                />
                <path
                  d="M 70 32 C 70 39 74 41 74 44 C 74 47 70 47 68 44"
                  stroke="#FACC15"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Cute Cartoon Eyes with Sparkling Glints */}
                {/* Left Eye */}
                <circle cx="56" cy="98" r="6.5" fill="#291507" />
                <circle cx="54" cy="96" r="2.5" fill="#FFFFFF" />
                <circle cx="58" cy="100" r="1.2" fill="#FFFFFF" />

                {/* Right Eye */}
                <circle cx="94" cy="98" r="6.5" fill="#291507" />
                <circle cx="92" cy="96" r="2.5" fill="#FFFFFF" />
                <circle cx="96" cy="100" r="1.2" fill="#FFFFFF" />

                {/* Rosy Blushing Cheeks */}
                <ellipse cx="42" cy="110" rx="9" ry="5.5" fill="#F43F5E" fillOpacity="0.55" />
                <ellipse cx="108" cy="110" rx="9" ry="5.5" fill="#F43F5E" fillOpacity="0.55" />

                {/* Happy Smiling Mouth */}
                <path
                  d="M 68 108 Q 75 122 82 108"
                  stroke="#78350F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="#991B1B"
                />

                {/* Little Sesame Seeds Garnish */}
                <ellipse cx="38" cy="76" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(-20 38 76)" />
                <ellipse cx="112" cy="78" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(25 112 78)" />
                <ellipse cx="75" cy="74" rx="2" ry="1.2" fill="#FEF3C7" />
              </g>

              {/* --- ELEMENT C: TAMPAH BAMBU & KLEPON JAJANAN PASAR (Front-left) --- */}
              <g transform="translate(8, 125)">
                {/* Banana Leaf Base */}
                <ellipse cx="55" cy="55" rx="50" ry="22" fill="#15803D" stroke="#166534" strokeWidth="1.5" />
                <path d="M 10 55 Q 55 48 100 55" stroke="#166534" strokeWidth="1.2" opacity="0.6" />

                {/* Klepon 1 (Back left) */}
                <circle cx="34" cy="44" r="16" fill="url(#kleponGrad1)" stroke="#15803D" strokeWidth="1" />
                <circle cx="30" cy="38" r="1.5" fill="#FFFFFF" />
                <circle cx="38" cy="40" r="1.2" fill="#FFFFFF" />
                <circle cx="33" cy="46" r="1.5" fill="#FFFFFF" />

                {/* Klepon 2 (Right) */}
                <circle cx="70" cy="46" r="17" fill="url(#kleponGrad1)" stroke="#15803D" strokeWidth="1" />
                <circle cx="68" cy="39" r="1.5" fill="#FFFFFF" />
                <circle cx="75" cy="42" r="1.4" fill="#FFFFFF" />
                <circle cx="65" cy="47" r="1.2" fill="#FFFFFF" />

                {/* Klepon 3 (Front Center with Gula Merah Glaze) */}
                <circle cx="52" cy="56" r="18" fill="url(#kleponGrad1)" stroke="#15803D" strokeWidth="1" />
                <circle cx="48" cy="50" r="1.6" fill="#FFFFFF" />
                <circle cx="56" cy="52" r="1.4" fill="#FFFFFF" />
                <circle cx="53" cy="58" r="1.5" fill="#FFFFFF" />
                {/* Gula Merah Drop */}
                <path d="M 52 60 Q 54 66 52 67 Q 50 66 52 60 Z" fill="#78350F" />
              </g>

              {/* Subtle Aroma Steam Line (Rising from warm pastry) */}
              <path
                d="M 135 48 Q 142 32 135 18 Q 128 6 138 -6"
                stroke="url(#steamGradLeft)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                style={{ animation: 'scenicSteamRise 3.5s ease-out infinite' }}
              />
            </svg>
          </div>

          {/* RIGHT ORNAMENT GROUP: SAVORY NOODLE/SOTO BOWL, PEDAS SNACK BOX, COFFEE CUP */}
          <div
            className="absolute right-[-16px] sm:right-2 md:right-6 lg:right-14 xl:right-20 z-[2] pointer-events-none select-none transition-all duration-700 ease-out origin-bottom-right scale-[0.62] sm:scale-[0.74] md:scale-[0.88] lg:scale-100"
            style={{ bottom: 'calc(65% - 42px)' }}
          >
            <svg
              className="w-[350px] h-[270px] overflow-visible drop-shadow-[0_12px_28px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
              viewBox="0 0 350 270"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Soto / Bakso Savory Broth Gradient */}
                <radialGradient id="brothGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="65%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </radialGradient>

                {/* Egg Yolk Gradient */}
                <radialGradient id="eggYolkGrad" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EA580C" />
                </radialGradient>

                {/* Pedas Box Terracotta Gradient */}
                <linearGradient id="pedasBoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="60%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#C2410C" />
                </linearGradient>

                {/* Coffee Surface Gradient */}
                <radialGradient id="coffeeGrad" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#78350F" />
                  <stop offset="60%" stopColor="#451A03" />
                  <stop offset="100%" stopColor="#291507" />
                </radialGradient>

                {/* Steam Flow Gradient */}
                <linearGradient id="steamGradRight" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* --- ELEMENT A: MANGKOK KULINER NUSANTARA (Soto / Bakso / Mie) --- */}
              <g transform="translate(25, 25)">
                {/* Ceramic Bowl Exterior */}
                <path
                  d="M 12 70 C 12 155 70 185 105 185 C 140 185 198 155 198 70 Z"
                  fill="#1E293B"
                  stroke="#0F172A"
                  strokeWidth="2.5"
                />
                {/* Ceramic Bowl Rim Ellipse */}
                <ellipse
                  cx="105"
                  cy="70"
                  rx="93"
                  ry="36"
                  fill="#334155"
                  stroke="#1B6B50"
                  strokeWidth="3"
                />

                {/* Savory Golden Broth Surface */}
                <ellipse
                  cx="105"
                  cy="73"
                  rx="85"
                  ry="30"
                  fill="url(#brothGrad)"
                />

                {/* Mie Telur / Golden Yellow Noodles Loops */}
                <path
                  d="M 40 70 Q 55 88 80 72 Q 105 58 135 74 Q 155 88 170 70"
                  stroke="#FDE047"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 50 78 Q 75 92 105 76 Q 135 62 160 80"
                  stroke="#FACC15"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Fresh Sawi Hijau / Bok Choy Leaves */}
                <path
                  d="M 38 60 C 44 40 68 46 72 65 C 64 74 46 72 38 60 Z"
                  fill="#16A34A"
                  stroke="#15803D"
                  strokeWidth="1.2"
                />
                <path
                  d="M 52 64 L 56 46"
                  stroke="#86EFAC"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />

                {/* Half Boiled Egg with Golden Yolk */}
                <g transform="translate(112, 58) rotate(-12)">
                  <ellipse cx="26" cy="18" rx="24" ry="17" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                  <circle cx="26" cy="18" r="11" fill="url(#eggYolkGrad)" />
                  <circle cx="23" cy="15" r="3" fill="#FEF08A" opacity="0.8" />
                </g>

                {/* Bakso Daging (Meatball) */}
                <circle cx="95" cy="85" r="15" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
                <line x1="88" y1="85" x2="102" y2="85" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="95" y1="78" x2="95" y2="92" stroke="#451A03" strokeWidth="1.8" strokeLinecap="round" />

                {/* Red Chili Pepper Slices */}
                <circle cx="76" cy="68" r="4.5" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
                <circle cx="76" cy="68" r="1.8" fill="#FDE047" />
                <circle cx="150" cy="82" r="4" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
                <circle cx="150" cy="82" r="1.5" fill="#FDE047" />

                {/* Slanted Bamboo Chopsticks */}
                <line
                  x1="22"
                  y1="42"
                  x2="178"
                  y2="76"
                  stroke="#B45309"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1="24"
                  y1="48"
                  x2="182"
                  y2="82"
                  stroke="#D97706"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>

              {/* Rising Steam Wisps from the Savory Bowl */}
              <path
                d="M 120 25 Q 112 10 122 -2 Q 132 -14 120 -24"
                stroke="url(#steamGradRight)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                style={{ animation: 'scenicSteamRise 4s ease-out infinite' }}
              />
              <path
                d="M 148 20 Q 156 5 146 -8 Q 138 -20 150 -30"
                stroke="url(#steamGradRight)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                style={{ animation: 'scenicSteamRise 4s ease-out infinite 1.5s' }}
              />

              {/* --- ELEMENT B: KEMASAN STREET FOOD PEDAS UMKM (Snack Box) --- */}
              <g transform="translate(225, 55)">
                {/* Terracotta Box Shape */}
                <path
                  d="M 10 20 L 78 12 L 88 140 L 0 140 Z"
                  fill="url(#pedasBoxGrad)"
                  stroke="#9A3412"
                  strokeWidth="1.5"
                />
                {/* Box Top Lip Fold */}
                <polygon
                  points="10,20 78,12 82,30 6,38"
                  fill="#F97316"
                  stroke="#C2410C"
                  strokeWidth="1.2"
                />

                {/* Crispy Snacks Peeking from the Top */}
                <ellipse cx="28" cy="16" rx="9" ry="14" fill="#FBBF24" stroke="#D97706" strokeWidth="1" transform="rotate(-15 28 16)" />
                <ellipse cx="50" cy="12" rx="10" ry="16" fill="#F59E0B" stroke="#B45309" strokeWidth="1" transform="rotate(10 50 12)" />
                <ellipse cx="65" cy="18" rx="8" ry="12" fill="#FCD34D" stroke="#D97706" strokeWidth="1" transform="rotate(25 65 18)" />

                {/* Street Food "PEDAS" Emblem */}
                <rect
                  x="12"
                  y="52"
                  width="64"
                  height="44"
                  rx="6"
                  fill="#FEF3C7"
                  stroke="#DC2626"
                  strokeWidth="1.5"
                />
                {/* Mini Flame Icon */}
                <path
                  d="M 44 58 C 47 62 49 65 47 69 C 45 72 41 72 41 68 C 41 64 43 61 44 58 Z"
                  fill="#DC2626"
                />
                <text
                  x="44"
                  y="81"
                  textAnchor="middle"
                  fill="#DC2626"
                  fontSize="12"
                  fontWeight="900"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  letterSpacing="1"
                >
                  PEDAS
                </text>
                <text
                  x="44"
                  y="91"
                  textAnchor="middle"
                  fill="#9A3412"
                  fontSize="6.5"
                  fontWeight="700"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  KULINER UMKM
                </text>
              </g>

              {/* --- ELEMENT C: CANGKIR KOPI LURIK ENAMEL WARKOP (Front-Right Accent) --- */}
              <g transform="translate(8, 105)">
                {/* Cup Handle */}
                <path
                  d="M 12 24 C -4 24 -4 46 12 46"
                  stroke="#1B6B50"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Enamel Cup Body */}
                <rect
                  x="12"
                  y="14"
                  width="42"
                  height="44"
                  rx="5"
                  fill="#F8FAFC"
                  stroke="#1B6B50"
                  strokeWidth="2"
                />
                {/* Classic Green Enamel Flecks / Lurik Pattern */}
                <path d="M 16 26 Q 24 30 20 38" stroke="#1B6B50" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 34 22 Q 40 32 36 42" stroke="#1B6B50" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 24 46 Q 30 48 26 52" stroke="#1B6B50" strokeWidth="2.5" strokeLinecap="round" />

                {/* Coffee Surface with Gula Aren Swirl */}
                <ellipse cx="33" cy="14" rx="20" ry="7" fill="url(#coffeeGrad)" stroke="#1B6B50" strokeWidth="1.5" />
                <path
                  d="M 24 14 Q 33 16 40 14"
                  stroke="#D97706"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Delicate Coffee Steam Wisp */}
                <path
                  d="M 33 8 Q 28 -2 36 -12"
                  stroke="url(#steamGradRight)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  style={{ animation: 'scenicSteamRise 3.2s ease-out infinite 0.8s' }}
                />
              </g>
            </svg>
          </div>

          {/* ------------------------------------------------------- */}
          {/* LAYER 3: MAIN ORGANIC CURVED HILL (VIBRANT FOREST GREEN)*/}
          {/* ------------------------------------------------------- */}
          <div className="absolute inset-0 w-full h-full z-[3]">
            <svg
              viewBox="0 0 1440 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full block"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Vibrant Warm Forest Green (#1B6B50 to #145741) */}
                <linearGradient id="scenicHillGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#258564" />
                  <stop offset="25%" stopColor="#1B6B50" />
                  <stop offset="80%" stopColor="#175F47" />
                  <stop offset="100%" stopColor="#145741" />
                </linearGradient>

                {/* Dark Mode Forest Green Gradient */}
                <linearGradient id="scenicHillGradFrontDark" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1C6C52" />
                  <stop offset="30%" stopColor="#145741" />
                  <stop offset="100%" stopColor="#0B3326" />
                </linearGradient>

                {/* Soft Ambient Rim Light Gradient across the crest */}
                <linearGradient id="scenicHillRimGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#34D399" stopOpacity="0.2" />
                  <stop offset="20%" stopColor="#6EE7B7" stopOpacity="0.65" />
                  <stop offset="50%" stopColor="#A7F3D0" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#6EE7B7" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.2" />
                </linearGradient>

                {/* Ambient Soft Bloom Filter for the Hill Crest */}
                <filter id="hillSoftBloom" x="-5%" y="-100%" width="110%" height="300%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                </filter>
              </defs>

              {/* Main Organic Curved Hill Body (#1B6B50 & #145741) */}
              <path
                d="M 0,145 C 380,75 1060,75 1440,140 L 1440,360 L 0,360 Z"
                className="fill-[url(#scenicHillGradFront)] dark:fill-[url(#scenicHillGradFrontDark)] transition-colors duration-500"
              />

              {/* Soft Ambient Crest Glow Bloom */}
              <path
                d="M 0,145 C 380,75 1060,75 1440,140"
                stroke="#6EE7B7"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                opacity="0.32"
                filter="url(#hillSoftBloom)"
              />

              {/* Luminous Edge Rim Line (Distinct visual depth & contrast) */}
              <path
                d="M 0,145 C 380,75 1060,75 1440,140"
                stroke="url(#scenicHillRimGlow)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN CENTER CONTENT (CARD / FORM) WITH PROPER Z-INDEX     */}
      {/* ========================================================= */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-12 sm:pt-24 sm:pb-20">
        {children}
      </main>
    </div>
  )
}
