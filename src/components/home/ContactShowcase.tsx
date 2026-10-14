"use client";

import { useAppStore } from "@/store/useAppStore";
import { PhoneCallLuxuryIcon, ClockTimeIcon, StorePinIcon } from "@/components/icons/JewelryIcons";
import { MotionFadeIn } from "@/components/ui/MotionWrappers";

export default function ContactShowcase() {
  const { language } = useAppStore();

  const contacts = [
    {
      titleFa: "دفتر مرکزی و فروش آنلاین",
      titleEn: "Central Atelier & Orders",
      number: "۰۲۱-۲۲۰۰۸۸۰۰",
      rawNumber: "tel:02122008800",
      descFa: "پیگیری سفارشات، استعلام موجودی و هماهنگی ارسال",
      badge: "تلفن ثابت VIP",
      icon: <PhoneCallLuxuryIcon className="w-5 h-5 text-[#C4852B]" />
    },
    {
      titleFa: "خط مستقیم مشاوره و گالری",
      titleEn: "Gemology & Consultation",
      number: "۰۲۱-۲۶۱۱۴۴۰۰",
      rawNumber: "tel:02126114400",
      descFa: "مشاوره تخصصی گوهرشناسی، عقیق، دُرّ نجف و نقره ۹۲۵",
      badge: "مشاوره تخصصی",
      icon: <PhoneCallLuxuryIcon className="w-5 h-5 text-[#C4852B]" />
    },
    {
      titleFa: "پشتیبانی همراه و پیام‌رسان‌ها",
      titleEn: "Mobile Support & Messengers",
      number: "۰۹۱۲-۳۴۵۶۷۸۹",
      rawNumber: "tel:09123456789",
      descFa: "پشتیبانی فوری در ایتا، بله، روبیکا، تلگرام و واتساپ",
      badge: "پاسخگویی سریع",
      icon: <PhoneCallLuxuryIcon className="w-5 h-5 text-[#660000]" />
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FAF9F5] border-t border-[#C4852B]/30 relative overflow-hidden transition-colors">
      <div className="container mx-auto px-4 md:px-12">
        {/* Section Header */}
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
              ? 'مشاوران زرگری و پشتیبانی زیورآلات نفیسه عبادی همه‌روزه جهت مشاوره تخصصی، ثبت سفارشات اختصاصی و پاسخگویی تلفنی در خدمت شما هستند.'
              : 'Our master jewelry consultants are available daily for bespoke commissions, inquiries, and customer concierge.'}
          </p>
        </MotionFadeIn>

        {/* Contact Cards Grid */}
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

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <a 
                  href={item.rawNumber}
                  className="text-lg sm:text-xl font-mono font-bold text-zinc-950 group-hover:text-[#660000] transition-colors dir-ltr"
                >
                  {item.number}
                </a>
                <a 
                  href={item.rawNumber}
                  className="px-4 py-2 bg-[#660000] hover:bg-[#800000] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                >
                  تماس مستقیم
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Working Hours & In-Person Notice Banner */}
        <div className="rounded-3xl bg-white border border-[#C4852B]/30 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C4852B]/10 flex items-center justify-center shrink-0 text-[#C4852B]">
              <ClockTimeIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base text-zinc-950 mb-1">
                ساعات پاسخگویی تلفنی و پذیرش حضوری
              </h4>
              <p className="text-xs text-[#626667]">
                شنبه تا پنج‌شنبه از ساعت ۱۰:۰۰ الی ۲۱:۳۰ | جمعه‌ها و روزهای تعطیل: ۱۱:۰۰ الی ۲۰:۰۰
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <a 
              href="https://eitaa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white transition-all text-xs font-bold border border-orange-500/20"
            >
              پیام در ایتا
            </a>
            <a 
              href="https://ble.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-xs font-bold border border-emerald-500/20"
            >
              پیام در بله
            </a>
            <a 
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all text-xs font-bold border border-blue-500/20"
            >
              پیام در تلگرام
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
