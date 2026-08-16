"use client";

import React from "react";

interface BrandLogoProps {
  variant?: "gold" | "white" | "dark" | "monochrome";
  size?: "sm" | "md" | "lg" | "xl";
  showSubline?: boolean;
  className?: string;
  sublineClassName?: string;
  markOnly?: boolean;
}

export default function BrandLogo({
  variant = "gold",
  size = "md",
  showSubline = true,
  className = "",
  sublineClassName = "",
  markOnly = false
}: BrandLogoProps) {
  // Dimensions mapping
  const dimensions = {
    sm: { width: 34, height: 32, subSize: "text-[8px]", tracking: "tracking-[0.2em]" },
    md: { width: 48, height: 44, subSize: "text-[9px]", tracking: "tracking-[0.25em]" },
    lg: { width: 68, height: 62, subSize: "text-[11px]", tracking: "tracking-[0.3em]" },
    xl: { width: 100, height: 92, subSize: "text-xs", tracking: "tracking-[0.35em]" }
  };

  const dim = dimensions[size];

  // Color profiles based on PDF Brand Guidelines (Pages 6, 7, 10, 12)
  const isWhite = variant === "white";
  const isMonochrome = variant === "monochrome";
  
  const goldColor = isWhite ? "#FFFFFF" : isMonochrome ? "currentColor" : "#C4852B";
  const hatchColor = isWhite ? "rgba(255,255,255,0.75)" : isMonochrome ? "currentColor" : "#C4852B";
  const stoneFill = isWhite ? "#FFFFFF" : isMonochrome ? "currentColor" : "#660000";
  const stoneBorder = isWhite ? "rgba(255,255,255,0.9)" : isMonochrome ? "currentColor" : "#C4852B";
  const textColor = isWhite ? "text-white" : "text-zinc-950 dark:text-white";

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Official 'ne' Monogram Vector */}
      <svg
        width={dim.width}
        height={dim.height}
        viewBox="0 0 120 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
        aria-label="Nafise Ebadi Logo"
      >
        <defs>
          {/* Diagonal Hatch Pattern for Gold Inlay */}
          <pattern
            id={`gold-hatch-${variant}`}
            width="6"
            height="6"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke={hatchColor} strokeWidth="1.6" />
          </pattern>
          
          {/* Subtle Agate Gem Shimmer */}
          <radialGradient id={`agate-gem-${variant}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#990000" />
            <stop offset="60%" stopColor="#660000" />
            <stop offset="100%" stopColor="#400000" />
          </radialGradient>
        </defs>

        {/* --- Letter 'n' --- */}
        {/* Left vertical stem with hatched texture */}
        <path
          d="M26 22 L36 14 L36 78 L26 78 Z"
          fill={`url(#gold-hatch-${variant})`}
          stroke={goldColor}
          strokeWidth="1.2"
        />
        {/* Top serif / cap */}
        <polygon points="20,24 36,12 36,20 20,28" fill={goldColor} />
        
        {/* Arch & right stem of 'n' */}
        <path
          d="M35 34 C44 20 62 20 66 38 L66 78 L56 78 L56 42 C54 30 42 30 36 38 Z"
          fill={goldColor}
        />

        {/* Signature Red Agate Gemstone Droplet at bottom of 'n' left stem */}
        <g transform="translate(31, 92)" className="transition-transform duration-300 group-hover:scale-110">
          {/* Gold setting bezel */}
          <circle cx="0" cy="0" r="8.5" fill={goldColor} stroke={stoneBorder} strokeWidth="1.2" />
          {/* Gemstone core */}
          <circle
            cx="0"
            cy="0"
            r="6.2"
            fill={isWhite ? "#FFFFFF" : isMonochrome ? "currentColor" : `url(#agate-gem-${variant})`}
            className="transition-all duration-300 group-hover:brightness-125"
          />
          {/* Specular highlight */}
          {!isWhite && !isMonochrome && (
            <circle cx="-2" cy="-2" r="1.6" fill="#FFAAAA" opacity="0.9" className="animate-pulse" />
          )}
        </g>

        {/* --- Letter 'e' --- */}
        {/* Upper loop of 'e' */}
        <path
          d="M68 46 C68 28 82 14 100 14 C115 14 122 26 120 44 L78 44 C80 28 96 24 106 28 C112 30 114 36 114 42 Z"
          fill={goldColor}
        />
        {/* Lower sweeping tail of 'e' with gold hatching */}
        <path
          d="M78 48 C76 68 86 86 106 86 C116 86 122 78 122 72 C122 76 114 94 98 94 C76 94 66 72 68 48 Z"
          fill={`url(#gold-hatch-${variant})`}
          stroke={goldColor}
          strokeWidth="1"
        />
        {/* Inner solid accent line along the swoop */}
        <path
          d="M72 54 C74 72 86 88 104 88 C114 88 120 80 120 76"
          stroke={goldColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Official Typography Subline (Page 6 & 17) */}
      {showSubline && !markOnly && (
        <div className="flex flex-col items-center mt-1">
          <span
            className={`font-brand-en uppercase font-bold tracking-[0.24em] ${textColor} ${dim.subSize} ${sublineClassName}`}
            style={{ fontFamily: "var(--font-clash), sans-serif" }}
          >
            NAFISE EBADI
          </span>
          <span
            className={`text-[7px] uppercase font-mono tracking-[0.3em] font-semibold ${
              isWhite ? "text-amber-200" : "text-[#660000] dark:text-[#C4852B]"
            }`}
          >
            JEWELLERY
          </span>
        </div>
      )}
    </div>
  );
}
