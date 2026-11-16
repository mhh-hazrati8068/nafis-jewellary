"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionFadeIn, TiltCard } from "@/components/ui/MotionWrappers";
import { CONTACT_CONFIG } from "@/lib/contactConfig";
import { TelegramIcon, WhatsAppIcon } from "@/components/layout/SocialAndTrustIcons";

export default function HomeContactSection() {
  const { language } = useAppStore();

  const pendingFa = "در حال به‌روزرسانی";
  const pendingEn = "Updating Official Details";
  const pendingAr = "جارٍ التحديث";

  const contactChannels = [
    {
      titleFa: "تلفن تماس مجموعه",
      titleEn: "Official Phone",
      titleAr: "هاتف التواصل",
      value: CONTACT_CONFIG.isVerified && CONTACT_CONFIG.landlineDisplay
        ? CONTACT_CONFIG.landlineDisplay
        : (language === "fa" ? pendingFa : language === "ar" ? pendingAr : pendingEn),
      subFa: CONTACT_CONFIG.isVerified
        ? "پاسخگویی کارشناسان مجموعه"
        : "شماره تماس رسمی پس از تایید نهایی مجموعه درج می‌شود",
      subEn: CONTACT_CONFIG.isVerified ? "Client concierge line" : "Official phone number will be published shortly",
      href: CONTACT_CONFIG.isVerified && CONTACT_CONFIG.landlineHref ? CONTACT_CONFIG.landlineHref : "/contact",
      isLtr: Boolean(CONTACT_CONFIG.isVerified && CONTACT_CONFIG.landlineDisplay),
      ctaFa: "تماس تلفنی",
      ctaEn: "Call Now",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#C4852B]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      )
    },
    {
      titleFa: CONTACT_CONFIG.whatsappDisplay ? "واتساپ و پشتیبانی" : "شماره تماس مستقیم",
      titleEn: CONTACT_CONFIG.whatsappDisplay ? "WhatsApp & Support" : "Direct Contact Number",
      titleAr: CONTACT_CONFIG.whatsappDisplay ? "واتساب والدعم" : "رقم التواصل المباشر",
      value: CONTACT_CONFIG.isVerified && (CONTACT_CONFIG.whatsappDisplay || CONTACT_CONFIG.mobileDisplay)
        ? (CONTACT_CONFIG.whatsappDisplay || CONTACT_CONFIG.mobileDisplay)
        : (language === "fa" ? pendingFa : language === "ar" ? pendingAr : pendingEn),
      subFa: CONTACT_CONFIG.whatsappDisplay
        ? "مشاوره تخصصی و استعلام موجودی"
        : CONTACT_CONFIG.isVerified && CONTACT_CONFIG.mobileDisplay
        ? "ارتباط مستقیم و مشاوره سفارش"
        : "شماره تماس مستقیم به‌زودی جایگزین می‌شود",
      subEn: CONTACT_CONFIG.whatsappDisplay
        ? "WhatsApp consultation"
        : CONTACT_CONFIG.isVerified && CONTACT_CONFIG.mobileDisplay
        ? "Direct mobile inquiry line"
        : "Direct contact coming soon",
      href: CONTACT_CONFIG.isVerified && (CONTACT_CONFIG.whatsappHref || CONTACT_CONFIG.mobileHref)
        ? (CONTACT_CONFIG.whatsappHref || CONTACT_CONFIG.mobileHref)
        : "/contact",
      isLtr: Boolean(CONTACT_CONFIG.isVerified && (CONTACT_CONFIG.whatsappDisplay || CONTACT_CONFIG.mobileDisplay)),
      ctaFa: CONTACT_CONFIG.whatsappHref ? "گفتگو در واتساپ" : "تماس مستقیم",
      ctaEn: CONTACT_CONFIG.whatsappHref ? "Chat on WhatsApp" : "Call Mobile",
      icon: CONTACT_CONFIG.whatsappHref ? (
        <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#C4852B]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      )
    },
    {
      titleFa: "تلگرام مجموعه",
      titleEn: "Telegram Support",
      titleAr: "تيليجرام",
      value: CONTACT_CONFIG.telegramHandle || pendingFa,
      subFa: "کانال و پشتیبانی رسمی محصولات",
      subEn: "Official Telegram channel & product showcase",
      href: CONTACT_CONFIG.telegramHref || "/contact",
      isLtr: Boolean(CONTACT_CONFIG.telegramHandle),
      ctaFa: "مشاهده کانال",
      ctaEn: "Open Telegram",
      icon: <TelegramIcon className="w-5 h-5 text-[#229ED9]" />
    },
    {
      titleFa: "آدرس شوروم و گالری حضوری",
      titleEn: "Physical Showroom",
      titleAr: "عنوان صالة العرض",
      value: CONTACT_CONFIG.isVerified && CONTACT_CONFIG.addressFa
        ? (language === "fa" ? CONTACT_CONFIG.addressFa : language === "ar" ? CONTACT_CONFIG.addressAr : CONTACT_CONFIG.addressEn)
        : (language === "fa" ? pendingFa : language === "ar" ? pendingAr : pendingEn),
      subFa: CONTACT_CONFIG.isVerified
        ? "مراجعه حضوری به شوروم رسمی مجموعه"
        : "نشانی و ساعات کاری دقیق شوروم در حال به‌روزرسانی است",
      subEn: CONTACT_CONFIG.isVerified ? "Official Tehran Showroom" : "Showroom address & hours are being updated",
      href: "/stores",
      isLtr: false,
      ctaFa: "مشاهده اطلاعات شوروم",
      ctaEn: "View Showroom",
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
              ? 'برای ثبت سفارش، دریافت مشاوره درباره سنگ‌های قرآنی و عقیق، یا پیگیری سفارشات می‌توانید از راه‌های ارتباطی زیر یا فرم تماس سایت استفاده نمایید.'
              : 'Reach out via our official channels or contact form for custom orders, gemstone guidance, and client support.'}
          </p>
        </MotionFadeIn>

        {/* 4 Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactChannels.map((c, idx) => {
            const isExternalOrTel = c.href.startsWith("http") || c.href.startsWith("tel:");
            const cardBody = (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">
                      {language === 'fa' ? c.titleFa : language === 'ar' ? c.titleAr : c.titleEn}
                    </span>
                    <div className="p-2 rounded-xl bg-[#FAF9F5] group-hover:scale-110 transition-transform">
                      {c.icon}
                    </div>
                  </div>

                  <p
                    dir={c.isLtr ? "ltr" : undefined}
                    className={`font-mono font-bold text-zinc-950 group-hover:text-[#C4852B] transition-colors mb-1.5 ${
                      c.isLtr ? "text-sm sm:text-base text-end rtl:text-right" : "text-xs sm:text-sm leading-relaxed text-start"
                    }`}
                  >
                    {c.value}
                  </p>

                  <p className="text-[11px] text-[#626667] leading-relaxed">
                    {language === 'fa' ? c.subFa : c.subEn}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-[#660000] font-bold">
                  <span>{language === 'fa' ? c.ctaFa : c.ctaEn}</span>
                  <span className="transform group-hover:-translate-x-1 transition-transform">{language === 'en' ? '→' : '←'}</span>
                </div>
              </>
            );

            const cardClass =
              "h-full flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 hover:border-[#C4852B] transition-all duration-300 shadow-sm luxury-card-hover group";

            return (
              <TiltCard key={idx} className="h-full">
                {isExternalOrTel ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={cardClass}
                  >
                    {cardBody}
                  </a>
                ) : (
                  <Link href={c.href} className={cardClass}>
                    {cardBody}
                  </Link>
                )}
              </TiltCard>
            );
          })}
        </div>

        {/* Quick Message CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1A1816] via-[#2A1F18] to-[#1A1816] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#C4852B]/40">
          <div className="flex flex-col gap-2 text-center md:text-start">
            <span className="text-[10px] font-mono text-[#C4852B] uppercase tracking-widest font-bold">
              {language === 'fa' ? 'ساعات پاسخگویی و مشاوره' : 'SUPPORT HOURS'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              {CONTACT_CONFIG.isVerified && CONTACT_CONFIG.workingHoursFa
                ? (language === 'fa' ? CONTACT_CONFIG.workingHoursFa : language === 'ar' ? CONTACT_CONFIG.workingHoursAr : CONTACT_CONFIG.workingHoursEn)
                : (language === 'fa' ? 'ساعات کاری رسمی مجموعه به‌زودی درج می‌شود' : 'Official working hours will be published shortly')}
            </h3>
            <p className="text-xs text-zinc-300">
              {language === 'fa' 
                ? 'پاسخگویی به پیام‌ها و درخواست‌های مشتریان از طریق فرم تماس سایت فعال است.' 
                : 'Send us your inquiry directly through our website contact form.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {CONTACT_CONFIG.telegramHref && (
              <a
                href={CONTACT_CONFIG.telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#660000] hover:bg-[#7D0000] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                {language === 'fa' ? 'تلگرام رسمی مجموعه' : 'Official Telegram'}
              </a>
            )}
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#C4852B] hover:bg-[#A76E1F] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer whitespace-nowrap shadow-lg"
            >
              {language === 'fa' ? 'ارسال پیام در سایت' : 'Send Message'}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
