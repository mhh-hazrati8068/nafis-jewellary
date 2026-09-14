"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { SparkleStarIcon } from "@/components/icons/JewelryIcons";

export default function HeroSection() {
  const { t } = useAppStore();

  return (
    <section className="relative w-full overflow-hidden bg-[#121110] text-white py-16 sm:py-24 md:py-32 min-h-[75vh] md:min-h-[85vh] flex items-center justify-center">
      {/* Background Image: Master Silversmith Atelier & Authentic Handcrafted Jewelry */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-100 will-change-transform opacity-85"
        style={{
          backgroundImage: "url('/images/hero-silver-bg.jpg')",
        }}
      />

      {/* Atmospheric Studio Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121110]/95 via-black/40 to-[#121110]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(18,17,16,0.85)_95%)] pointer-events-none" />

      {/* Ambient Warm Silver/Gold Rim Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[800px] md:w-[1000px] h-[500px] sm:h-[800px] md:h-[1000px] bg-[radial-gradient(circle,rgba(196,133,43,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Centered Luxury Glassmorphic Editorial Card with Relative Atelier Colors */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 flex justify-center">
        <div className="w-full max-w-3xl bg-[#181614]/80 backdrop-blur-xl rounded-3xl p-8 sm:p-12 md:p-14 border border-[#C4852B]/40 shadow-[0_25px_70px_rgba(0,0,0,0.6)] text-center flex flex-col items-center">
          
          {/* Badge */}
          <div className="mb-4 sm:mb-5 px-4 py-1.5 rounded-full border border-[#C4852B]/50 bg-[#C4852B]/20 text-[10px] sm:text-xs uppercase text-[#E5A84B] font-bold shadow-xs tracking-[0.2em] flex items-center gap-1.5">
            <SparkleStarIcon className="w-3.5 h-3.5 text-[#E5A84B]" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Editorial Headline (Gleaming Metallic White/Silver) */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 uppercase text-white leading-[1.2] md:leading-[1.15] tracking-tight drop-shadow-md">
            {t.hero.title}
          </h1>

          {/* Subtitle (Warm Amber Gold) */}
          <p className="text-xs sm:text-sm md:text-base font-semibold max-w-xl mx-auto mb-8 text-[#E5A84B] leading-relaxed drop-shadow-xs">
            {t.hero.subtitle}
          </p>

          {/* Action Buttons (Velvet Crimson & Dark Bronze Atelier Glass - NO White Backgrounds) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link 
              href="/collections"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-[#660000] text-white font-bold text-xs sm:text-sm uppercase tracking-[0.15em] rounded-full shadow-[0_8px_25px_rgba(102,0,0,0.5)] hover:bg-[#800000] hover:scale-105 transition-all duration-300 cursor-pointer border border-[#C4852B]/30"
            >
              {t.hero.explore}
            </Link>
            
            <Link 
              href="/about"
              className="w-full sm:w-auto text-center px-8 py-3.5 border-2 border-[#C4852B] bg-black/45 text-white font-bold text-xs sm:text-sm uppercase tracking-[0.15em] rounded-full hover:bg-[#C4852B] hover:text-zinc-950 transition-all duration-300 shadow-md backdrop-blur-md cursor-pointer hover:scale-105"
            >
              {t.hero.philosophy}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
