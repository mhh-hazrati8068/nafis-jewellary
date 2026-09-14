"use client";

import { useEffect } from "react";
import Link from "next/link";
import BrandLogo from "@/components/layout/BrandLogo";
import { FleurDeLisLuxuryIcon } from "@/components/icons/JewelryIcons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF9F5] text-zinc-950 px-6 py-24">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="mb-6">
          <BrandLogo variant="gold" size="md" showSubline={false} />
        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#660000]/10 text-[#660000] flex items-center justify-center mb-4">
          <FleurDeLisLuxuryIcon className="w-8 h-8" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold uppercase mb-3 text-zinc-950">
          خطایی رخ داده است / Something went wrong
        </h2>

        <p className="text-xs text-[#626667] leading-relaxed mb-8 max-w-sm">
          مشکلی در بارگذاری بخش مورد نظر به وجود آمده است. لطفاً مجدداً تلاش نمایید.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3.5 bg-[#660000] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg hover:bg-[#7D0000] transition-all cursor-pointer"
          >
            تلاش مجدد / Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3.5 border border-zinc-300 bg-white text-zinc-800 font-bold text-xs uppercase rounded-full hover:border-[#C4852B] transition-all cursor-pointer inline-block"
          >
            صفحه اصلی / Home
          </Link>
        </div>
      </div>
    </div>
  );
}
