"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { PhoneCallLuxuryIcon, ClockTimeIcon } from "@/components/icons/JewelryIcons";
import { MotionFadeIn } from "@/components/ui/MotionWrappers";
import { CONTACT_CONFIG } from "@/lib/contactConfig";

export default function ContactShowcase() {
  const { language } = useAppStore();

  const pendingLabel = language === "fa" ? "در حال به‌روزرسانی" : language === "ar" ? "جارٍ التحديث" : "Updating";

  const contacts = [
    {
      titleFa: "تلفن ثابت دفتر مرکزی",
      titleEn: "Central Office Phone",
      number: CONTACT_CONFIG.isVerified && CONTACT_CONFIG.landlineDisplay ? CONTACT_CONFIG.landlineDisplay : pendingLabel,
      rawNumber: CONTACT_CONFIG.isVerified && CONTACT_CONFIG.landlineHref ? CONTACT_CONFIG.landlineHref : "/contact",
      descFa: "تماس مستقیم با دفتر مرکزی برای پیگیری سفارش‌ها و مشاوره خرید",
      badge: "تلفن ثابت",
      icon: <PhoneCallLuxuryIcon className="w-5 h-5 text-[#C4852B]" />
    },
    {
      titleFa: CONTACT_CONFIG.whatsappDisplay ? "شماره واتساپ و مشاوره" : "شماره تماس مستقیم",
      titleEn: CONTACT_CONFIG.whatsappDisplay ? "WhatsApp Consultation" : "Direct Contact Line",
      number: CONTACT_CONFIG.isVerified && (CONTACT_CONFIG.whatsappDisplay || CONTACT_CONFIG.mobileDisplay)
        ? (CONTACT_CONFIG.whatsappDisplay || CONTACT_CONFIG.mobileDisplay)
        : pendingLabel,
      rawNumber: CONTACT_CONFIG.isVerified && (CONTACT_CONFIG.whatsappHref || CONTACT_CONFIG.mobileHref)
        ? (CONTACT_CONFIG.whatsappHref || CONTACT_CONFIG.mobileHref)
        : "/contact",
      descFa: "مشاوره تخصصی درباره سنگ‌های قرآنی عماد، عقیق، دُرّ نجف و نقره ۹۲۵",
      badge: "مشاوره تخصصی",
      icon: <PhoneCallLuxuryIcon className="w-5 h-5 text-[#C4852B]" />
    },
    {
      titleFa: "تلگرام و پیام‌رسان‌های رسمی",
      titleEn: "Telegram & Messengers",
      number: CONTACT_CONFIG.telegramHandle || pendingLabel,
      rawNumber: CONTACT_CONFIG.telegramHref || "/contact",
      descFa: `تلگرام: ${CONTACT_CONFIG.telegramHandle} | ایتا و بله: ${CONTACT_CONFIG.eitaaHandle}`,
      badge: "پیام‌رسان رسمی",
      icon: <PhoneCallLuxuryIcon className="w-5 h-5 text-[#660000]" />
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FAF9F5] border-t border-[#C4852B]/30 relative overflow-hidden transition-colors">
      <div className="container mx-auto px-4 md:px-12">
        <MotionFadeIn direction="up" className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.35em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'ارتباط مستقیم و پشتیبانی اختصاصی' : 'CONTACT & PRIVATE ADVISORY'}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">
            {language === 'fa' ? 'تماس با ما' : 'Get In Touch'}
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-5"></div>
          <p className="text-xs sm:text-sm text-[#626667] leading-relaxed max-w-2xl mx-auto">
            {language === 'fa'
              ? 'از طریق شماره‌های تماس رسمی، شبکه‌های اجتماعی مجموعه یا فرم صفحه تماس با ما در ارتباط باشید.'
              : 'Reach our specialists directly by phone, official social channels, or through our contact form.'}
          </p>
        </MotionFadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {contacts.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 hover:border-[#C4852B] transition-all duration-300 shadow-xs flex flex-col justify-between group luxury-card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-100">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF9F5] border border-[#C4852B]/20 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#660000] bg-[#660000]/10 px-2.5 py-1 rounded-full uppercase">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-zinc-950 mb-2 group-hover:text-[#C4852B] transition-colors">
                  {language === 'fa' ? item.titleFa : item.titleEn}
                </h3>
                <p className="text-xs text-[#626667] leading-relaxed mb-6">
                  {item.descFa}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                <span className="text-sm sm:text-base font-mono font-bold text-zinc-950" dir="ltr">
                  {item.number}
                </span>
                {item.rawNumber.startsWith("http") || item.rawNumber.startsWith("tel:") ? (
                  <a
                    href={item.rawNumber}
                    target={item.rawNumber.startsWith("http") ? "_blank" : undefined}
                    rel={item.rawNumber.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="px-4 py-2 bg-[#660000] hover:bg-[#800000] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                  >
                    {item.rawNumber.startsWith("http") ? "مشاهده کانال" : "تماس تلفنی"}
                  </a>
                ) : (
                  <Link
                    href={item.rawNumber}
                    className="px-4 py-2 bg-[#660000] hover:bg-[#800000] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                  >
                    ارسال پیام
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white border border-[#C4852B]/30 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C4852B]/10 flex items-center justify-center shrink-0 text-[#C4852B]">
              <ClockTimeIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-zinc-950 mb-1">
                ساعات پاسخگویی و پذیرش حضوری
              </h4>
              <p className="text-xs text-[#626667]">
                {CONTACT_CONFIG.isVerified && CONTACT_CONFIG.workingHoursFa
                  ? CONTACT_CONFIG.workingHoursFa
                  : "ساعات کاری و نشانی دقیق شوروم در حال به‌روزرسانی است."}
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="px-6 py-2.5 rounded-xl bg-[#660000] text-white hover:bg-[#800000] transition-all text-xs font-bold"
          >
            صفحه تماس با ما
          </Link>
        </div>
      </div>
    </section>
  );
}
