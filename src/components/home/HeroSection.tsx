"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { SparkleStarIcon } from "@/components/icons/JewelryIcons";

export default function HeroSection() {
  const { t } = useAppStore();

  return (
    <section className="relative w-full overflow-hidden bg-[#121110] text-white py-20 sm:py-28 md:py-36 min-h-[75vh] md:min-h-[88vh] flex items-center justify-center">
      {/* Background Image: Master Silversmith Atelier & Authentic Handcrafted Jewelry */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 will-change-transform opacity-90"
        style={{
          backgroundImage: "url('/images/hero-silver-bg.jpg')",
        }}
      />

      {/* Atmospheric Studio Vignette (Overlays to guarantee pristine text readability) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/90 via-black/35 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />

      {/* Ambient Warm Silver/Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] bg-[radial-gradient(circle,rgba(196,133,43,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Pure Floating Typography - NO Background Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center text-center max-w-4xl">
        
        {/* Category / Badge Tag (Text only, no background box) */}
        <div className="mb-3 sm:mb-4 flex items-center justify-center gap-2 text-[#E5A84B] font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.25em] drop-shadow-md">
          <SparkleStarIcon className="w-4 h-4 text-[#E5A84B]" />
          <span>{t.hero.badge}</span>
        </div>

        {/* Editorial Headline (Floating Directly on Background) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 uppercase text-white leading-[1.2] md:leading-[1.1] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
          {t.hero.title}
        </h1>

        {/* Subtitle (Floating Directly on Background) */}
        <p className="text-sm sm:text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 text-zinc-200 leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
          {t.hero.subtitle}
        </p>

        {/* Action Buttons (Transparent Outline Ghost Buttons - NO Background) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link 
            href="/collections"
            className="w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 bg-transparent text-[#E5A84B] border-2 border-[#E5A84B] hover:bg-[#E5A84B] hover:text-black font-bold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
          >
            {t.hero.explore}
          </Link>
          
          <Link 
            href="/about"
            className="w-full sm:w-auto text-center px-8 sm:px-10 py-3.5 sm:py-4 bg-transparent text-white border-2 border-white/70 hover:border-white hover:bg-white hover:text-zinc-950 font-bold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-[2px]"
          >
            {t.hero.philosophy}
          </Link>
        </div>

      </div>
    </section>
  );
}
