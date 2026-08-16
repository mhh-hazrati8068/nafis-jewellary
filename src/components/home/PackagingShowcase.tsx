"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import BrandLogo from "@/components/layout/BrandLogo";
import { MotionFadeIn, TiltCard } from "@/components/ui/MotionWrappers";

export default function PackagingShowcase() {
  const { language } = useAppStore();
  const [activeTab, setActiveTab] = useState<"box" | "bag" | "certificate" | "card">("box");

  const items = [
    {
      id: "box",
      tagFa: "بسته‌بندی رسمی هدایا",
      tagEn: "OFFICIAL GIFT PACKAGING",
      titleFa: "جعبه چرمی فاخر با نشان طلاکوب",
      titleEn: "Luxury Leatherette Box with Gold Foil Stamp",
      descFa: "طراحی شده بر اساس صفحه ۲۱ راهنمای هویت سازمانی؛ دارای روکش زرشکی مات (#660000)، پوشش مخمل مشکی ضدخش، و مونوگرام زرین ne طلاکوب برجسته.",
      descEn: "Engineered according to page 21 of the corporate guidelines; featuring a matte burgundy finish (#660000), anti-tarnish black velvet interior, and embossed 18K gold foil monogram.",
      specsFa: ["پوشش مخمل لطیف مشکی", "نشان طلاکوب حرارتی ne", "قفل مغناطیسی نرم و ابریشمی", "گارانتی طلای ۱۸ عیار"],
      specsEn: ["Anti-tarnish interior velvet", "Thermal gold-embossed ne crest", "Soft magnetic enclosure", "18K Purity guarantee insert"],
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "bag",
      tagFa: "ساک خرید تشریفاتی",
      tagEn: "EDITORIAL SHOPPING TOTE",
      titleFa: "ساک خرید لوکس با بند ابریشم زرین",
      titleEn: "Boutique Shopping Bag with Braided Gold Rope",
      descFa: "ساخته شده از مقوای کتان ۳۰۰ گرمی به رنگ زغالی تیره و زرشکی، کناره‌های تزئین‌شده با هاشور ۴۵ درجه طلایی و بندهای ابریشمی دست‌بافت طلا.",
      descEn: "Crafted from 300gsm textured linen cardstock in deep charcoal and burgundy, flanked by 45° diagonal gold crosshatch sides and hand-braided gold silk handles.",
      specsFa: ["مقوای کتان ۳۰۰ گرم فابریانو", "بندهای ابریشم طلا بافته‌شده", "هاشور اختصاصی ۴۵ درجه در عطف", "کف تقویت‌شده ضد ضربه"],
      specsEn: ["300gsm Fabriano linen board", "Braided gold silk rope handles", "Signature 45° crosshatch side gussets", "Reinforced protective base"],
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "certificate",
      tagFa: "شناسنامه و گواهی اصالت",
      tagEn: "CERTIFICATE OF AUTHENTICITY",
      titleFa: "شناسنامه عیار طلا و گوهرشناسی",
      titleEn: "18K Gold Purity & Gemstone Registry Certificate",
      descFa: "سند بین‌المللی ضمانت عیار ۷۵۰، شماره سریال حکاکی شده، مهر برجسته طلایی و مشخصات میکروسکوپی سنگ عقیق طبیعی و الماس.",
      descEn: "International 750 gold purity certificate, serialized micro-engraving validation, embossed gold seal, and natural agate stone origin registry.",
      specsFa: ["مهر برجسته هولوگرام طلا", "ثبت آنلاین شماره سریال محصول", "تاییدیه خلوص عیار ۷۵۰ (18K)", "شناسنامه الماس پاک VVS"],
      specsEn: ["Embossed gold hologram seal", "Online serial code lookup", "750 (18K) purity verification", "VVS diamond grading report"],
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "card",
      tagFa: "ست اداری و کارت ویزیت",
      tagEn: "CORPORATE STATIONERY",
      titleFa: "کارت ویزیت کتان با لبه‌های ورق طلا",
      titleEn: "Cotton Business Card with Gilded Gold Edges",
      descFa: "کارت ویزیت ۳۵۰ گرمی دورو زرشکی و شیری با لبه‌های آبکاری طلای ۲۴ عیار، تایپوگرافی هماهنگ فارسی کلمه و انگلیسی کلش دیسپلی.",
      descEn: "350gsm duplex cotton board in burgundy and ivory featuring 24K gilded gold foil bevel edges and dual Kalameh / Clash Display typography.",
      specsFa: ["مقوای کتان ۳۵۰ گرمی دو لایه", "لبه‌های ورق طلای براق (Gilded)", "تایپوگرافی رسمی Kalameh", "هاشور ظریف طلایی سازمانی"],
      specsEn: ["350gsm duplex cotton stock", "24K mirror gilded edges", "Official Clash Display font", "Subtle corporate gold hatch"],
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const currentItem = items.find(i => i.id === activeTab) || items[0];

  return (
    <section className="py-24 md:py-36 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 border-t border-[#C4852B]/20 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-[#660000]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionFadeIn direction="up">
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
              {language === 'fa' ? 'استاندارد بسته‌بندی و هویت ملموس (صفحات ۲۰ تا ۲۵ دفترچه راهنما)' : 'CORPORATE PACKAGING & STATIONERY GUIDELINES (PAGES 20-25)'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
              {language === 'fa' ? 'بسته‌بندی و تشریفات برند نفیسه عبادی' : 'Signature Packaging & Unboxing Ceremony'}
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>
            <p className="text-xs sm:text-sm text-[#626667] leading-relaxed">
              {language === 'fa'
                ? 'هر اثر دست‌ساز طلا در بسته‌بندی زرشکی اختصاصی، با ساک خرید پارچه‌ای، کارت شناسنامه عیار و مهر طلاکوب تحویل می‌گردد.'
                : 'Each handcrafted gold creation is delivered in custom burgundy packaging with certified serial registration and gold foil seal.'}
            </p>
          </MotionFadeIn>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-14">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                activeTab === item.id 
                  ? "bg-[#660000] text-white border-[#660000] shadow-lg scale-105" 
                  : "bg-white text-zinc-800 border-zinc-300 hover:border-[#C4852B]"
              }`}
            >
              {language === 'fa' ? item.tagFa : item.tagEn}
            </button>
          ))}
        </div>

        {/* Interactive Staging Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* 3D Tilt Card Visual */}
          <TiltCard className="w-full">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-[#C4852B]/40 group bg-zinc-900">
              <img 
                src={currentItem.image} 
                alt={currentItem.titleFa}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* Brand Logo Watermark Overlay */}
              <div className="absolute top-6 left-6 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-[#C4852B]/30">
                <BrandLogo variant="white" size="sm" showSubline={false} />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 right-6 px-4 py-2 bg-[#660000] text-white rounded-xl shadow-xl border border-[#C4852B]/50">
                <span className="text-[10px] font-mono uppercase tracking-widest block font-bold text-[#C4852B]">
                  100% BRAND ACCREDITED
                </span>
                <span className="text-[9px] text-zinc-200">
                  {language === 'fa' ? 'مطابق کتابچه استانداردهای سازمانی' : 'Verified Brand Manual 2026'}
                </span>
              </div>
            </div>
          </TiltCard>

          {/* Details & Specifications */}
          <MotionFadeIn direction="left" delay={0.2}>
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F4F1EA] border border-[#C4852B]/30 shadow-sm">
              <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase mb-2 block font-bold">
                {language === 'fa' ? currentItem.tagFa : currentItem.tagEn}
              </span>
              
              <h3 className="text-2xl sm:text-3xl font-bold uppercase text-zinc-950 mb-4">
                {language === 'fa' ? currentItem.titleFa : currentItem.titleEn}
              </h3>
              
              <p className="text-xs sm:text-sm text-[#626667] leading-relaxed mb-8">
                {language === 'fa' ? currentItem.descFa : currentItem.descEn}
              </p>

              {/* Specs Grid */}
              <div className="space-y-3 mb-8 pb-8 border-b border-zinc-300">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#660000] font-bold">
                  {language === 'fa' ? 'ویژگی‌ها و مشخصات فنی ساخت:' : 'SPECIFICATION MATRIX:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(language === 'fa' ? currentItem.specsFa : currentItem.specsEn).map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4852B]"></span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Note */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <span className="text-[11px] text-[#626667]">
                    {language === 'fa' ? 'شامل تمامی سفارش‌های بالاتر از $200' : 'Complimentary on orders above $200'}
                  </span>
                </div>
              </div>
            </div>
          </MotionFadeIn>

        </div>

      </div>
    </section>
  );
}
