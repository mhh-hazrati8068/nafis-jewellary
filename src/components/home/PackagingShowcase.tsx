"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import BrandLogo from "@/components/layout/BrandLogo";
import { MotionFadeIn, TiltCard } from "@/components/ui/MotionWrappers";
import { SparkleStarIcon } from "@/components/icons/JewelryIcons";

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
      tagAr: "علب الهدايا الفاخرة",
      titleFa: "جعبه چرمی و مخمل فاخر با نشان نقره‌کوب",
      titleEn: "Luxury Leatherette & Velvet Presentation Box",
      titleAr: "صندوق جلدي ومخملي فاخر بختم الفضة",
      descFa: "پوشش مخمل مشکی ضدکدرشدگی برای حفظ درخشش نقره ۹۲۵، بدنه چرمی مات زرشکی با قفل مغناطیسی نرم و محافظ، طراحی شده برای مراقبت از سنگ‌های قیمتی و ماندگاری هدیه.",
      descEn: "Engineered with anti-tarnish black velvet interior to preserve the mirror luster of 925 sterling silver, featuring a matte burgundy exterior and protective magnetic enclosure.",
      descAr: "مبطن بمخمل أسود خاص لحماية لمعان الفضة الإسترلينية 925 مع هيكل بورغندي فاخر وإغلاق مغناطيسي آمن.",
      specsFa: ["پوشش مخمل لطیف ضدکدرشدگی نقره", "نشان نقره‌کوب برجسته نفیس", "قفل مغناطیسی نرم و ابریشمی", "مناسب هدیه و یادبود ماندگار"],
      specsEn: ["Anti-tarnish interior velvet", "Embossed luxury silver crest", "Soft magnetic safety enclosure", "Signature gift keepsake box"],
      specsAr: ["مخمل داخلي مضاد للأكسدة", "ختم فضي بارز وفاخر", "إغلاق مغناطيسي ناعم", "علبة هدايا تذكارية أنيقة"],
      image: "/images/luxury_jewelry_box.jpg"
    },
    {
      id: "bag",
      tagFa: "ساک خرید تشریفاتی",
      tagEn: "EDITORIAL SHOPPING TOTE",
      tagAr: "حقيبة التسوق الفاخرة",
      titleFa: "ساک خرید لوکس با بند ابریشم بافته",
      titleEn: "Boutique Shopping Bag with Braided Silk Rope",
      titleAr: "حقيبة بوتيك راقية بحبال حريرية منسوجة",
      descFa: "ساخته شده از مقوای کتان ضخیم ۳۰۰ گرمی با بندهای ابریشمی دست‌بافته و کف تقویت‌شده ضدضربه، تضمین‌کننده حمل امن و ارائه‌ای باشکوه برای زیورآلات فاخر.",
      descEn: "Crafted from heavy 300gsm textured linen cardstock with hand-braided silk handles and reinforced shock-resistant base for secure delivery.",
      descAr: "مصنوعة من كرتون كتان 300 غرام متين مع حبال حريرية منسوجة يدوياً وقاعدة مقواة لحماية القطع.",
      specsFa: ["مقوای کتان ۳۰۰ گرم فابریانو", "بندهای ابریشم دست‌بافته مقاوم", "کف تقویت‌شده ضد ضربه", "طراحی ارگونومیک و چشم‌نواز"],
      specsEn: ["300gsm Fabriano linen board", "Braided silk rope handles", "Reinforced protective base", "Ergonomic luxury presentation"],
      specsAr: ["ورق فابريانو كتاني 300 غرام", "حبال حريرية منسوجة متينة", "قاعدة مقواة ضد الصدمات", "تصميم فخم ومريح للحمل"],
      image: "/images/luxury_boutique_bag.jpg"
    },
    {
      id: "certificate",
      tagFa: "شناسنامه و گواهی اصالت",
      tagEn: "CERTIFICATE OF AUTHENTICITY",
      tagAr: "شهادة الأصالة والعيار",
      titleFa: "شناسنامه عیار نقره ۹۲۵ و گوهرشناسی",
      titleEn: "925 Sterling Silver & Gemstone Registry Certificate",
      titleAr: "شهادة نقاوة الفضة 925 وتوثيق الأحجار",
      descFa: "سند رسمی ضمانت خلوص نقره ۹۲۵، ثبت شماره سریال اختصاصی محصول، هولوگرام زرین و تاییدیه اصالت سنگ فیروزه اصیل نیشابور و عقیق طبیعی.",
      descEn: "Official certificate verifying 925 sterling silver purity, serialized product code, golden hologram seal, and natural Neyshabur turquoise / agate origin report.",
      descAr: "وثيقة رسمية لضمان عيار الفضة 925 ورقم تسلسلي محفور مع ختم التوثيق لحجر الفيروز النيشابوري والعقيق الطبيعي.",
      specsFa: ["تاییدیه رسمی خلوص نقره استرلینگ ۹۲۵", "شناسنامه فیروزه نیشابور و عقیق معدنی", "ثبت آنلاین شماره سریال محصول", "مهر و هولوگرام زرین اصالت"],
      specsEn: ["925 Sterling silver purity verification", "Natural turquoise & agate grading report", "Online serial code registry", "Gold hologram security seal"],
      specsAr: ["تأكيد نقاوة الفضة 925", "شهادة فحص الفيروز والعقيق الطبيعي", "تسجيل الرقم التسلسلي أونلاين", "ختم أمان هولوغرام ذهبي"],
      image: "/images/luxury_certificate_seal.jpg"
    },
    {
      id: "card",
      tagFa: "کیت جلا و نگهداری نقره",
      tagEn: "SILVER CARE & POLISHING KIT",
      tagAr: "مجموعة العناية والتلميع",
      titleFa: "دستمال نانو جلا و دفترچه نگهداری نقره",
      titleEn: "Silver Polishing Cloth & Lifetime Care Guide",
      titleAr: "منديل نانو لتلميع الفضة ودليل العناية",
      descFa: "همراه با دستمال میکروفیبر مخصوص جلادهی نقره بدون ایجاد خط و خش و بروشور راهنمای نگهداری زیورآلات نقره و نگین‌های طبیعی جهت حفظ درخشش همیشگی.",
      descEn: "Includes a gentle microfiber silver polishing cloth and comprehensive care guide for preserving the brilliant shine of silver and precious gemstones.",
      descAr: "يتضمن منديلاً ناعماً خاصاً بتلميع الفضة دون خدوش ودليلاً شاملاً للعناية ببريق الفضة والأحجار الكريمة.",
      specsFa: ["دستمال نانو مخصوص جلای نقره", "راهنمای تخصصی مراقبت از سنگ‌ها", "حفظ درخشش بدون ایجاد خط و خش", "پشتیبانی و مشاوره گالری"],
      specsEn: ["Ultra-soft silver polishing cloth", "Gemstone care instructions", "Non-abrasive luster restoration", "Dedicated boutique support"],
      specsAr: ["منديل نانو فائق النعومة لتلميع الفضة", "تعليمات خاصة للعناية بالأحجار", "إعادة اللمعان دون خدوش", "استشارات ودعم البوتيك الدائم"],
      image: "/images/luxury_care_kit.jpg"
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
              {language === 'fa' ? 'بسته‌بندی تشریفاتی و تجربه جعبه‌گشایی' : language === 'ar' ? 'فخامة التغليف ومراسم الاستلام' : 'LUXURY UNBOXING & PRESENTATION EXPERIENCE'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
              {language === 'fa' ? 'بسته‌بندی و تشریفات برند نفیسه عبادی' : language === 'ar' ? 'فخامة التغليف والتقديم الرسمي' : 'Signature Packaging & Presentation Ceremony'}
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
                  100% SILVER 925
                </span>
                <span className="text-[9px] text-zinc-200">
                  {language === 'fa' ? 'بسته‌بندی رسمی و شناسنامه اصالت' : language === 'ar' ? 'تغليف رسمي وشهادة الأصالة' : 'Certified Luxury Presentation'}
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
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#C4852B]/10 text-[#C4852B] flex items-center justify-center shrink-0">
                    <SparkleStarIcon className="w-4 h-4" />
                  </span>
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
