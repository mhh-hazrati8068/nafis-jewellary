"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionFadeIn, TiltCard } from "@/components/ui/MotionWrappers";

export default function BrandStory() {
  const { t, language } = useAppStore();

  return (
    <section className="py-24 md:py-36 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 border-t border-[#C4852B]/20 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C4852B]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Editorial Visual Frame */}
          <TiltCard className="relative group">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-[#C4852B]/30 luxury-card-hover">
              <img 
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop" 
                alt="Brand Workshop" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Floating Luxury Stamp */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 p-6 bg-[#660000] text-white rounded-2xl shadow-2xl max-w-[200px] border border-[#C4852B]/40 hidden sm:block animate-pulse">
              <span className="font-mono text-2xl font-bold text-[#C4852B] block mb-1">18K GOLD</span>
              <p className="text-[10px] uppercase tracking-widest leading-tight">Handcrafted Artisan Certificate</p>
            </div>
          </TiltCard>

          {/* Text Content */}
          <MotionFadeIn direction="left" delay={0.2} className="flex flex-col justify-center">
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
              {t.story.tag}
            </span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8 leading-tight">
              {t.story.title}
            </h2>

            <div className="space-y-6 text-xs sm:text-sm text-[#626667] leading-relaxed mb-10">
              <p>{t.story.p1}</p>
              <p>{t.story.p2}</p>
            </div>

            {/* Quote Box */}
            <div className="p-6 rounded-2xl bg-[#F4F1EA] border-l-4 border-[#660000] mb-10 shadow-sm">
              <p className="font-serif italic text-sm text-zinc-900 mb-2">
                "{t.story.quote}"
              </p>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#660000] font-bold block">
                — {t.story.quoteAuthor}
              </span>
            </div>

            <div>
              <Link 
                href="/about" 
                className="inline-block px-8 py-3.5 bg-[#660000] hover:bg-[#7D0000] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-lg transition-all hover:scale-105"
              >
                {t.story.button}
              </Link>
            </div>
          </MotionFadeIn>

        </div>
      </div>
    </section>
  );
}
