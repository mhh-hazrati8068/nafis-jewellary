"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { StorePinIcon, PhoneCallLuxuryIcon, ClockTimeIcon } from "@/components/icons/JewelryIcons";
import { CONTACT_CONFIG } from "@/lib/contactConfig";

export default function StoresPage() {
  const { language } = useAppStore();

  const pendingFa = "اطلاعات رسمی شوروم در حال به‌روزرسانی است و به‌زودی منتشر خواهد شد.";
  const pendingEn = "Official showroom address, phone, and working hours are being updated.";
  const pendingAr = "جارٍ تحديث بيانات صالة العرض الرسمية وسيتم نشرها قريباً.";

  return (
    <div className="py-20 md:py-32 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'شوروم و گالری اختصاصی' : language === 'ar' ? 'صالة العرض الرسمية' : 'OFFICIAL SHOWROOM'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight mb-6">
            {language === 'fa' ? 'شوروم زیورآلات نفیسه عبادی' : language === 'ar' ? 'معرض مجوهرات نفيسة عبادي' : 'Nafise Ebadi Showroom'}
          </h1>
          <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
            {language === 'fa'
              ? 'جهت مشاهده حضوری آثار نقره و سنگ‌های قرآنی و دریافت مشاوره تخصصی، اطلاعات رسمی شوروم و ساعات کاری مجموعه در این صفحه اطلاع‌رسانی می‌شود.'
              : language === 'ar'
              ? 'تُعرض هنا بيانات صالة العرض الرسمية وساعات العمل لمتابعة منتجات الفضة والأحجار القرآنية.'
              : 'Official showroom address, direct phone line, and visiting hours are maintained here.'}
          </p>
        </div>

        <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-white border border-[#C4852B]/30 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
            <h2 className="font-bold text-xl text-zinc-950">
              {language === 'fa' ? 'اطلاعات شوروم مرکزی' : language === 'ar' ? 'صالة العرض الرئيسية' : 'Central Showroom'}
            </h2>
            <span className="text-[9px] font-mono text-[#660000] bg-[#660000]/10 px-3 py-1 rounded-full uppercase font-bold">
              OFFICIAL
            </span>
          </div>

          <div className="space-y-4 text-xs text-[#626667]">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#C4852B]/10 text-[#C4852B] shrink-0">
                <StorePinIcon className="w-3.5 h-3.5" />
              </span>
              <span className="pt-1">
                {CONTACT_CONFIG.isVerified && CONTACT_CONFIG.addressFa
                  ? (language === 'fa' ? CONTACT_CONFIG.addressFa : language === 'ar' ? CONTACT_CONFIG.addressAr : CONTACT_CONFIG.addressEn)
                  : (language === 'fa' ? pendingFa : language === 'ar' ? pendingAr : pendingEn)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#C4852B]/10 text-[#C4852B] shrink-0">
                <PhoneCallLuxuryIcon className="w-3.5 h-3.5" />
              </span>
              {CONTACT_CONFIG.isVerified && (CONTACT_CONFIG.landlineDisplay || CONTACT_CONFIG.mobileDisplay) ? (
                <div className="flex flex-wrap items-center gap-2 font-mono text-zinc-950 font-semibold">
                  {CONTACT_CONFIG.landlineDisplay && (
                    <a href={CONTACT_CONFIG.landlineHref} dir="ltr" className="hover:text-[#C4852B] transition-colors">
                      {CONTACT_CONFIG.landlineDisplay}
                    </a>
                  )}
                  {CONTACT_CONFIG.landlineDisplay && CONTACT_CONFIG.mobileDisplay && (
                    <span className="text-zinc-400">|</span>
                  )}
                  {CONTACT_CONFIG.mobileDisplay && (
                    <a href={CONTACT_CONFIG.mobileHref} dir="ltr" className="hover:text-[#C4852B] transition-colors">
                      {CONTACT_CONFIG.mobileDisplay}
                    </a>
                  )}
                </div>
              ) : (
                <span className="font-mono text-zinc-950 font-semibold">
                  {language === 'fa' ? "شماره تماس رسمی به‌زودی درج می‌شود" : "Phone number pending update"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#C4852B]/10 text-[#C4852B] shrink-0">
                <ClockTimeIcon className="w-3.5 h-3.5" />
              </span>
              <span>
                {CONTACT_CONFIG.isVerified && CONTACT_CONFIG.workingHoursFa
                  ? (language === 'fa' ? CONTACT_CONFIG.workingHoursFa : language === 'ar' ? CONTACT_CONFIG.workingHoursAr : CONTACT_CONFIG.workingHoursEn)
                  : (language === 'fa' ? "ساعات کاری رسمی به‌زودی درج می‌شود" : "Working hours pending update")}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-200 flex flex-wrap gap-3">
            {CONTACT_CONFIG.isVerified && CONTACT_CONFIG.landlineHref ? (
              <a
                href={CONTACT_CONFIG.landlineHref}
                className="inline-block px-6 py-2.5 bg-[#660000] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#7D0000] transition-colors cursor-pointer"
              >
                {language === 'fa' ? 'تماس با شوروم' : language === 'ar' ? 'الاتصال بالمعرض' : 'Call Showroom'}
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-block px-6 py-2.5 bg-[#660000] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#7D0000] transition-colors cursor-pointer"
              >
                {language === 'fa' ? 'ارسال پیام به مجموعه' : language === 'ar' ? 'إرسال رسالة' : 'Contact Us'}
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
