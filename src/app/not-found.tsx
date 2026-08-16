"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";

export default function NotFound() {
  const { language } = useAppStore();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="flex flex-col items-center max-w-md">
        <span className="font-mono text-7xl font-light text-[#C4852B] mb-4">404</span>
        <h1 className="text-2xl md:text-3xl font-bold uppercase mb-4 tracking-tight">
          {language === 'fa' ? 'صفحه مورد نظر یافت نشد' : 'Page Not Found'}
        </h1>
        <div className="w-16 h-0.5 bg-[#660000] mb-6"></div>
        <p className="text-xs text-[#626667] mb-8 leading-relaxed">
          {language === 'fa' 
            ? 'صفحه‌ای که به دنبال آن بودید تغییر کرده یا موجود نمی‌باشد. لطفاً به صفحه اصلی یا کالکشن‌ها بازگردید.' 
            : 'The page you are looking for has been moved or does not exist. Please return to the homepage or collections.'}
        </p>
        <Link 
          href="/" 
          className="px-8 py-3.5 bg-[#660000] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#7D0000] transition-colors shadow-lg cursor-pointer"
        >
          {language === 'fa' ? 'بازگشت به صفحه اصلی' : 'Return to Homepage'}
        </Link>
      </div>
    </div>
  );
}
