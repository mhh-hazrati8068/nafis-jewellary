"use client";

import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { useAppStore } from "@/store/useAppStore";
import { SparkleStarIcon } from "@/components/icons/JewelryIcons";

export default function NotFound() {
  const { language } = useAppStore();

  const title = language === "fa" 
    ? "صفحه مورد نظر یافت نشد" 
    : language === "ar" 
    ? "الصفحة المطلوبة غير موجودة" 
    : "Page Not Found";

  const description = language === "fa"
    ? "متأسفانه صفحه‌ای که به دنبال آن بودید منتقل شده یا وجود ندارد. می‌توانید به صفحه اصلی یا فروشگاه بازگردید."
    : language === "ar"
    ? "عذراً، الصفحة التي تبحث عنها قد تكون نُقلت أو لم تعد متوفرة. يمكنك العودة إلى الصفحة الرئيسية أو المتجر."
    : "The page you are looking for might have been moved or does not exist. Explore our signature handcrafted collections.";

  const homeBtn = language === "fa" ? "بازگشت به صفحه اصلی" : language === "ar" ? "العودة للرئيسية" : "Return to Atelier";
  const shopBtn = language === "fa" ? "مشاهده محصولات" : language === "ar" ? "تصفح المنتجات" : "Explore Collections";

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF9F5] text-zinc-950 px-6 py-24">
      <div className="max-w-lg w-full text-center flex flex-col items-center">
        <div className="mb-6 relative">
          <BrandLogo variant="gold" size="lg" showSubline={false} />
          <SparkleStarIcon className="w-5 h-5 absolute -top-3 -right-3 text-[#C4852B]" />
        </div>

        <span className="text-6xl sm:text-8xl font-brand-en font-bold text-[#C4852B] tracking-widest block mb-4">
          404
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold uppercase mb-4 text-zinc-950">
          {title}
        </h1>

        <p className="text-xs sm:text-sm text-[#626667] leading-relaxed mb-8 max-w-md">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#660000] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg hover:bg-[#7D0000] transition-all cursor-pointer"
          >
            {homeBtn}
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 border-2 border-[#C4852B] bg-white text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#C4852B] hover:text-white transition-all cursor-pointer"
          >
            {shopBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
