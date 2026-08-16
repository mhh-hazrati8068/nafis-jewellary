"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

export default function StoresPage() {
  const { language } = useAppStore();
  const [submitted, setSubmitted] = useState(false);

  const branches = [
    {
      cityFa: "تهران - شعبه مرکزی VIP",
      cityEn: "Tehran - Central VIP Lounge",
      addressFa: "خیابان فرشته، برج رز، طبقه همکف، پلاک ۱۲",
      addressEn: "Fereshteh St, Rose Tower, Ground Floor, Suite 12",
      phone: "+98 (21) 2200-8800",
      hoursFa: "همه‌روزه از ۱۰:۳۰ الی ۲۱:۰۰",
      hoursEn: "Daily: 10:30 AM - 9:00 PM"
    },
    {
      cityFa: "تهران - شعبه نیاوران",
      cityEn: "Tehran - Niavaran Gallery",
      addressFa: "خیابان باهنر، مجتمع تجاری اطلس، پلاک ۴۰۵",
      addressEn: "Bahanar St, Atlas Commercial Center, Suite 405",
      phone: "+98 (21) 2611-4400",
      hoursFa: "همه‌روزه از ۱۱:۰۰ الی ۲۱:۳۰",
      hoursEn: "Daily: 11:00 AM - 9:30 PM"
    }
  ];

  return (
    <div className="py-20 md:py-32 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'شعب و گالری‌های اختصاصی' : 'FLAGSHIP BOUTIQUES'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight mb-6">
            {language === 'fa' ? 'شعب زیورآلات نفیسه عبادی' : 'Boutique Locations'}
          </h1>
          <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
            {language === 'fa'
              ? 'جهت مشاوره اختصاصی، رزرو وقت قبلی و مشاهده مستقیم مجموعه‌های طلا و جواهرات به گالری‌های ما مراجعه فرمایید.'
              : 'Visit our flagship boutiques for private consultations and private viewing of 18K gold creations.'}
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
                    {language === 'fa' ? b.cityFa : b.cityEn}
                  </h3>
                  <span className="text-[9px] font-mono text-[#660000] bg-[#660000]/10 px-3 py-1 rounded-full uppercase font-bold">
                    VIP GALLERY
                  </span>
                </div>

                <div className="space-y-4 text-xs text-[#626667]">
                  <div className="flex items-start gap-3">
                    <span className="text-[#C4852B]">📍</span>
                    <span>{language === 'fa' ? b.addressFa : b.addressEn}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#C4852B]">📞</span>
                    <span className="font-mono text-zinc-950 font-semibold">{b.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-200">
                <a 
                  href={`tel:${b.phone}`}
                  className="inline-block px-6 py-2.5 bg-[#660000] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#7D0000] transition-colors cursor-pointer"
                >
                  {language === 'fa' ? 'تماس با شعبه' : 'Call Boutique'}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
