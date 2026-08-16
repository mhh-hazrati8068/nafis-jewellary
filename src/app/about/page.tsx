"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import LogoGridInspector from "@/components/brand/LogoGridInspector";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem, TiltCard } from "@/components/ui/MotionWrappers";

export default function AboutPage() {
  const { language, t } = useAppStore();

  const colorPalette = [
    {
      nameFa: "اکر طلایی (رنگ اصلی)",
      nameEn: "Ochre Gold (Primary)",
      percent: "50%",
      hex: "#C4852B",
      rgb: "RGB(196, 133, 43)",
      bg: "bg-[#C4852B]",
      textColor: "text-white",
      descFa: "رنگ اصلی سازمانی با ۵۰٪ کاربرد در نشان، دکمه‌ها و پترن‌های طلایی.",
      descEn: "Primary brand accent (50% occurrence) used in logos, accents, and gold patterns."
    },
    {
      nameFa: "زرشکی سلطنتی",
      nameEn: "Deep Burgundy",
      percent: "20%",
      hex: "#660000",
      rgb: "RGB(102, 0, 0)",
      bg: "bg-[#660000]",
      textColor: "text-white",
      descFa: "رنگ لوکس ادیتوریال و نماد سنگ عقیق با ۲۰٪ کاربرد در CTAها و بسته‌بندی.",
      descEn: "Luxury editorial accent (20% occurrence) inspired by natural red agate gemstones."
    },
    {
      nameFa: "سفید خالص",
      nameEn: "Pure White Canvas",
      percent: "20%",
      hex: "#FFFFFF",
      rgb: "RGB(255, 255, 255)",
      bg: "bg-white",
      textColor: "text-zinc-950",
      border: "border border-zinc-300",
      descFa: "بوم پس‌زمینه و فضای منفی تنفسی با ۲۰٪ سهم در کاتالوگ و اوراق اداری.",
      descEn: "Base canvas & negative space (20% occurrence) for catalog and stationery."
    },
    {
      nameFa: "خاکستری سنگی",
      nameEn: "Slate Gray",
      percent: "5%",
      hex: "#626667",
      rgb: "RGB(98, 102, 103)",
      bg: "bg-[#626667]",
      textColor: "text-white",
      descFa: "رنگ فرعی برای متون توضیحات، خطوط جداکننده و جزئیات متریال.",
      descEn: "Secondary slate (5% occurrence) for material specs and technical details."
    },
    {
      nameFa: "سیاه عمیق",
      nameEn: "Deep Black",
      percent: "5%",
      hex: "#000000",
      rgb: "RGB(0, 0, 0)",
      bg: "bg-black",
      textColor: "text-white",
      descFa: "کنتراست متون عناوین و نسخه تک‌رنگ مونوکروم نشان.",
      descEn: "High-contrast typography (5% occurrence) and monochrome mark variants."
    }
  ];

  const ideationElements = [
    {
      titleFa: "سنگ عقیق طبیعی سرخ",
      titleEn: "Natural Red Agate Gemstone",
      descFa: "نماد اصالت، انرژی و میراث فاخر پارسی که به عنوان نگین معلق در نشان ne جای گرفته است.",
      descEn: "Iranian gemstone heritage representing authenticity, set as the droplet gem in the 'ne' mark.",
      tag: "ELEMENT 01"
    },
    {
      titleFa: "زنجیر و گردنبند طلای ۱۸ عیار",
      titleEn: "18K Gold Chain & Fine Links",
      descFa: "خطوط ظریف و هاشورهای مورب درون لوگو تداعی‌کننده بافت زنجیر و هنر دست طلاساز است.",
      descEn: "Delicate diagonal hatching within the monogram represents fine gold link craftsmanship.",
      tag: "ELEMENT 02"
    },
    {
      titleFa: "مونوگرام بین‌المللی ne",
      titleEn: "International 'ne' Monogram",
      descFa: "طراحی حروف آغازین نام نفیسه عبادی (Nafise Ebadi) با رویکرد بین‌المللی و معماری مدرن.",
      descEn: "Initials of brand founder Nafise Ebadi, crafted with contemporary architectural elegance.",
      tag: "ELEMENT 03"
    }
  ];

  return (
    <div className="py-20 md:py-32 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Hero Header */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="flex justify-center mb-6">
            <BrandLogo size="lg" showSubline={false} />
          </div>
          
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.35em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'راهنمای هویت تصویری برند ۲۰۲۶' : '2026 CORPORATE VISUAL IDENTITY MANUAL'}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight mb-8 leading-tight">
            {language === 'fa' ? 'داستان و هویت زیورآلات نفیسه عبادی' : 'The Essence of Nafise Ebadi'}
          </h1>
          <div className="w-28 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-8"></div>
          <p className="text-sm md:text-base text-[#626667] leading-relaxed font-serif italic max-w-2xl mx-auto">
            "{t.story.quote}"
          </p>
        </div>

        {/* Brand Heritage Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#C4852B]/30 shadow-2xl luxury-card-hover">
            <img 
              src="https://images.unsplash.com/photo-1573408301145-b98c46544405?q=80&w=1000&auto=format&fit=crop" 
              alt="Artisan Workshop" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase block mb-1">
                MASTER ATELIER 2026
              </span>
              <h3 className="font-brand-en text-xl font-bold">دست‌ساز و متعهد به عیار خالص ۱۸</h3>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 font-mono">
              01 / PHILOSOPHY & CRAFTSMANSHIP
            </span>
            <h2 className="text-2xl md:text-4xl font-bold uppercase mb-6 leading-tight">
              {language === 'fa' ? 'پیوند هنر مدرن با طلای ناب ۱۸ عیار' : 'Where Fine Gold Meets Pure Artistry'}
            </h2>
            <p className="text-xs md:text-sm text-[#626667] leading-relaxed mb-6">
              {language === 'fa'
                ? 'برند زیورآلات نفیسه عبادی با هدف خلق آثاری فاخر، ماندگار و فراتر از زمان در عرصه طلا و جواهرسازی معاصر بنا نهاده شده است. تمامی قطعات از طلای خالص ۱۸ عیار (۷۵۰)، سنگ‌های طبیعی عقیق سرخ و الماس‌های پاک VVS با شناسنامه اصالت ساخته می‌شوند.'
                : 'Nafise Ebadi Jewellery was established to craft timeless wearable art pieces. Every piece is forged with certified 18K solid gold (750), natural red agate gemstones, and VVS clarity diamonds.'}
            </p>
            <p className="text-xs md:text-sm text-[#626667] leading-relaxed mb-8">
              {language === 'fa'
                ? 'طراحی‌های نفیسه عبادی بر سادگی فرم، خطوط معمارانه و احترام به هویت دست‌ساز استوار است؛ به گونه‌ای که هر قطعه تجلی‌بخش درخشش و اصالت همراهان گرامی ما باشد.'
                : 'Guided by clean architectural lines and minimalist perfection, each piece reflects timeless luxury and modern sophistication.'}
            </p>
            <div>
              <Link 
                href="/collections" 
                className="inline-block px-8 py-3.5 bg-[#660000] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#7D0000] transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                {t.hero.explore}
              </Link>
            </div>
          </div>
        </div>

        {/* 02 / Color Palette & Occurrence Hierarchy (Pages 12-13 of Brand PDF) */}
        <div className="mb-32 p-8 sm:p-12 rounded-3xl bg-[#F4F1EA] border border-[#C4852B]/30 shadow-sm">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-2 block font-mono">
              02 / COLOR SPECTRUM & USAGE (PAGES 12-13)
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight mb-4">
              {language === 'fa' ? 'پالت رنگی و درصد استفاده در هویت برند' : 'Color System & Percentage Hierarchy'}
            </h2>
            <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
              {language === 'fa'
                ? 'رنگ‌های سازمانی برند به ۵ رنگ اصلی با درصد وقوع مشخص تقسیم می‌شوند تا انسجام بصری کامل در بسته‌بندی، وبسایت و کمپین‌های دیجیتال برقرار گردد.'
                : 'The official visual identity mandates strict usage distribution across 5 core colors.'}
            </p>
          </div>

          {/* Visual Percentage Progress Strip */}
          <div className="w-full h-8 rounded-xl overflow-hidden flex shadow-inner mb-10 border border-zinc-300">
            <div style={{ width: "50%" }} className="bg-[#C4852B] flex items-center justify-center text-white text-[10px] font-mono font-bold" title="Ochre Gold 50%">
              50%
            </div>
            <div style={{ width: "20%" }} className="bg-[#660000] flex items-center justify-center text-white text-[10px] font-mono font-bold" title="Deep Burgundy 20%">
              20%
            </div>
            <div style={{ width: "20%" }} className="bg-white flex items-center justify-center text-zinc-900 text-[10px] font-mono font-bold border-x border-zinc-200" title="Pure White 20%">
              20%
            </div>
            <div style={{ width: "5%" }} className="bg-[#626667] flex items-center justify-center text-white text-[8px] font-mono font-bold" title="Slate Gray 5%">
              5%
            </div>
            <div style={{ width: "5%" }} className="bg-black flex items-center justify-center text-white text-[8px] font-mono font-bold" title="Deep Black 5%">
              5%
            </div>
          </div>

          {/* Color Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {colorPalette.map((col, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className={`w-full h-20 rounded-xl ${col.bg} ${col.border || ''} mb-4 shadow-sm flex items-end p-2.5`}>
                    <span className={`font-mono text-xs font-bold ${col.textColor} bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs`}>
                      {col.percent}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-950 mb-1">
                    {language === 'fa' ? col.nameFa : col.nameEn}
                  </h4>
                  <div className="font-mono text-[11px] text-[#C4852B] font-semibold mb-2">
                    {col.hex} • {col.rgb}
                  </div>
                </div>
                <p className="text-[10px] text-[#626667] leading-relaxed border-t border-zinc-200 pt-3 mt-3">
                  {language === 'fa' ? col.descFa : col.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 03 / Ideation & Core Elements (Page 3 of Brand PDF) */}
        <div className="mb-32">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-2 block font-mono">
              03 / LOGO IDEATION & ELEMENTS (PAGE 3)
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight">
              {language === 'fa' ? 'عناصر و المان‌های اصلی در ایده‌پردازی نشان' : 'Core Design Ideation Elements'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ideationElements.map((elem, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#FAF9F5] border border-[#C4852B]/30 shadow-md luxury-card-hover flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#660000] bg-[#660000]/10 px-3 py-1 rounded-full uppercase mb-6 inline-block font-bold">
                    {elem.tag}
                  </span>
                  <h3 className="text-xl font-bold text-zinc-950 mb-3">
                    {language === 'fa' ? elem.titleFa : elem.titleEn}
                  </h3>
                  <p className="text-xs text-[#626667] leading-relaxed">
                    {language === 'fa' ? elem.descFa : elem.descEn}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between items-center text-[10px] text-[#C4852B] font-mono">
                  <span>Nafise Ebadi Visual System</span>
                  <span>✓ Certified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 03.5 / Logo Anatomy & Clear Space Grid (Pages 10-13) */}
        <div className="mb-32">
          <LogoGridInspector />
        </div>

        {/* 04 / Typography Guideline (Pages 14-18) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FAF9F5] border border-zinc-200 shadow-xl mb-16">
          <div className="max-w-3xl mb-12">
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-2 block font-mono">
              04 / OFFICIAL TYPOGRAPHY (PAGES 14-18)
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight mb-4">
              {language === 'fa' ? 'تایپوگرافی سازمانی: فونت کلمه و Clash Display' : 'Official Typefaces: Kalameh & Clash Display'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Persian Typeface */}
            <div className="p-6 rounded-2xl bg-[#F4F1EA] border border-zinc-200">
              <span className="text-[9px] font-mono text-[#660000] uppercase tracking-widest block mb-2 font-bold">
                PERSIAN TYPEFACE (قلم فارسی)
              </span>
              <h3 className="text-2xl font-bold mb-4 font-kalameh">فونت اختصاصی کلمه (Kalameh)</h3>
              <p className="text-xs text-[#626667] leading-relaxed mb-6">
                قلم فارسی سازمانی با خوانایی بسیار بالا، ساختار مستحکم و تناسب کلاسیک-مدرن در وزن‌های Thin، Regular، Bold و Black.
              </p>
              <div className="space-y-3 p-4 bg-white rounded-xl border border-zinc-200 text-xs">
                <p className="font-normal">کلمه معمولی: زیورآلات دست‌ساز طلای ۱۸ عیار نفیسه عبادی</p>
                <p className="font-bold text-sm">کلمه ضخیم: درخشش ماندگار الماس و سنگ عقیق سرخ</p>
              </div>
            </div>

            {/* English Typeface */}
            <div className="p-6 rounded-2xl bg-[#F4F1EA] border border-zinc-200">
              <span className="text-[9px] font-mono text-[#C4852B] uppercase tracking-widest block mb-2 font-bold">
                ENGLISH TYPEFACE (قلم انگلیسی)
              </span>
              <h3 className="text-2xl font-bold mb-4 font-clash uppercase">Clash Display</h3>
              <p className="text-xs text-[#626667] leading-relaxed mb-6">
                Distinct geometric high-fashion typeface engineered for timeless editorial elegance across global collections.
              </p>
              <div className="space-y-3 p-4 bg-white rounded-xl border border-zinc-200 text-xs font-clash uppercase">
                <p className="font-normal tracking-widest">Regular: Certified 18K Solid Gold & VVS Diamond</p>
                <p className="font-bold text-sm tracking-[0.15em]">Bold: Nafise Ebadi Jewellery Collection 2026</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

