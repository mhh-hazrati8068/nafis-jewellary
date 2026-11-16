"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import { CONTACT_CONFIG } from "@/lib/contactConfig";

export default function ContactPage() {
  const { language } = useAppStore();
  const [submitted, setSubmitted] = useState(false);

  const pendingFa = "اطلاعات رسمی در حال به‌روزرسانی است";
  const pendingEn = "Official contact details are being updated";
  const pendingAr = "جارٍ تحديث بيانات التواصل الرسمية";
  const pendingText = language === "fa" ? pendingFa : language === "ar" ? pendingAr : pendingEn;

  return (
    <div className="py-20 md:py-32 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'ارتباط با برند نفیسه عبادی' : language === 'ar' ? 'خدمة العملاء والاستفسارات' : 'CONCIERGE & SUPPORT'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight mb-6">
            {language === 'fa' ? 'تماس با ما' : language === 'ar' ? 'اتصل بنا' : 'Contact Concierge'}
          </h1>
          <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
            {language === 'fa'
              ? 'تیم امور مشتریان و مشاوره تخصصی زیورآلات نفیسه عبادی پاسخگوی پرسش‌ها و سفارش‌های اختصاصی شماست.'
              : language === 'ar'
              ? 'فريق استشارات مجوهرات نفيسة عبادي في خدمتكم للإجابة على جميع الاستفسارات والطلبات الخاصة.'
              : 'Our client concierge is at your service for inquiries, bespoke jewelry commissions, and order assistance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F4F1EA] border border-[#C4852B]/30 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold uppercase mb-8 pb-4 border-b border-zinc-200">
              {language === 'fa' ? 'اطلاعات تماس و شوروم' : language === 'ar' ? 'بيانات التواصل وصالة العرض' : 'Official Contact & Showroom'}
            </h2>

            <div className="space-y-6 text-xs text-[#626667]">
              <div>
                <span className="text-[10px] text-[#C4852B] uppercase tracking-widest block font-mono mb-1 font-bold">
                  SHOWROOM ADDRESS
                </span>
                <p className="font-semibold text-zinc-950 text-sm">
                  {CONTACT_CONFIG.isVerified && CONTACT_CONFIG.addressFa
                    ? (language === 'fa' ? CONTACT_CONFIG.addressFa : language === 'ar' ? CONTACT_CONFIG.addressAr : CONTACT_CONFIG.addressEn)
                    : pendingText}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-[#C4852B] uppercase tracking-widest block font-mono mb-1 font-bold">
                  PHONE & DIRECT CONTACT
                </span>
                {CONTACT_CONFIG.isVerified && (CONTACT_CONFIG.landlineDisplay || CONTACT_CONFIG.mobileDisplay) ? (
                  <div className="flex flex-wrap items-center gap-3 font-mono text-zinc-950 font-bold text-sm">
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
                  <p className="font-mono text-zinc-950 font-bold text-sm">{pendingText}</p>
                )}
              </div>

              <div>
                <span className="text-[10px] text-[#C4852B] uppercase tracking-widest block font-mono mb-1 font-bold">
                  SOCIAL & MESSENGERS
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a href={CONTACT_CONFIG.instagramHref} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#C4852B] text-zinc-900 font-semibold transition-colors">
                    اینستاگرام
                  </a>
                  <a href={CONTACT_CONFIG.telegramHref} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#C4852B] text-zinc-900 font-semibold transition-colors">
                    تلگرام ({CONTACT_CONFIG.telegramHandle})
                  </a>
                  <a href={CONTACT_CONFIG.eitaaHref} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#C4852B] text-zinc-900 font-semibold transition-colors">
                    ایتا ({CONTACT_CONFIG.eitaaHandle})
                  </a>
                  <a href={CONTACT_CONFIG.baleHref} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#C4852B] text-zinc-900 font-semibold transition-colors">
                    بله ({CONTACT_CONFIG.baleHandle})
                  </a>
                  <a href={CONTACT_CONFIG.rubikaHref} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#C4852B] text-zinc-900 font-semibold transition-colors">
                    روبیکا
                  </a>
                  <a href={CONTACT_CONFIG.soroushHref} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#C4852B] text-zinc-900 font-semibold transition-colors">
                    سروش
                  </a>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#C4852B] uppercase tracking-widest block font-mono mb-1 font-bold">
                  PARTNER & WORKING HOURS
                </span>
                <p className="text-zinc-950 text-sm mb-2">
                  {CONTACT_CONFIG.isVerified && CONTACT_CONFIG.workingHoursFa
                    ? (language === 'fa' ? CONTACT_CONFIG.workingHoursFa : language === 'ar' ? CONTACT_CONFIG.workingHoursAr : CONTACT_CONFIG.workingHoursEn)
                    : (language === 'fa' ? 'ساعات کاری رسمی به‌زودی اعلام می‌شود' : language === 'ar' ? 'سيتم الإعلان عن ساعات العمل قريباً' : 'Official working hours will be announced shortly')}
                </p>
                <a
                  href={CONTACT_CONFIG.emadWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#660000] hover:text-[#C4852B] transition-colors"
                >
                  <span>وب‌سایت شرکت عماد آسمان (emadaseman.ir)</span>
                  <span>←</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 text-zinc-950">
              {language === 'fa' ? 'ارسال پیام به مشاوران' : language === 'ar' ? 'إرسال رسالة للمستشارين' : 'Send a Message'}
            </h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#C4852B]/10 border border-[#C4852B] text-center text-xs text-[#C4852B] font-semibold">
                ✓ {language === 'fa' ? 'پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس خواهیم گرفت.' : language === 'ar' ? 'تم استلام رسالتكم بنجاح. سيتواصل معكم فريقنا قريباً.' : 'Your message has been received. Our team will contact you shortly.'}
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-4 text-xs">
                <input 
                  type="text" 
                  required
                  placeholder={language === 'fa' ? 'نام و نام خانوادگی' : language === 'ar' ? 'الاسم الكامل' : 'Full Name'} 
                  className="w-full border border-zinc-300 bg-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C4852B]"
                />
                <input 
                  type="email" 
                  required
                  placeholder={language === 'fa' ? 'آدرس ایمیل' : language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} 
                  className="w-full border border-zinc-300 bg-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C4852B]"
                />
                <textarea 
                  rows={4} 
                  required
                  placeholder={language === 'fa' ? 'متن پیام یا سفارش اختصاصی' : language === 'ar' ? 'نص الرسالة أو الطلب الخاص' : 'Your message or bespoke inquiry'}
                  className="w-full border border-zinc-300 bg-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C4852B]"
                ></textarea>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-[#660000] text-white font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#7D0000] transition-colors shadow-md mt-2 cursor-pointer"
                >
                  {language === 'fa' ? 'ارسال پیام' : language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
