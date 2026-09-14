"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

export default function HeroSection() {
  const { t } = useAppStore();

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F5] text-zinc-950 transition-colors duration-500 py-20 sm:py-28 md:py-36 min-h-[70vh] md:min-h-[82vh] flex items-center justify-center">
      {/* Background Image with Depth & Refined Studio Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 will-change-transform opacity-30 sm:opacity-35"
        style={{
          backgroundImage: "url('/images/hero-silver-bg.jpg')",
        }}
      />

      {/* Luxury Layered Gradients to Ensure Flawless Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F5] via-[#FAF9F5]/70 to-[#FAF9F5]/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,249,245,0.4)_0%,rgba(250,249,245,0.95)_80%)] pointer-events-none" />

      {/* Subtle Ambient Silver & Amber Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] md:w-[900px] h-[450px] sm:h-[700px] md:h-[900px] bg-[radial-gradient(circle,rgba(196,133,43,0.12)_0%,rgba(250,249,245,0)_70%)] pointer-events-none" />

      {/* Decorative Subtle Background Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#C4852B_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Centered Editorial Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 text-center flex flex-col items-center max-w-4xl">
        
        {/* Badge */}
        <div className="mb-4 sm:mb-6 px-4 py-1.5 rounded-full border border-[#C4852B]/60 bg-[#C4852B]/15 text-[10px] sm:text-[11px] md:text-xs uppercase text-[#A06314] font-bold shadow-xs ltr:tracking-[0.2em] backdrop-blur-xs">
          {t.hero.badge}
        </div>

        {/* Editorial Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 uppercase text-zinc-950 leading-[1.22] md:leading-[1.16] tracking-tight">
          {t.hero.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium max-w-xs sm:max-w-lg md:max-w-2xl mx-auto mb-8 sm:mb-10 text-[#660000] leading-relaxed">
          {t.hero.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 w-full sm:w-auto px-4 sm:px-0 max-w-xs sm:max-w-none">
          <Link 
            href="/collections"
            className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#660000] text-white font-bold text-xs sm:text-sm uppercase ltr:tracking-[0.15em] rounded-full shadow-[0_8px_25px_rgba(102,0,0,0.35)] hover:bg-[#7D0000] hover:shadow-[0_10px_28px_rgba(102,0,0,0.45)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            {t.hero.explore}
          </Link>
          
          <Link 
            href="/about"
            className="w-full sm:w-auto text-center px-8 py-3.5 border-2 border-[#C4852B] bg-white/90 backdrop-blur-xs text-zinc-950 font-bold text-xs sm:text-sm uppercase ltr:tracking-[0.15em] rounded-full hover:bg-[#C4852B] hover:text-white transition-all duration-300 shadow-xs cursor-pointer"
          >
            {t.hero.philosophy}
          </Link>
        </div>

      </div>
    </section>
  );
}
