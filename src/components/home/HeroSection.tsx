"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

export default function HeroSection() {
  const { t } = useAppStore();

  return (
    <section className="relative w-full overflow-hidden bg-[#1A1816] text-zinc-950 py-16 sm:py-24 md:py-32 min-h-[75vh] md:min-h-[85vh] flex items-center justify-center">
      {/* Background Image: Master Silversmith Atelier & Authentic Handcrafted Jewelry */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 will-change-transform opacity-80 sm:opacity-85"
        style={{
          backgroundImage: "url('/images/hero-silver-bg.jpg')",
        }}
      />

      {/* Atmospheric Studio Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.7)_90%)] pointer-events-none" />

      {/* Ambient Warm Silver/Gold Rim Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] md:w-[1000px] h-[500px] sm:h-[800px] md:h-[1000px] bg-[radial-gradient(circle,rgba(196,133,43,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Centered Luxury Glassmorphic Editorial Card */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 flex justify-center">
        <div className="w-full max-w-3xl bg-white/90 dark:bg-[#FAF9F5]/92 backdrop-blur-md rounded-3xl p-8 sm:p-12 md:p-14 border border-[#C4852B]/40 shadow-[0_20px_60px_rgba(0,0,0,0.25)] text-center flex flex-col items-center">
          
          {/* Badge */}
          <div className="mb-4 sm:mb-5 px-4 py-1.5 rounded-full border border-[#C4852B]/50 bg-[#C4852B]/15 text-[10px] sm:text-xs uppercase text-[#A06314] font-bold shadow-xs tracking-[0.2em]">
            {t.hero.badge}
          </div>

          {/* Editorial Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 uppercase text-zinc-950 leading-[1.2] md:leading-[1.15] tracking-tight">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base font-semibold max-w-xl mx-auto mb-8 text-[#660000] leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link 
              href="/collections"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#660000] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.15em] rounded-full shadow-[0_8px_25px_rgba(102,0,0,0.35)] hover:bg-[#7D0000] hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {t.hero.explore}
            </Link>
            
            <Link 
              href="/about"
              className="w-full sm:w-auto text-center px-8 py-3.5 border-2 border-[#C4852B] bg-white text-zinc-950 font-bold text-xs sm:text-sm uppercase tracking-[0.15em] rounded-full hover:bg-[#C4852B] hover:text-white transition-all duration-300 shadow-xs cursor-pointer"
            >
              {t.hero.philosophy}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

