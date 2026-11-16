"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionFadeIn, TiltCard } from "@/components/ui/MotionWrappers";

export default function BrandStory() {
  const { t } = useAppStore();

  return (
    <section className="py-24 md:py-36 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 border-t border-[#C4852B]/20 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#C4852B]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Editorial Visual Frame */}
          <TiltCard className="relative group">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-[#C4852B]/25 bg-[#F4F1EA]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/brand_atelier_story.jpg" 
                alt="کارگاه تخصصی نقره‌سازی و گوهرنشانی عقیق اصیل و دُرّ نجف - زیورآلات نفیسه عبادی" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              />
            </div>

            {/* Minimal Frosted Heritage Stamp */}
            <div className="hidden sm:block absolute bottom-5 end-5 px-5 py-3 bg-white/85 backdrop-blur-md text-[#1A1816] rounded-2xl shadow-sm border border-[#C4852B]/30">
              <span className="font-mono text-sm font-bold text-[#660000] block">925 STERLING SILVER</span>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Handcrafted Artisan Heritage</p>
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

            <div className="space-y-4 text-xs sm:text-sm text-[#626667] leading-loose mb-10">
              <p>{t.story.p1}</p>
              <p>{t.story.p2}</p>
              {t.story.p3 && <p>{t.story.p3}</p>}
              {t.story.p4 && <p>{t.story.p4}</p>}
            </div>

            {/* Quote Box */}
            <div className="p-6 rounded-2xl bg-[#F4F1EA] border-s-4 border-[#660000] mb-10 shadow-sm">
              <p className="text-sm font-semibold text-zinc-900 leading-relaxed mb-2">
                &laquo;{t.story.quote}&raquo;
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
