"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrappers";

export default function SocialCampaignSection() {
  const { language } = useAppStore();

  const luxuryAdvantages = [
    {
      id: "packaging",
      num: "01",
      titleFa: "بسته‌بندی لوکس و اختصاصی محصولات",
      titleEn: "Exclusive Luxury Packaging",
      titleAr: "تغليف فاخر ومخصص للمنتجات",
      descFa: "جعبه‌های مخملی و چرمی دست‌ساز با نشان زرین برند و لایه محافظ ضدکدرشدگی نقره ۹۲۵، طراحی‌شده برای حفظ شکوه هر اثر.",
      descEn: "Custom velvet-lined presentation boxes with embossed brand crest and anti-tarnish protection crafted for every silver heirloom.",
      descAr: "علب مخملية وجلدية مصممة خصيصاً مع ختم العلامة التجارية لحماية بريق الفضة.",
      image: "/images/luxury_jewelry_box.jpg",
      altFa: "بسته‌بندی لوکس و اختصاصی زیورآلات نفیسه عبادی",
      altEn: "Nafise Ebadi luxury jewelry presentation box",
      href: "/shop",
      ctaFa: "مشاهده آثار",
      ctaEn: "Explore Pieces",
    },
    {
      id: "ceremony",
      num: "02",
      titleFa: "تشریفات و نحوه ارائه سفارش‌ها",
      titleEn: "Ceremonial Order Presentation",
      titleAr: "مراسم التقديم والتسليم الملكي",
      descFa: "ارسال هر سفارش همراه با ساک خرید تشریفاتی، فاکتور رسمی، شناسنامه معتبر اصالت نقره ۹۲۵ و مهر موم اختصاصی گالری.",
      descEn: "Every order arrives in a ceremonial boutique bag accompanied by an official invoice, serialized 925 certificate, and gallery seal.",
      descAr: "يُقدّم كل طلب مع حقيبة بوتيك فاخرة، فاتورة رسمية، شهادة أصالة وختم الغاليري.",
      image: "/images/luxury_boutique_bag.jpg",
      altFa: "تشریفات ارائه سفارش و ساک خرید اختصاصی نفیسه عبادی",
      altEn: "Luxury ceremonial shopping tote and wax-sealed presentation",
      href: "/stores",
      ctaFa: "تجربه گالری",
      ctaEn: "Showroom Experience",
    },
    {
      id: "craft",
      num: "03",
      titleFa: "ظرافت در طراحی و ساخت",
      titleEn: "Refinement in Design & Craft",
      titleAr: "دقة التصميم ورقة الصياغة",
      descFa: "طراحی مینیمال، تراز دقیق رکاب با تراش نگین‌های طبیعی عقیق و دُرّ نجف و قلم‌زنی هنرمندانه با امضای اختصاصی نفیسه عبادی.",
      descEn: "Minimalist proportions, precision setting around natural agates and Durr-e Najaf, and delicate hand-finishing.",
      descAr: "تصاميم مينيمال راقية وتنفيذ متقن لأحجار العقيق ودر النجف الطبيعي.",
      image: "/images/atelier_craft_detail.jpg",
      altFa: "ظرافت طراحی و ساخت زیورآلات دست‌ساز نقره ۹۲۵",
      altEn: "Delicate silver craftsmanship and Durr-e Najaf gemstone setting",
      href: "/collections",
      ctaFa: "مشاهده کالکشن",
      ctaEn: "View Collections",
    },
    {
      id: "detail",
      num: "04",
      titleFa: "توجه به جزئیات و کیفیت نهایی محصولات",
      titleEn: "Obsessive Detail & Final Finish",
      titleAr: "العناية بأدق التفاصيل وجودة التشطيب",
      descFa: "کنترل کیفیت چندمرحله‌ای، صیقل آینه‌ای استاندارد، انتخاب دست‌چین سنگ‌های کمیاب و ارائه کیت مراقبت جهت ماندگاری درخشش.",
      descEn: "Multi-stage quality inspection, mirror-grade silver polishing, rare gemstone selection, and a dedicated care kit.",
      descAr: "فحص جودة دقيق متعدد المراحل مع تلميع فضي فاخر ومجموعة عناية خاصة.",
      image: "/images/luxury_care_kit.jpg",
      altFa: "توجه به جزئیات، صیقل آینه‌ای و کیت مراقبت نقره ۹۲۵",
      altEn: "Fine polishing detail and silver care guide",
      href: "/articles/silver-and-gemstone-care-guide",
      ctaFa: "استاندارد کیفیت",
      ctaEn: "Quality Guide",
    }
  ];

  return (
    <section className="py-18 md:py-24 bg-[#FAF9F5] text-[#1A1816] border-t border-[#C4852B]/15 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12 relative z-10">

        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-14">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.28em] font-semibold mb-2 block font-mono">
            {language === 'fa' ? 'ارزش‌های متمایز برند نفیسه عبادی' : 'THE ATELIER DIFFERENCE'}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4 text-[#1A1816]">
            {language === 'fa' ? 'استاندارد لوکس در بسته‌بندی، طراحی و اجرا' : 'Luxury Presentation & Master Craftsmanship'}
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-4"></div>
          <p className="text-xs sm:text-sm text-[#5E5B56] leading-relaxed">
            {language === 'fa'
              ? 'از لحظه طراحی رکاب و انتخاب سنگ‌های اصیل تا تشریفات ارائه سفارش، تمامی جزئیات با دقت و هویت لوکس مجموعه نفیسه عبادی شکل می‌گیرد.'
              : 'From initial stone curation to final presentation, every stage honors the minimalist luxury identity of Nafise Ebadi.'}
          </p>
        </div>

        {/* 4-Column Light Minimal Luxury Pillars Grid */}
        <MotionStaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {luxuryAdvantages.map((item) => (
            <MotionStaggerItem key={item.id}>
              <Link
                href={item.href}
                className="group flex flex-col rounded-2xl overflow-hidden border border-zinc-200/80 hover:border-[#C4852B]/70 bg-white shadow-2xs hover:shadow-md transition-all duration-300 h-full justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F1EA]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={language === 'fa' ? item.altFa : item.altEn}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#C4852B]">
                        {item.num}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-[#1A1816] mb-2 group-hover:text-[#660000] transition-colors leading-snug">
                      {language === 'fa' ? item.titleFa : language === 'ar' ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-xs text-[#5E5B56] leading-relaxed">
                      {language === 'fa' ? item.descFa : language === 'ar' ? item.descAr : item.descEn}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-zinc-100 flex items-center justify-between text-[11px] font-bold text-[#660000]">
                  <span>{language === 'fa' ? item.ctaFa : item.ctaEn}</span>
                  <span>{language === 'en' ? '→' : '←'}</span>
                </div>
              </Link>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>

      </div>
    </section>
  );
}
