"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { SparkleStarIcon, NecklaceIcon } from "@/components/icons/JewelryIcons";

export default function HeroSection() {
  const { t, direction, language } = useAppStore();
  const isRtl = direction === "rtl";

  return (
    <section 
      dir={direction}
      className="relative w-full overflow-hidden bg-[#150206] text-white min-h-[82vh] md:min-h-[88vh] lg:min-h-[92vh] flex items-center justify-center transition-colors duration-700"
    >
      {/* 
        ========================================================================
        Dynamic Photographic Backdrop
        - Mirrored horizontally in RTL so the hands/pendant are on the opposite 
          side of the typography, ensuring neither ever obstructs the other.
        - Precision object positioning per viewport:
          • Mobile LTR: anchored to 80% horizontal to showcase pendant at top
          • Mobile RTL: mirrored, anchored to 20% horizontal
          • Desktop: centered landscape framing
        ========================================================================
      */}
      <div 
        className={`absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000 ease-out will-change-transform ${
          isRtl 
            ? "scale-x-[-1] bg-[position:20%_18%] sm:bg-[position:35%_center] md:bg-center" 
            : "scale-x-100 bg-[position:80%_18%] sm:bg-[position:65%_center] md:bg-center"
        }`}
        style={{
          backgroundImage: "url('/images/hero-garnet-agate.jpg')",
        }}
      />

      {/* 
        ========================================================================
        Atmospheric Color Grading & Contrast Overlays
        - Deep Velvet Burgundy vignette matching the raw photo's dark red tones
        - Directional gradient to guarantee text readability in all languages
        ========================================================================
      */}
      {/* 1. Base dark vignette covering bottom & top edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#150206]/60 via-transparent to-[#150206]/95 pointer-events-none" />

      {/* 2. Directional gradient for typography side on Desktop */}
      <div 
        className={`hidden md:block absolute inset-0 pointer-events-none transition-all duration-700 ${
          isRtl
            ? "bg-gradient-to-l from-[#150206]/95 via-[#150206]/75 via-45% to-transparent"
            : "bg-gradient-to-r from-[#150206]/95 via-[#150206]/75 via-45% to-transparent"
        }`} 
      />

      {/* 3. Mobile adaptive vertical scrim to ensure text legibility on narrow screens */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#150206] via-[#150206]/85 via-55% to-[#150206]/20 pointer-events-none" />

      {/* 4. Ambient jewel glow highlighting silver and gemstone reflections */}
      <div 
        className={`absolute top-1/3 -translate-y-1/2 w-[350px] sm:w-[550px] md:w-[700px] h-[350px] sm:h-[550px] md:h-[700px] rounded-full pointer-events-none transition-all duration-1000 ${
          isRtl 
            ? "left-[10%] md:left-[15%] bg-[radial-gradient(circle,rgba(164,190,213,0.18)_0%,rgba(229,168,75,0.08)_40%,transparent_70%)]" 
            : "right-[10%] md:right-[15%] bg-[radial-gradient(circle,rgba(164,190,213,0.18)_0%,rgba(229,168,75,0.08)_40%,transparent_70%)]"
        }`} 
      />

      {/* 
        ========================================================================
        Editorial Hero Content
        - Desktop: Elegant split column anchored over the negative space
        - Mobile: Centered floating typography with generous touch targets
        ========================================================================
      */}
      <div className="relative z-10 container mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20 md:py-28 flex flex-col justify-center min-h-[inherit]">
        <div 
          className={`flex flex-col max-w-2xl transition-all duration-500 ${
            isRtl 
              ? "md:items-start md:text-right items-center text-center self-start" 
              : "md:items-start md:text-left items-center text-center self-start"
          }`}
        >
          {/* Haute Joaillerie Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#300810]/70 border border-[#E5A84B]/40 backdrop-blur-md text-[#E5A84B] text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4 sm:mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <SparkleStarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5A84B] animate-pulse" />
            <span className="font-mono tracking-[0.18em]">{t.hero.badge}</span>
          </div>

          {/* Majestic Editorial Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-[1.25] md:leading-[1.15] tracking-tight mb-4 sm:mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            {t.hero.title}
          </h1>

          {/* Narrative Subtitle */}
          <p className="text-sm sm:text-base md:text-lg font-normal text-zinc-200/90 leading-relaxed sm:leading-loose mb-8 sm:mb-10 max-w-xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t.hero.subtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <Link 
              href="/collections"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 bg-[#E5A84B] text-[#150206] hover:bg-[#F3C474] font-bold text-xs sm:text-sm uppercase tracking-[0.18em] rounded-full shadow-[0_6px_25px_rgba(229,168,75,0.35)] hover:shadow-[0_8px_30px_rgba(229,168,75,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <NecklaceIcon className="w-4 h-4 text-[#150206]" />
              <span>{t.hero.explore}</span>
            </Link>
            
            <Link 
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-9 py-3.5 sm:py-4 bg-white/5 hover:bg-white/15 text-white border border-white/30 hover:border-white/70 font-semibold text-xs sm:text-sm uppercase tracking-[0.18em] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <span>{t.hero.philosophy}</span>
            </Link>
          </div>

          {/* Subtle Craftsmanship Highlights */}
          <div className="mt-8 sm:mt-12 pt-6 border-t border-white/10 flex items-center gap-6 text-[11px] sm:text-xs text-zinc-300/80 font-mono tracking-wider">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A84B]" />
              <span>925 Sterling Silver</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A4BED5]" />
              <span>Natural Blue Agate</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Artisanal Atelier</span>
            </div>
          </div>

        </div>
      </div>

      {/* Decorative Bottom Curve Divider into Next Section */}
      <div className="absolute bottom-0 inset-x-0 h-8 sm:h-12 bg-gradient-to-t from-[#0e0204] to-transparent pointer-events-none" />
    </section>
  );
}
