"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionFadeIn, TiltCard } from "@/components/ui/MotionWrappers";
import { 
  EitaaIcon, 
  BaleIcon, 
  TelegramIcon, 
  WhatsAppIcon, 
  InstagramIcon 
} from "@/components/layout/SocialAndTrustIcons";

export default function HomeContactSection() {
  const { language } = useAppStore();

  const contactChannels = [
    {
      titleFa: "تلفن ثابت دفتر مرکزی",
      titleEn: "Atelier Concierge",
      value: "۰۲۱-۲۲۰۰۸۸۰۰",
      subFa: "پاسخگویی سریع کارشناسان نقره",
      href: "tel:02122008800",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#C4852B]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      )
    },
    {
      titleFa: "همراه پشتیبانی و واتساپ",
      titleEn: "Direct Mobile & WhatsApp",
      value: "۰۹۱۲۳۴۵۶۷۸۹",
      subFa: "مشاوره اختصاصی سایز و عقیق",
      href: "https://wa.me/989123456789",
      icon: <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
    },
    {
      titleFa: "کانال تلگرام و پیام‌رسان‌ها",
      titleEn: "Telegram & Direct Support",
      value: "@NafiseEbadi_Support",
      subFa: "سفارش آنلاین و استعلام قیمت",
      href: "https://t.me",
      icon: <TelegramIcon className="w-5 h-5 text-[#229ED9]" />
    },
    {
      titleFa: "آدرس شوروم و گالری حضوری",
      titleEn: "Physical Showroom Atelier",
      value: "تهران، فرشته، برج رز، واحد ۱۲",
      subFa: "بازدید حضوری با هماهنگی قبلی",
      href: "/contact",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#660000]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FAF9F5] border-t border-[#C4852B]/20 relative overflow-hidden transition-colors">
      <div className="container mx-auto px-4 md:px-12 relative z-10">
        
        {/* Header */}
        <MotionFadeIn direction="up" className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-2 block font-mono">
            {language === 'fa' ? 'ارتباط مستقیم با کارشناسان و شوروم' : 'CONCIERGE & DIRECT CONTACT'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            {language === 'fa' ? 'تماس با گالری زیورآلات نفیسه عبادی' : 'Contact Our Fine Jewellery Atelier'}
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-4"></div>
          <p className="text-xs sm:text-sm text-[#626667] leading-relaxed max-w-2xl mx-auto">
            {language === 'fa'
              ? 'برای سفارش اختصاصی، مشاوره انتخاب عقیق و دُرّ نجف، استعلام قیمت لحظه‌ای یا رزرو نوبت بازدید حضوری با ما در ارتباط باشید.'
              : 'Our dedicated client advisors are here to assist with custom commissions, natural gemstone consulting, and private boutique appointments.'}
          </p>
        </MotionFadeIn>

        {/* 4 Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactChannels.map((c, idx) => (
            <TiltCard key={idx} className="h-full">
              <a
                href={c.href}
                className="h-full flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 hover:border-[#C4852B] transition-all duration-300 shadow-sm luxury-card-hover block group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">
                      {c.titleFa}
                    </span>
                    <div className="p-2 rounded-xl bg-[#FAF9F5] group-hover:scale-110 transition-transform">
                      {c.icon}
                    </div>
                  </div>

                  <p className="font-mono text-base sm:text-lg font-bold text-zinc-950 group-hover:text-[#C4852B] transition-colors mb-1 dir-ltr text-start">
                    {c.value}
                  </p>

                  <p className="text-[11px] text-[#626667]">
                    {c.subFa}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-[#660000] font-bold">
                  <span>{language === 'fa' ? 'برقراری ارتباط مستقیم' : 'Connect Now'}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">←</span>
                </div>
              </a>
            </TiltCard>
          ))}
        </div>

        {/* Quick Message CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1A1816] via-[#2A1F18] to-[#1A1816] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#C4852B]/40">
          <div className="flex flex-col gap-2 text-center md:text-start">
            <span className="text-[10px] font-mono text-[#C4852B] uppercase tracking-widest font-bold">
              {language === 'fa' ? 'ساعات پاسخگویی و مشاوره' : 'SUPPORT HOURS'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              {language === 'fa' ? 'شنبه تا پنج‌شنبه از ساعت ۹:۰۰ الی ۲۱:۰۰' : 'Saturday to Thursday: 09:00 - 21:00'}
            </h3>
            <p className="text-xs text-zinc-300">
              {language === 'fa' 
                ? 'پشتیبانی ۲۴ ساعته در ایتا، بله، تلگرام و واتساپ جهت ثبت سفارشات آنلاین نقره' 
                : '24/7 direct messaging via Telegram, WhatsApp, Eitaa, and Bale'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:02122008800"
              className="px-6 py-3 bg-[#660000] hover:bg-[#7D0000] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
            >
              {language === 'fa' ? 'تماس تلفنی فوری' : 'Call Atelier'}
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-white/50 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap"
            >
              {language === 'fa' ? 'ارسال پیام در سایت' : 'Send Message'}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
