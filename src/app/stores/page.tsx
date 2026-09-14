"use client";

import { useAppStore } from "@/store/useAppStore";
import { StorePinIcon, PhoneCallLuxuryIcon, ClockTimeIcon } from "@/components/icons/JewelryIcons";

export default function StoresPage() {
  const { language } = useAppStore();

  const branches = [
    {
      cityFa: "تهران - شعبه مرکزی VIP",
      cityEn: "Tehran - Central VIP Lounge",
      cityAr: "طهران - الفرع الرئيسي VIP",
      addressFa: "خیابان فرشته، برج رز، طبقه همکف، پلاک ۱۲",
      addressEn: "Fereshteh St, Rose Tower, Ground Floor, Suite 12",
      addressAr: "شارع فرشته، برج روز، الطابق الأرضي، جناح 12",
      phone: "+98 (21) 2200-8800",
      hoursFa: "همه‌روزه از ۱۰:۳۰ الی ۲۱:۰۰",
      hoursEn: "Daily: 10:30 AM - 9:00 PM",
      hoursAr: "يومياً من 10:30 صباحاً حتى 9:00 مساءً"
    },
    {
      cityFa: "تهران - شعبه نیاوران",
      cityEn: "Tehran - Niavaran Gallery",
      cityAr: "طهران - معرض نياوران",
      addressFa: "خیابان باهنر، مجتمع تجاری اطلس، پلاک ۴۰۵",
      addressEn: "Bahanar St, Atlas Commercial Center, Suite 405",
      addressAr: "شارع باهنر، مركز أطلس التجاري، جناح 405",
      phone: "+98 (21) 2611-4400",
      hoursFa: "همه‌روزه از ۱۱:۰۰ الی ۲۱:۳۰",
      hoursEn: "Daily: 11:00 AM - 9:30 PM",
      hoursAr: "يومياً من 11:00 صباحاً حتى 9:30 مساءً"
    }
  ];

  return (
    <div className="py-20 md:py-32 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'شعب و گالری‌های اختصاصی' : language === 'ar' ? 'فروع ومعارض البوتيك' : 'FLAGSHIP BOUTIQUES'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight mb-6">
            {language === 'fa' ? 'شعب زیورآلات نفیسه عبادی' : language === 'ar' ? 'صالات عرض مجوهرات نفيسة عبادي' : 'Boutique Locations'}
          </h1>
          <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
            {language === 'fa'
              ? 'جهت مشاوره اختصاصی، رزرو وقت قبلی و مشاهده مستقیم مجموعه‌های نقره دست‌ساز و سنگ‌های اصیل به گالری‌های ما مراجعه فرمایید.'
              : language === 'ar'
              ? 'تفضلوا بزيارة معارضنا البوتيكية للاستشارات الخاصة ومشاهدة مجموعات الفضة الإسترلينية 925 والأحجار الطبيعية مباشرة.'
              : 'Visit our flagship boutiques for private consultations and private viewing of handcrafted 925 silver creations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {branches.map((b, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-3xl bg-white border border-[#C4852B]/30 flex flex-col justify-between shadow-sm luxury-card-hover"
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
                  <h3 className="font-bold text-xl text-zinc-950">
                    {language === 'fa' ? b.cityFa : language === 'ar' ? b.cityAr : b.cityEn}
                  </h3>
                  <span className="text-[9px] font-mono text-[#660000] bg-[#660000]/10 px-3 py-1 rounded-full uppercase font-bold">
                    VIP GALLERY
                  </span>
                </div>

                <div className="space-y-4 text-xs text-[#626667]">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 flex items-center justify-center rounded-lg bg-[#C4852B]/10 text-[#C4852B] shrink-0">
                      <StorePinIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="pt-0.5">{language === 'fa' ? b.addressFa : language === 'ar' ? b.addressAr : b.addressEn}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center rounded-lg bg-[#C4852B]/10 text-[#C4852B] shrink-0">
                      <PhoneCallLuxuryIcon className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-mono text-zinc-950 font-semibold">{b.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 flex items-center justify-center rounded-lg bg-[#C4852B]/10 text-[#C4852B] shrink-0">
                      <ClockTimeIcon className="w-3.5 h-3.5" />
                    </span>
                    <span>{language === 'fa' ? b.hoursFa : language === 'ar' ? b.hoursAr : b.hoursEn}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-200">
                <a 
                  href={`tel:${b.phone}`}
                  className="inline-block px-6 py-2.5 bg-[#660000] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#7D0000] transition-colors cursor-pointer"
                >
                  {language === 'fa' ? 'تماس با شعبه' : language === 'ar' ? 'الاتصال بالفرع' : 'Call Boutique'}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
