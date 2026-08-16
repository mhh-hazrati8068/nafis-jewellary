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
      titleFa: "تصویرسازی اختصاصی دست و انگشتر",
      titleEn: "Minimalist Hand & Ring Staging",
      categoryFa: "انگشتر طلای ۱۸ عیار و عقیق",
      categoryEn: "18K Gold & Agate Ring",
      bgClass: "bg-white text-zinc-950",
      borderClass: "border-[#C4852B]/30",
      logoVariant: "gold" as const,
      badgeText: "CAMPAIGN 01",
      svgContent: (
        <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Minimalist vector hand */}
          <path
            d="M90 280 L110 180 C110 160 115 130 118 100 C120 75 130 75 132 105 L135 150 L142 80 C144 60 156 60 158 85 L160 155 L168 95 C170 75 182 75 184 100 L185 165 L192 120 C194 105 204 105 206 125 C208 150 205 180 200 210 C195 240 180 280 180 280 Z"
            fill="#FFFFFF"
            stroke="#1A1816"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Gold Ring on Ring Finger */}
          <g transform="translate(162, 135)">
            <ellipse cx="6" cy="4" rx="14" ry="7" fill="#C4852B" stroke="#A76E1F" strokeWidth="1.5" />
            <circle cx="6" cy="2" r="5" fill="#660000" stroke="#C4852B" strokeWidth="1.2" />
            <circle cx="4.5" cy="0.5" r="1.2" fill="#FFAAAA" />
          </g>
        </svg>
      )
    },
    {
      id: "hands-pendant",
      titleFa: "آویز مدال عقیق و طلا",
      titleEn: "Agate Gemstone & Gold Pendant",
      categoryFa: "گردنبند عقیق طبیعی سرخ",
      categoryEn: "Natural Red Agate Pendant",
      bgClass: "bg-[#660000] text-white",
      borderClass: "border-[#C4852B]/50",
      logoVariant: "white" as const,
      badgeText: "CAMPAIGN 02",
      svgContent: (
        <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Hands holding the pendant */}
          <path
            d="M40 90 C80 110 110 140 125 180 C130 195 140 195 145 180 C160 140 190 110 230 90 L250 140 C200 170 170 210 150 270 L120 270 C100 210 70 170 20 140 Z"
            fill="#FFFFFF"
            stroke="#C4852B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Hanging Gold Chain and Agate Stone */}
          <path
            d="M100 60 Q135 150 135 170"
            stroke="#C4852B"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            fill="none"
          />
          <path
            d="M170 60 Q135 150 135 170"
            stroke="#C4852B"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            fill="none"
          />
          {/* Agate Medallion */}
          <g transform="translate(135, 185)">
            <ellipse cx="0" cy="0" rx="22" ry="28" fill="#C4852B" stroke="#FFDF73" strokeWidth="2" />
            <ellipse cx="0" cy="0" rx="16" ry="22" fill="#660000" />
            <ellipse cx="-4" cy="-6" rx="6" ry="10" fill="#990000" opacity="0.8" />
            <circle cx="-5" cy="-8" r="2.5" fill="#FFFFFF" opacity="0.8" />
          </g>
        </svg>
      )
    },
    {
      id: "hands-clasp",
      titleFa: "پیوند دست‌ها و دستبند طلا",
      titleEn: "Unity & Solid Gold Bracelet",
      categoryFa: "دستبند زنجیری طلای ۱۸ عیار",
      categoryEn: "18K Gold Link Bracelet",
      bgClass: "bg-[#C4852B] text-white",
      borderClass: "border-white/40",
      logoVariant: "white" as const,
      badgeText: "CAMPAIGN 03",
      svgContent: (
        <svg viewBox="0 0 300 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Clasping hands vector */}
          <path
            d="M30 180 C60 160 100 165 130 190 L170 190 C200 165 240 160 270 180 L250 240 C210 210 180 220 150 240 L120 210 C90 220 60 210 20 240 Z"
            fill="#FFFFFF"
            stroke="#1A1816"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Gold Bracelet on Wrist */}
          <g transform="translate(65, 175)">
            <path
              d="M0 0 C10 -8 25 -8 35 0 C25 8 10 8 0 0 Z"
              fill="#FAF9F5"
              stroke="#660000"
              strokeWidth="3.5"
            />
            <circle cx="17.5" cy="0" r="4" fill="#660000" />
          </g>
        </svg>
      )
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
            {language === 'fa' ? 'راهنمای هویت بصری ۲۰۲۶ — صفحات ۲۶ الی ۲۹' : '2026 VISUAL IDENTITY — PAGES 26-29'}
          </span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            {language === 'fa' ? 'کمپین تصویرسازی و محتوای دیجیتال' : 'Artistic Digital Campaign'}
          </h2>

          <div className="w-24 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>

          <p className="text-xs sm:text-sm text-[#626667] leading-relaxed max-w-2xl mx-auto">
            {language === 'fa'
              ? 'بر اساس راهنمای رسمی برند، محصولات نفیسه عبادی روی تصویرسازی‌های اختصاصی دست با ترکیب رنگی اکر طلایی (۵۰٪) و سرخ زرشکی (۲۰٪) به نمایش گذاشته می‌شوند تا هویتی هنری، مدرن و متمایز بیافرینند.'
              : 'As defined in the official identity manual, fine jewelry pieces are staged on custom vector hand illustrations to create a bespoke, timeless, and high-fashion editorial presence.'}
          </p>
        </div>

        {/* 3-Column Illustrated Campaign Showcase */}
        <MotionStaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {campaignCards.map((card) => (
            <MotionStaggerItem key={card.id}>
              <TiltCard className="h-full">
                <div
                  className={`group flex flex-col rounded-3xl overflow-hidden border ${card.borderClass} ${card.bgClass} shadow-xl luxury-card-hover p-6 md:p-8 relative justify-between min-h-[440px] h-full`}
                >
                  {/* Header Badge */}
                  <div className="flex items-center justify-between z-10 mb-4">
                    <span className="font-mono text-[9px] tracking-[0.25em] uppercase font-bold opacity-80">
                      {card.badgeText}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest uppercase opacity-75">
                      NAFISE EBADI
                    </span>
                  </div>

                  {/* Center Vector Illustration */}
                  <div className="relative aspect-square w-full max-w-[240px] mx-auto flex items-center justify-center my-4 group-hover:scale-105 transition-transform duration-500">
                    {card.svgContent}
                  </div>

                  {/* Bottom Info & Floating Logo */}
                  <div className="flex items-end justify-between pt-4 border-t border-current/15 z-10">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider block opacity-75 mb-1">
                        {language === 'fa' ? card.categoryFa : card.categoryEn}
                      </span>
                      <h3 className="font-bold text-base md:text-lg">
                        {language === 'fa' ? card.titleFa : card.titleEn}
                      </h3>
                    </div>

                    <BrandLogo variant={card.logoVariant} size="sm" showSubline={false} />
                  </div>
                </div>
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
            <span>{language === 'fa' ? 'مشاهده کالکشن‌های دست‌ساز ۲۰۲۶' : 'Explore 2026 Handcrafted Sets'}</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
