"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { MotionStaggerContainer, MotionStaggerItem, TiltCard } from "@/components/ui/MotionWrappers";

export default function SocialCampaignSection() {
  const { language } = useAppStore();

  const campaignCards = [
    {
      id: "hands-rings",
      titleFa: "انگشترهای فاخر نقره با گوهرنشانی فیروزه نیشابور",
      titleEn: "Mastercrafted 925 Silver Rings with Natural Turquoise",
      categoryFa: "انگشتر نقره دست‌ساز و سنگ‌های قیمتی",
      categoryEn: "Handcrafted Silver Ring Collection",
      href: "/rings",
      image: "/images/campaign_turquoise_ring.jpg",
      altFa: "انگشتر نقره ۹۲۵ دست‌ساز با سنگ فیروزه اصل نیشابور",
      altEn: "Handcrafted 925 sterling silver ring with natural Neyshabur turquoise",
      badgeText: "SIGNATURE 01",
      tagFa: "فیروزه اصل نیشابور",
      tagEn: "Neyshabur Turquoise",
    },
    {
      id: "hands-pendant",
      titleFa: "آویز و مدال‌های قلم‌زنی نقره با عقیق سرخ طبیعی",
      titleEn: "Hand-Engraved Silver Pendants & Natural Agate",
      categoryFa: "گردنبند و مدال‌های سنتی و مدرن",
      categoryEn: "Artisanal Silver Pendants",
      href: "/necklaces",
      image: "/images/campaign_agate_necklace.jpg",
      altFa: "گردنبند و مدال قلم‌زنی نقره با سنگ عقیق طبیعی سرخ",
      altEn: "Hand-engraved sterling silver necklace with natural red agate",
      badgeText: "SIGNATURE 02",
      tagFa: "عقیق طبیعی سرخ",
      tagEn: "Natural Red Agate",
    },
    {
      id: "hands-clasp",
      titleFa: "دستبندها و النگوهای نقره با صیقل آینه‌ای زرگری",
      titleEn: "Mirror-Finish Sterling Silver Bracelets & Bangles",
      categoryFa: "دستبند زنجیری و النگوی نقره استرلینگ",
      categoryEn: "925 Silver Link Bracelets",
      href: "/bracelets",
      image: "/images/campaign_silver_bracelet.jpg",
      altFa: "دستبند زنجیری و النگوی نقره استرلینگ ۹۲۵",
      altEn: "Mirror-finish 925 sterling silver link bracelet and bangle",
      badgeText: "SIGNATURE 03",
      tagFa: "نقره عیار ۹۲۵ استرلینگ",
      tagEn: "925 Sterling Silver",
    }
  ];

  return (
    <section className="py-24 md:py-36 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 border-t border-[#C4852B]/20 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Subtle Watermark Pattern */}
      <div className="absolute inset-0 brand-gold-pattern opacity-40 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.35em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'هنر زرگری و ساخت اختصاصی زیورآلات' : 'HANDCRAFTED 925 SILVER ATELIER'}
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            {language === 'fa' ? 'ظرافت هنر دست‌ساز و اصالت نقره ۹۲۵' : 'Mastercrafted Silver & Natural Gemstones'}
          </h2>

          <div className="w-24 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>

          <p className="text-xs sm:text-sm text-[#626667] leading-relaxed max-w-2xl mx-auto">
            {language === 'fa'
              ? 'هر اثر از زیورآلات نقره نفیسه عبادی با تلفیق هنر قلم‌زنی استادکاران، گوهرنشانی فیروزه نیشابور و عقیق طبیعی و صیقل بی‌نقص زرگری آفریده شده است تا شکوهی جاودان به استایل شما ببخشد.'
              : 'Every piece from Nafise Ebadi Jewellery combines traditional master silversmithing, authentic Neyshabur turquoise and Yemeni agate setting, creating timeless elegance and refined personal style.'}
          </p>
        </div>

        {/* 3-Column Illustrated Campaign Showcase */}
        <MotionStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {campaignCards.map((card) => (
            <MotionStaggerItem key={card.id}>
              <TiltCard className="h-full">
                <Link
                  href={card.href}
                  className="group flex flex-col rounded-3xl overflow-hidden border border-[#C4852B]/30 bg-[#1A1816] shadow-2xl relative min-h-[480px] h-full justify-between transition-all duration-500 hover:border-[#C4852B] hover:shadow-[0_20px_40px_rgba(196,133,43,0.2)] block"
                >
                  {/* Photo Container */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.image}
                      alt={language === 'fa' ? card.altFa : card.altEn}
                      className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {/* Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/30 group-hover:via-zinc-950/20 transition-colors duration-500"></div>
                  </div>

                  {/* Header Badge */}
                  <div className="flex items-center justify-between z-10 p-6">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold text-white bg-[#660000]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#C4852B]/40">
                      {card.badgeText}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white/80 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {language === 'fa' ? card.tagFa : card.tagEn}
                    </span>
                  </div>

                  {/* Bottom Info & Action */}
                  <div className="p-6 pt-12 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C4852B] block mb-1 font-semibold">
                      {language === 'fa' ? card.categoryFa : card.categoryEn}
                    </span>
                    <h3 className="font-bold text-lg md:text-xl text-white mb-4 group-hover:text-[#FFDF73] transition-colors leading-snug">
                      {language === 'fa' ? card.titleFa : card.titleEn}
                    </h3>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/20">
                      <span className="text-xs font-semibold text-white/90 group-hover:text-white flex items-center gap-2">
                        <span>{language === 'fa' ? 'مشاهده کالکشن' : 'View Collection'}</span>
                        <span className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">→</span>
                      </span>
                      <BrandLogo variant="white" size="sm" showSubline={false} />
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>

        {/* Bottom CTA to View Collections */}
        <div className="flex justify-center">
          <Link
            href="/collections"
            className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#660000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-[0_8px_25px_rgba(102,0,0,0.35)] hover:bg-[#7D0000] hover:scale-105 transition-all duration-300"
          >
            <span>{language === 'fa' ? 'مشاهده همه کالکشن‌های دست‌ساز نقره' : 'Explore Handcrafted Collections'}</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

