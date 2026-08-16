"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

export default function ContactPage() {
  const { language } = useAppStore();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-20 md:py-32 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'ارتباط با برند نفیسه عبادی' : 'CONCIERGE & SUPPORT'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight mb-6">
            {language === 'fa' ? 'تماس با ما' : 'Contact Concierge'}
          </h1>
          <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
            {language === 'fa'
              ? 'تیم امور مشتریان و مشاوره تخصصی زیورآلات نفیسه عبادی پاسخگوی تمامی پرسش‌ها و سفارش‌های اختصاصی شماست.'
              : 'Our client concierge is at your service for private inquiries, bespoke jewelry commissions, and order assistance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-[#F4F1EA] border border-[#C4852B]/30 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold uppercase mb-8 pb-4 border-b border-zinc-200">
              {language === 'fa' ? 'اطلاعات دفتر مرکزی' : 'Headquarters Concierge'}
            </h2>

            <div className="space-y-6 text-xs text-[#626667]">
              <div>
                <span className="text-[10px] text-[#C4852B] uppercase tracking-widest block font-mono mb-1 font-bold">
                  OFFICE & LOUNGE
                </span>
                <p className="font-semibold text-zinc-950 text-sm">
                  {language === 'fa' ? 'تهران، خیابان فرشته، برج رز، طبقه همکف، واحد ۱۲' : 'Tehran, Fereshteh St, Rose Tower, Suite 12'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-[#C4852B] uppercase tracking-widest block font-mono mb-1 font-bold">
                  PHONE SUPPORT
                </span>
                <p className="font-mono text-zinc-950 font-bold text-sm">
                  +98 (21) 2200-8800 / +98 (21) 2611-4400
                </p>
              </div>

              <div>
                <span className="text-[10px] text-[#C4852B] uppercase tracking-widest block font-mono mb-1 font-bold">
                  DIRECT EMAIL
                </span>
                <p className="font-mono text-zinc-950 text-sm">
                  concierge@nafis-jewellery.com
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-zinc-200 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold uppercase mb-6 text-zinc-950">
              {language === 'fa' ? 'ارسال پیام به مشاوران' : 'Send a Message'}
            </h2>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-[#C4852B]/10 border border-[#C4852B] text-center text-xs text-[#C4852B] font-semibold">
                ✓ {language === 'fa' ? 'پیام شما با موفقیت ارسال شد. به‌زودی با شما تماس خواهیم گرفت.' : 'Your message has been received. Our team will contact you shortly.'}
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-4 text-xs">
                <input 
                  type="text" 
                  required
                  placeholder={language === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'} 
                  className="w-full border border-zinc-300 bg-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C4852B]"
                />
                <input 
                  type="email" 
                  required
                  placeholder={language === 'fa' ? 'آدرس ایمیل' : 'Email Address'} 
                  className="w-full border border-zinc-300 bg-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C4852B]"
                />
                <textarea 
                  rows={4} 
                  required
                  placeholder={language === 'fa' ? 'متن پیام یا سفارش اختصاصی' : 'Your message or bespoke inquiry'}
                  className="w-full border border-zinc-300 bg-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-[#C4852B]"
                ></textarea>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-[#660000] text-white font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#7D0000] transition-colors shadow-md mt-2 cursor-pointer"
                >
                  {language === 'fa' ? 'ارسال پیام' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
