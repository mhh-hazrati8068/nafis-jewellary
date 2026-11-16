"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionFadeIn } from "@/components/ui/MotionWrappers";

export default function CategoryGrid() {
  const { t, language } = useAppStore();
  const [activeMode, setActiveMode] = useState<"mode1" | "mode2">("mode1");

  // Mode 1: ست‌ها و نیم‌ست‌ها، مجموعه تخصصی بانوان، مجموعه فاخر آقایان
  const mode1Cards = [
    {
      id: "mode1-sets",
      titleFa: "ست‌ها و نیم‌ست‌های نقره",
      titleEn: "Signature Silver Sets",
      titleAr: "أطقم الفضة الفاخرة",
      href: "/shop?filter=sets",
      image: "/images/campaign_agate_hand_ring.jpg",
    },
    {
      id: "mode1-women",
      titleFa: "مجموعه تخصصی بانوان",
      titleEn: "Women's High Jewellery",
      titleAr: "مجموعة السيدات الراقية",
      href: "/shop?filter=women",
      image: "/images/campaign_agate_necklace_alt.jpg",
    },
    {
      id: "mode1-men",
      titleFa: "مجموعه فاخر آقایان",
      titleEn: "Men's Heritage Silver",
      titleAr: "مجموعة الرجال الفاخرة",
      href: "/shop?filter=men",
      image: "/images/hero-silver-ring-light.jpg",
    }
  ];

  // Mode 2: ۱. سنگ‌های قرآنی، ۲. انگشتر نقره، ۳. گردنبند و گردن‌آویز نقره، ۴. دستبند نقره، ۵. زنجیر نقره
  const mode2Cards = [
    {
      id: "mode2-stones",
      titleFa: "سنگ‌های قرآنی",
      titleEn: "Quranic Gemstones",
      titleAr: "الأحجار القرآنية",
      href: "/shop?categoryId=6",
      image: "/images/brand_atelier_story.jpg",
    },
    {
      id: "mode2-rings",
      titleFa: "انگشتر نقره",
      titleEn: "Silver Rings",
      titleAr: "خواتم الفضة",
      href: "/rings",
      image: "/images/hero-silver-ring-light.jpg",
    },
    {
      id: "mode2-necklaces",
      titleFa: "گردنبند و گردن‌آویز نقره",
      titleEn: "Silver Necklaces & Pendants",
      titleAr: "قلائد ومداليات الفضة",
      href: "/necklaces",
      image: "/images/campaign_agate_necklace_alt.jpg",
    },
    {
      id: "mode2-bracelets",
      titleFa: "دستبند نقره",
      titleEn: "Silver Bracelets",
      titleAr: "أساور الفضة",
      href: "/bracelets",
      image: "/images/campaign_silver_bracelet.jpg",
    },
    {
      id: "mode2-chains",
      titleFa: "زنجیر نقره",
      titleEn: "Silver Chains",
      titleAr: "سلاسل الفضة",
      href: "/shop?filter=chains",
      image: "/images/atelier_craft_detail.jpg",
    }
  ];

  const currentCards = activeMode === "mode1" ? mode1Cards : mode2Cards;

  return (
    <section className="py-14 md:py-20 bg-white text-[#1A1816] transition-colors duration-500 border-b border-[#C4852B]/15">
      <div className="container mx-auto px-4 md:px-12">

        {/* Section Title */}
        <MotionFadeIn direction="up" className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.28em] font-semibold mb-2 block font-mono">
            {t.categories.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 text-[#1A1816]">
            {language === 'fa' ? 'کالکشن‌های اختصاصی' : t.categories.title}
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>

          {/* Mode Switcher Pills */}
          <div className="inline-flex flex-wrap justify-center p-1 rounded-full bg-[#FAF9F5] border border-[#C4852B]/25 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setActiveMode("mode1")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeMode === "mode1"
                  ? "bg-[#660000] text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              {language === 'fa' ? 'کالکشن‌های اختصاصی (ست‌ها، زنانه، مردانه)' : "Curated Collections"}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("mode2")}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeMode === "mode2"
                  ? "bg-[#660000] text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              {language === 'fa' ? 'دسته‌بندی آثار (سنگ، انگشتر، گردنبند، دستبند، زنجیر)' : "Jewellery Categories"}
            </button>
          </div>
        </MotionFadeIn>

        {/* Clean, Bright, Minimalist Collections Grid (pure CSS transitions, zero remount flicker) */}
        <div
          className={
            activeMode === "mode1"
              ? "max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6"
              : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5"
          }
        >
          {currentCards.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-200/80 hover:border-[#C4852B]/70 bg-[#FAF9F5] transition-all duration-300 shadow-2xs hover:shadow-md h-full"
            >
              <div className={`w-full overflow-hidden bg-[#F4F1EA] ${activeMode === "mode1" ? "aspect-[4/3]" : "aspect-square"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cat.image}
                  alt={language === 'fa' ? cat.titleFa : cat.titleEn}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>

              <div className="px-4 py-3.5 bg-white flex items-center justify-between gap-2 border-t border-zinc-100 mt-auto">
                <h3 className={`font-bold text-[#1A1816] group-hover:text-[#660000] transition-colors leading-snug ${activeMode === "mode1" ? "text-sm sm:text-base" : "text-xs sm:text-sm"}`}>
                  {language === 'fa' ? cat.titleFa : language === 'ar' ? cat.titleAr : cat.titleEn}
                </h3>

                <span className="w-7 h-7 rounded-full bg-[#FAF9F5] border border-zinc-200 flex items-center justify-center text-[#660000] group-hover:bg-[#660000] group-hover:text-white group-hover:border-[#660000] transition-colors shrink-0 text-xs font-bold">
                  {language === 'en' ? '→' : '←'}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
