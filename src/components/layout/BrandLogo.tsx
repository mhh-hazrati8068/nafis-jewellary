"use client";

import React from "react";
import Image from "next/image";

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
    sm: { width: 36, height: 36, subSize: "text-[8px]", tracking: "tracking-[0.2em]" },
    md: { width: 50, height: 50, subSize: "text-[9px]", tracking: "tracking-[0.25em]" },
    lg: { width: 72, height: 72, subSize: "text-[11px]", tracking: "tracking-[0.3em]" },
    xl: { width: 104, height: 104, subSize: "text-xs", tracking: "tracking-[0.35em]" }
  };

  const dim = dimensions[size];
  const isWhite = variant === "white";
  const textColor = isWhite ? "text-white" : "text-zinc-950 dark:text-white";

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Official Nafise Ebadi Emblem Image */}
      <div 
        className="relative overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: dim.width, height: dim.height }}
      >
        <Image
          src="/logo.jpg"
          alt="لوگوی رسمی زیورآلات نفیسه عبادی | Nafise Ebadi Jewellery"
          width={dim.width * 2}
          height={dim.height * 2}
          className="w-full h-full object-contain rounded-md"
          priority
        />
      </div>

      {/* Official Typography Subline */}
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
