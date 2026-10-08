"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem, TiltCard } from "@/components/ui/MotionWrappers";

export default function CategoryGrid() {
  const { t, language } = useAppStore();
  const [activeMode, setActiveMode] = useState<"mode1" | "mode2">("mode1");

  // Mode 1: ست‌ها، مجموعه زنانه، مجموعه مردانه
  const mode1Cards = [
    {
      id: "mode1-sets",
      titleFa: "ست‌ها و نیم‌ست‌های نقره",
      titleEn: "Signature Silver Sets",
      titleAr: "أطقم الفضة الفاخرة",
      href: "/collections",
      image: "/images/campaign_durr_agate_ring.jpg",
      colSpan: "col-span-1 lg:col-span-1"
    },
    {
      id: "mode1-women",
      titleFa: "مجموعه اختصاصی بانوان",
      titleEn: "Women's High Jewellery",
      titleAr: "مجموعة السيدات الراقية",
      href: "/shop?filter=women",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
      colSpan: "col-span-1 lg:col-span-1"
    },
    {
      id: "mode1-men",
      titleFa: "مجموعه فاخر آقایان",
      titleEn: "Men's Heritage Silver",
      titleAr: "مجموعة الرجال الفاخرة",
      href: "/shop?filter=men",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
      colSpan: "col-span-1 lg:col-span-1"
    }
  ];

  // Mode 2: ست‌ها، دستبند، انگشتر، گردن‌آویز
  const mode2Cards = [
    {
      id: "mode2-sets",
      titleFa: "ست‌ها و نیم‌ست‌ها",
      titleEn: "Silver Sets",
      titleAr: "أطقم الفضة",
      href: "/collections",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
      colSpan: "col-span-1 lg:col-span-1"
    },
    {
      id: "mode2-bracelets",
      titleFa: "دستبند و زنجیر نقره",
      titleEn: "Silver Bracelets",
      titleAr: "أساور وسلاسل فضة",
      href: "/bracelets",
      image: "/images/campaign_silver_bracelet.jpg",
      colSpan: "col-span-1 lg:col-span-1"
    },
    {
      id: "mode2-rings",
      titleFa: "انگشتر نقره و عقیق",
      titleEn: "Silver & Agate Rings",
      titleAr: "خواتم فضة وعقيق",
      href: "/rings",
      image: "/images/campaign_durr_agate_ring.jpg",
      colSpan: "col-span-1 lg:col-span-1"
    },
    {
      id: "mode2-pendants",
      titleFa: "گردن‌آویز و پلاک نقره",
      titleEn: "Silver Pendants",
      titleAr: "قلائد ومداليات فضة",
      href: "/necklaces",
      image: "/images/campaign_agate_necklace.jpg",
      colSpan: "col-span-1 lg:col-span-1"
    }
  ];

  const currentCards = activeMode === "mode1" ? mode1Cards : mode2Cards;

  return (
    <section className="py-20 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 transition-colors duration-500 border-t border-[#C4852B]/20">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Section Title */}
        <MotionFadeIn direction="up" className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-2 block font-mono">
            {t.categories.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            {language === 'fa' ? 'کالکشن‌های اختصاصی' : t.categories.title}
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>
          
          {/* Mode Switcher Buttons */}
          <div className="inline-flex p-1 rounded-full bg-[#F4F1EA] border border-[#C4852B]/30 shadow-xs">
            <button
              onClick={() => setActiveMode("mode1")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMode === "mode1"
                  ? "bg-[#660000] text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              {language === 'fa' ? 'کالکشن‌های اختصاصی (ست‌ها، زنانه، مردانه)' : "Curated Collections"}
            </button>
            <button
              onClick={() => setActiveMode("mode2")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeMode === "mode2"
                  ? "bg-[#660000] text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              {language === 'fa' ? 'دسته‌بندی آثار (ست، دستبند، انگشتر، گردن‌آویز)' : "Jewellery Categories"}
            </button>
          </div>
        </MotionFadeIn>

        {/* Clean Holder Visual Grid - without heavy cluttered details */}
        <MotionStaggerContainer 
          key={activeMode}
          className={`grid grid-cols-1 sm:grid-cols-2 ${activeMode === 'mode1' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 md:gap-8`}
        >
          {currentCards.map((cat) => (
            <MotionStaggerItem key={cat.id} className={cat.colSpan}>
              <TiltCard className="h-full">
                <Link 
                  href={cat.href}
                  className="group relative h-[300px] sm:h-[360px] rounded-3xl overflow-hidden border border-zinc-200/90 hover:border-[#C4852B] luxury-card-hover shadow-sm block w-full bg-[#1A1816]"
                >
                  {/* Image Holder */}
                  <img 
                    src={cat.image} 
                    alt={language === 'fa' ? cat.titleFa : cat.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  
                  {/* Sleek Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>

                  {/* Clean Visual Holder - Title & Minimal Action */}
                  <div className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-between z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide group-hover:text-[#FFDF73] transition-colors">
                      {language === 'fa' ? cat.titleFa : language === 'ar' ? cat.titleAr : cat.titleEn}
                    </h3>

                    <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#660000] group-hover:scale-110 transition-all shrink-0">
                      <span className="text-sm font-bold">{language === 'en' ? '→' : '←'}</span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>

      </div>
    </section>
  );
}
