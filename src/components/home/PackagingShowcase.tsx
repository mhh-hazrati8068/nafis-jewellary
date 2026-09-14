"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import BrandLogo from "@/components/layout/BrandLogo";
import { MotionFadeIn, TiltCard } from "@/components/ui/MotionWrappers";

type TabType = "box" | "bag" | "certificate" | "card";

interface PackagingItem {
  id: TabType;
  tagFa: string;
  tagEn: string;
  tagAr: string;
  titleFa: string;
  titleEn: string;
  titleAr: string;
  descFa: string;
  descEn: string;
  descAr: string;
  specsFa: string[];
  specsEn: string[];
  specsAr: string[];
  image: string;
}

export default function PackagingShowcase() {
  const { language } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>("box");

  const items: PackagingItem[] = [
    {
      id: "box",
      tagFa: "بسته‌بندی رسمی هدایا",
      tagEn: "OFFICIAL GIFT PACKAGING",
      tagAr: "علب الهدايا الرسمية",
      titleFa: "جعبه چرمی فاخر با نشان نقره‌کوب",
      titleEn: "Luxury Leatherette Box with Silver Accent",
      titleAr: "صندوق جلدي فاخر بختم الفضة البارز",
      descFa: "طراحی شده بر اساس صفحه ۲۱ راهنمای هویت سازمانی؛ دارای روکش زرشکی مات (#660000)، پوشش مخمل مشکی ضدخش، و مونوگرام زرین ne نقره‌کوب برجسته.",
      descEn: "Engineered according to page 21 of the corporate guidelines; featuring a matte burgundy finish (#660000), anti-tarnish black velvet interior, and embossed ne monogram.",
      descAr: "مصمم وفقاً لمعايير الهوية المؤسسية؛ بلمسة مخملية بورغندي (#660000) ومونوغرام بارز لشعار ne.",
      specsFa: ["پوشش مخمل لطیف مشکی", "نشان کوب حرارتی ne", "قفل مغناطیسی نرم و ابریشمی", "گارانتی نقره ۹۲۵ دست‌ساز"],
      specsEn: ["Anti-tarnish interior velvet", "Thermal-embossed ne crest", "Soft magnetic enclosure", "925 Silver Purity guarantee insert"],
      specsAr: ["مخمل داخلي أسود فاخر", "ختم حراري لشعار ne", "إغلاق مغناطيسي ناعم", "شهادة ضمان الفضة 925"],
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "bag",
      tagFa: "ساک خرید تشریفاتی",
      tagEn: "EDITORIAL SHOPPING TOTE",
      tagAr: "حقيبة التسوق الفاخرة",
      titleFa: "ساک خرید لوکس با بند ابریشم بافته",
      titleEn: "Boutique Shopping Bag with Braided Silk Rope",
      titleAr: "حقيبة بوتيك راقية بحبال حريرية منسوجة",
      descFa: "ساخته شده از مقوای کتان ۳۰۰ گرمی به رنگ زغالی تیره و زرشکی، کناره‌های تزئین‌شده با هاشور ۴۵ درجه و بندهای ابریشمی دست‌بافت.",
      descEn: "Crafted from 300gsm textured linen cardstock in deep charcoal and burgundy, flanked by 45° diagonal crosshatch sides and hand-braided silk handles.",
      descAr: "مصنوعة من كرتون كتان 300 غرام بلون الفحم والبورغندي مع حبال حريرية منسوجة يدوياً.",
      specsFa: ["مقوای کتان ۳۰۰ گرم فابریانو", "بندهای ابریشم دست‌بافته", "هاشور اختصاصی ۴۵ درجه در عطف", "کف تقویت‌شده ضد ضربه"],
      specsEn: ["300gsm Fabriano linen board", "Braided silk rope handles", "Signature 45° crosshatch side gussets", "Reinforced protective base"],
      specsAr: ["ورق فابريانو كتاني 300 غرام", "حبال حريرية منسوجة", "نقوش هندسية بزاوية 45°", "قاعدة مقواة لحماية القطع"],
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "certificate",
      tagFa: "شناسنامه و گواهی اصالت",
      tagEn: "CERTIFICATE OF AUTHENTICITY",
      tagAr: "شهادة الأصالة والعيار",
      titleFa: "شناسنامه عیار نقره ۹۲۵ و گوهرشناسی",
      titleEn: "925 Sterling Silver & Gemstone Registry Certificate",
      titleAr: "شهادة نقاوة الفضة 925 وتوثيق الأحجار",
      descFa: "سند رسمی ضمانت عیار نقره ۹۲۵، شماره سریال حکاکی شده، مهر هولوگرام و مشخصات گوهرشناسی سنگ فیروزه نیشابور و عقیق طبیعی.",
      descEn: "Official 925 sterling silver purity certificate, serialized validation, hologram seal, and natural gemstone origin registry.",
      descAr: "وثيقة رسمية لضمان عيار الفضة 925 ورقم تسلسلي محفور مع ختم التوثيق لحجر الفيروز والعقيق الطبيعي.",
      specsFa: ["مهر برجسته هولوگرام اصالت", "ثبت آنلاین شماره سریال محصول", "تاییدیه خلوص نقره استرلینگ ۹۲۵", "شناسنامه فیروزه و عقیق طبیعی"],
      specsEn: ["Embossed hologram seal", "Online serial code lookup", "925 Sterling silver verification", "Natural gemstone grading report"],
      specsAr: ["ختم هولوغرام بارز", "التحقق من الرقم التسلسلي أونلاين", "تأكيد نقاوة الفضة 925", "شهادة الأحجار الطبيعية"],
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "card",
      tagFa: "ست اداری و کارت ویزیت",
      tagEn: "CORPORATE STATIONERY",
      tagAr: "البطاقات والمطبوعات الرسمية",
      titleFa: "کارت ویزیت کتان با لبه‌های متالیک",
      titleEn: "Cotton Business Card with Metallic Edges",
      titleAr: "بطاقة عمل قطنية بحواف فاخرة",
      descFa: "کارت ویزیت ۳۵۰ گرمی دورو زرشکی و شیری با لبه‌های متالیک صیقلی، تایپوگرافی هماهنگ فارسی کلمه و انگلیسی کلش دیسپلی.",
      descEn: "350gsm duplex cotton board in burgundy and ivory featuring precision metallic foil edges and dual Kalameh / Clash Display typography.",
      descAr: "بطاقة قطنية فاخرة 350 غرام بحواف معدنية صقيلة مع خط كَلَمه العربي وخط Clash Display الإنجليزي.",
      specsFa: ["مقوای کتان ۳۵۰ گرمی دو لایه", "لبه‌های متالیک براق", "تایپوگرافی رسمی Kalameh", "هاشور ظریف سازمانی"],
      specsEn: ["350gsm duplex cotton stock", "Polished metallic edges", "Official Clash Display font", "Subtle corporate hatch"],
      specsAr: ["ورق قطني 350 غرام طبقتين", "حواف معدنية مصقولة", "تنسيق خط كَلَمه الرسمي", "هاشور هندسي راقٍ"],
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
              {language === 'fa' ? 'استاندارد بسته‌بندی و هویت ملموس (صفحات ۲۰ تا ۲۵ دفترچه راهنما)' : language === 'ar' ? 'معايير التغليف والهوية الملموسة' : 'CORPORATE PACKAGING & STATIONERY GUIDELINES (PAGES 20-25)'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
              {language === 'fa' ? 'بسته‌بندی و تشریفات برند نفیسه عبادی' : language === 'ar' ? 'فخامة التغليف ومراسم الاستلام' : 'Signature Packaging & Unboxing Ceremony'}
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>
            <p className="text-xs sm:text-sm text-[#626667] leading-relaxed">
              {language === 'fa'
                ? 'هر اثر دست‌ساز نقره ۹۲۵ در بسته‌بندی زرشکی اختصاصی، با ساک خرید پارچه‌ای، کارت شناسنامه عیار و مهر نقره‌کوب تحویل می‌گردد.'
                : language === 'ar'
                ? 'يتم تسليم كل قطعة فضية مصوغة يدوياً في تغليف بورغندي فاخر، مع حقيبة بوتيك أنيقة وشهادة عيار 925 معتمدة.'
                : 'Each handcrafted 925 silver creation is delivered in custom burgundy packaging with certified serial registration and silver seal.'}
            </p>
          </MotionFadeIn>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-14">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                activeTab === item.id 
                  ? "bg-[#660000] text-white border-[#660000] shadow-lg scale-105" 
                  : "bg-white text-zinc-800 border-zinc-300 hover:border-[#C4852B]"
              }`}
            >
              {language === 'fa' ? item.tagFa : language === 'ar' ? item.tagAr : item.tagEn}
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
                  {language === 'fa' ? 'مطابق کتابچه استانداردهای سازمانی' : language === 'ar' ? 'معتمد وفق دليل الهوية المؤسسية' : 'Verified Brand Manual 2026'}
                </span>
              </div>
            </div>
          </TiltCard>

          {/* Details & Specifications */}
          <MotionFadeIn direction="left" delay={0.2}>
            <div className="p-8 sm:p-10 rounded-3xl bg-[#F4F1EA] border border-[#C4852B]/30 shadow-sm">
              <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase mb-2 block font-bold">
                {language === 'fa' ? currentItem.tagFa : language === 'ar' ? currentItem.tagAr : currentItem.tagEn}
              </span>
              
              <h3 className="text-2xl sm:text-3xl font-bold uppercase text-zinc-950 mb-4">
                {language === 'fa' ? currentItem.titleFa : language === 'ar' ? currentItem.titleAr : currentItem.titleEn}
              </h3>
              
              <p className="text-xs sm:text-sm text-[#626667] leading-relaxed mb-8">
                {language === 'fa' ? currentItem.descFa : language === 'ar' ? currentItem.descAr : currentItem.descEn}
              </p>

              {/* Specs Grid */}
              <div className="space-y-3 mb-8 pb-8 border-b border-zinc-300">
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#660000] font-bold">
                  {language === 'fa' ? 'ویژگی‌ها و مشخصات فنی ساخت:' : language === 'ar' ? 'المواصفات الفنية والتصنيعية:' : 'SPECIFICATION MATRIX:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(language === 'fa' ? currentItem.specsFa : language === 'ar' ? currentItem.specsAr : currentItem.specsEn).map((spec, idx) => (
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
                    {language === 'fa' ? 'شامل تمامی سفارش‌های بالاتر از $200' : language === 'ar' ? 'مشمول مجاناً للطلبات التي تتجاوز 200$' : 'Complimentary on orders above $200'}
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
