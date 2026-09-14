"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/components/layout/BrandLogo";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem, TiltCard } from "@/components/ui/MotionWrappers";
import { 
  SilverPurityIcon, 
  TurquoiseMineralIcon, 
  SilversmithHammerIcon, 
  SilverShieldIcon 
} from "@/components/icons/JewelryIcons";

export default function AboutPage() {
  const { language, t } = useAppStore();

  const values = [
    {
      icon: <SilverPurityIcon className="w-6 h-6 text-[#A06314]" />,
      titleFa: "نقره ۹۲۵ استرلینگ عیار خالص",
      titleEn: "Certified 925 Sterling Silver",
      titleAr: "فضة استرليني 925 نقية معتمدة",
      descFa: "تمام آثار گالری با بالاترین استاندارد خلوص نقره ۹۲۵ و آبکاری محافظ رودیوم برای درخشش مادام‌العمر و عدم کدر شدن تولید می‌شوند.",
      descEn: "Every creation is forged from premium 925 sterling silver with protective rhodium finish for enduring brilliance.",
      descAr: "تُصاغ جميع قطعنا من الفضة الاسترليني 925 النقية مع طبقة حماية متطورة للمحافظة على البريق الخالد.",
    },
    {
      icon: <TurquoiseMineralIcon className="w-6 h-6 text-[#A06314]" />,
      titleFa: "سنگ‌های اصیل فیروزه نیشابور و عقیق",
      titleEn: "Authentic Neyshabur Turquoise & Agate",
      titleAr: "أحجار الفيروز النيسابوري والعقيق الطبيعي",
      descFa: "استفاده انحصاری از سنگ‌های معدنی ۱۰۰٪ طبیعی، شناسنامه‌دار و بدون بهسازی شیمیایی از کهن‌ترین معادن نیشابور و یمن.",
      descEn: "100% natural, certified, untreated gemstones sourced directly from heritage mines of Neyshabur and Yemen.",
      descAr: "أحجار كريمة طبيعية 100% مستخرجة من أقدم المناجم ومرفقة بشهادات فحص گوهرشناسی معتمدة.",
    },
    {
      icon: <SilversmithHammerIcon className="w-6 h-6 text-[#A06314]" />,
      titleFa: "هنر دست استادکاران نقره‌ساز",
      titleEn: "Master Silversmith Craftsmanship",
      titleAr: "صياغة يدوية بأيدي أمهر الحرفيين",
      descFa: "ترکیب تکنیک‌های سنتی قلم‌زنی و مخراج‌کاری دقیق دستی با ظرافت‌های طراحی مدرن و مینیمال معاصر.",
      descEn: "Fusing traditional Persian hand-engraving and stone setting with contemporary architectural minimalism.",
      descAr: "دمج فنون النقش اليدوي والترصيع الدقيق مع الخطوط الهندسية العصرية الراقية.",
    },
    {
      icon: <SilverShieldIcon className="w-6 h-6 text-[#A06314]" />,
      titleFa: "گارانتی اصالت و خدمات پس از فروش",
      titleEn: "Lifetime Warranty & Polishing Care",
      titleAr: "ضمان أصالة دائم وخدمات العناية",
      descFa: "ارائه فاکتور رسمی معتبر سازمانی، شناسنامه گوهرشناسی اختصاصی و خدمات تمیزکاری و پولیش دوره‌ای رایگان برای همراهان.",
      descEn: "Official corporate invoice, gemological authenticity certificate, and complimentary lifetime cleaning care.",
      descAr: "فاتورة رسمية معتمدة، شهادة أصالة للأحجار الكريمة، وخدمات تلميع وتنظيف دورية لزبائننا الكرام.",
    },
  ];

  const milestones = [
    {
      year: "۱۴۰۰",
      yearEn: "2021",
      titleFa: "تأسیس کارگاه تخصصی نفیسه عبادی",
      titleEn: "Founding the Master Silver Atelier",
      titleAr: "تأسيس ورشة صياغة الفضة",
      descFa: "آغاز فعالیت با تمرکز بر طراحی مینیمال زیورآلات نقره و احیای هنر فیروزه‌نشانی اصیل نیشابور.",
      descEn: "Inception with a focus on handcrafted minimalist silver jewelry and Neyshabur turquoise.",
      descAr: "الانطلاق بالتركيز على صياغة الفضة اليدوية وترصيع الفيروز النيسابوري.",
    },
    {
      year: "۱۴۰۲",
      yearEn: "2023",
      titleFa: "توسعه کالکشن‌های اختصاصی عقیق و نقره",
      titleEn: "Curating Natural Agate Collections",
      titleAr: "توسيع مجموعات العقيق الطبيعي",
      descFa: "طراحی نیم‌ست‌ها و انگشترهای مرصع به عقیق‌های سرخ یمنی و سلیمانی با قاب‌های دست‌ساز قلم‌زنی‌شده.",
      descEn: "Designing bespoke pendants and rings featuring rare natural Yemeni and banded agates.",
      descAr: "تصميم مجموعات مميزة من العقيق اليماني والسليماني الطبيعي المصاغ يدوياً.",
    },
    {
      year: "۱۴۰۴ - ۱۴۰۵",
      yearEn: "2025 - 2026",
      titleFa: "راه‌اندازی فروشگاه آنلاین و ارسال سراسری",
      titleEn: "E-Commerce Launch & Nationwide Delivery",
      titleAr: "إطلاق المتجر الإلكتروني والشحن المباشر",
      descFa: "فراهم‌سازی بستر خرید آنلاین امن با محاسبه‌گر لحظه‌ای نقره، صدور فاکتور رسمی و ارسال بیمه‌شده به تمام نقاط.",
      descEn: "State-of-the-art online boutique with live silver rate integration and fully insured express delivery.",
      descAr: "تقديم تجربة تسوق إلكترونية راقية مع تسعير مباشر للفضة وفواتير رسمية وشحن مؤمن بالكامل.",
    },
  ];

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-28">
          <div className="flex justify-center mb-6">
            <BrandLogo size="lg" showSubline={false} />
          </div>
          
          <span className="text-[11px] text-[#A06314] uppercase tracking-[0.3em] font-bold mb-3 block font-mono">
            {language === 'fa' 
              ? 'کارگاه تخصصی نقره و گوهرشناسی نفیسه عبادی' 
              : language === 'ar' 
              ? 'ورشة صياغة الفضة والأحجار الكريمة' 
              : 'NAFISE EBADI MASTER SILVER ATELIER'}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight mb-6 leading-tight">
            {language === 'fa' 
              ? 'اصالت نقره ۹۲۵ دست‌ساز و شکوه سنگ‌های طبیعی' 
              : language === 'ar' 
              ? 'أصالة الفضة 925 المصوغة يدوياً وفخامة الأحجار الطبيعية' 
              : 'Where Pure Silver Artistry Meets Natural Gems'}
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6 rounded-full"></div>

          <p className="text-sm md:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto font-sans">
            {language === 'fa'
              ? 'روایتی از تلفیق هنر دست استادکاران نقره‌ساز ایرانی با مرغوب‌ترین نقره استرلینگ ۹۲۵، فیروزه اصل نیشابور و عقیق‌های اصیل معدنی؛ آثاری ماندگار برای کسانی که به اصالت و ظرافت وفادارند.'
              : language === 'ar'
              ? 'قصة تدمج إبداع صائغي الفضة الإيرانية مع أجود أنواع الفضة الاسترليني 925، الفيروز النيسابوري الأصيل، والعقيق الطبيعي لتبقى قطعاً خالدة تتوارثها الأجيال.'
              : 'A dedicated silver jewelry house committed to handcrafted 925 sterling silver, authentic Neyshabur turquoise, and certified natural agate gemstones.'}
          </p>
        </div>

        {/* Studio Showcase Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-28">
          <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden border border-[#C4852B]/30 shadow-2xl">
            <Image
              src="/images/hero-silver-bg.jpg"
              alt="Nafise Ebadi Silver Atelier"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 start-6 end-6 text-white">
              <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase block mb-1 font-bold">
                FINE SILVER ATELIER
              </span>
              <h3 className="font-bold text-lg sm:text-xl">
                {language === 'fa' ? 'میز کار نقره‌سازی و ابزارهای سنتی ساخت' : 'Artisan Workbench & Silversmith Craft'}
              </h3>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[11px] text-[#C4852B] uppercase tracking-[0.25em] font-bold mb-3 font-mono">
              01 / OUR CRAFT & PHILOSOPHY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 leading-tight">
              {language === 'fa'
                ? 'تعهد به نقره خالص و هنر دست‌ساز'
                : language === 'ar'
                ? 'الالتزام بأعلى معايير الفضة النقية'
                : 'Dedicated to Sterling Silver & Hand Craftsmanship'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
              {language === 'fa'
                ? 'در کارگاه زیورآلات نقره نفیسه عبادی، هر قطعه اثر یک سفر هنری و دست‌ساز است. از ذوب شمش‌های خالص نقره و آلیاژسازی دقیق به عیار ۹۲۵ گرفته تا سوهان‌کاری، قلم‌زنی ظریف، مرصع‌کاری نگین‌های فیروزه و عقیق و پرداخت نهایی آینه‌ای.'
                : language === 'ar'
                ? 'في ورشة مجوهرات نفيسة عبادي، تمر كل قطعة برحلة حرفية دقيقة تبدأ من صهر سبائك الفضة النقية ودمجها بعيار 925 المعتمد، مروراً بالنقش والترصيع الدقيق، وحتى التلميع النهائي.'
                : 'At the Nafise Ebadi studio, each creation begins with the finest silver bullion alloyed to 925 sterling purity, meticulously shaped, engraved, and hand-set with natural untreated gemstones.'}
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
              {language === 'fa'
                ? 'ما باور داریم زیبایی واقعی در سادگی فرم، تناسبات هارمونیک و پیوند با سنگ‌های معدنی بااصالت نهفته است. زیورآلات ما برای استفاده روزمره و مناسبت‌های خاص با بالاترین دوام طراحی می‌شوند.'
                : language === 'ar'
                ? 'نؤمن بأن الفخامة الحقيقية تكمن في نقاء التصميم والأصالة التامة للأحجار الطبيعية التي تضفي هيبة وطاقة فريدة.'
                : 'We believe genuine luxury resides in harmonious proportions and ethical gemstones designed for a lifetime of beauty.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                href="/shop" 
                className="px-6 py-3 bg-[#660000] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#7D0000] transition-all shadow-md cursor-pointer"
              >
                {t.hero.explore}
              </Link>
              <Link 
                href="/collections" 
                className="px-6 py-3 border border-[#C4852B] text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#C4852B]/10 transition-all cursor-pointer"
              >
                {t.header.collections}
              </Link>
            </div>
          </div>
        </div>

        {/* Atelier Core Pillars Grid */}
        <div className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] text-[#C4852B] uppercase tracking-[0.3em] font-bold mb-2 block font-mono">
              02 / OUR PILLARS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight">
              {language === 'fa' ? 'ارزش‌ها و استانداردهای زیورآلات نفیسه عبادی' : 'Our Quality Standards & Guarantees'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <div 
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#FAF9F5] border border-[#C4852B]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 mb-4 rounded-2xl bg-[#C4852B]/10 border border-[#C4852B]/25 flex items-center justify-center text-[#A06314] shadow-2xs">
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-base text-zinc-950 mb-2 leading-snug">
                    {language === 'fa' ? v.titleFa : language === 'ar' ? v.titleAr : v.titleEn}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {language === 'fa' ? v.descFa : language === 'ar' ? v.descAr : v.descEn}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-zinc-100 flex items-center justify-between text-[10px] text-[#A06314] font-bold">
                  <span>✓ گارانتی کیفیت</span>
                  <span>نقره ۹۲۵</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="mb-24 p-8 sm:p-12 rounded-3xl bg-[#F4F1EA] border border-[#C4852B]/25">
          <div className="max-w-2xl mb-10">
            <span className="text-[11px] text-[#C4852B] uppercase tracking-[0.3em] font-bold mb-2 block font-mono">
              03 / JOURNEY
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase">
              {language === 'fa' ? 'مسیر پیشرفت و توسعه برند' : 'Our Atelier Journey'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative p-6 bg-white rounded-2xl border border-zinc-200 shadow-2xs">
                <span className="text-xs font-mono font-bold text-[#660000] bg-[#660000]/10 px-3 py-1 rounded-full inline-block mb-3">
                  {language === 'en' ? m.yearEn : m.year}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-zinc-950 mb-2">
                  {language === 'fa' ? m.titleFa : language === 'ar' ? m.titleAr : m.titleEn}
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {language === 'fa' ? m.descFa : language === 'ar' ? m.descAr : m.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Custom Order Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1A1816] to-[#2B2621] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <span className="text-[10px] text-[#C4852B] uppercase tracking-widest font-mono font-bold block mb-2">
              CUSTOM BESPOKE COMMISSIONS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 text-white">
              {language === 'fa' 
                ? 'سفارش ساخت اختصاصی زیورآلات نقره و نگین‌های خاص' 
                : 'Custom Silversmithing & Gemstone Commissions'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {language === 'fa'
                ? 'آیا طرح خاصی در نظر دارید یا مایل به سفارش نقره ۹۲۵ با سنگ فیروزه نیشابور یا عقیق با تراش دلخواه هستید؟ کارشناسان ما آماده مشاوره به شما هستند.'
                : 'Have a custom design or gemstone in mind? Our master craftsmen are available for personalized silver creations.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-[#C4852B] hover:bg-[#A76E1F] text-white text-xs font-bold uppercase tracking-wider rounded-full text-center transition-all shadow-md cursor-pointer"
            >
              {language === 'fa' ? 'مشاهده فروشگاه' : 'Shop Silver Catalog'}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
