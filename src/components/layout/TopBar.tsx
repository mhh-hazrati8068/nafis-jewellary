"use client";

import { useAppStore } from "@/store/useAppStore";
import { CONTACT_CONFIG } from "@/lib/contactConfig";

export default function TopBar() {
  const { silverPricePerGramToman, isSilverPriceStale, silverPriceError, t } = useAppStore();

  return (
    <div className="bg-white/35 text-zinc-900 py-1.5 px-3 sm:px-8 text-[11px] font-medium border-b border-zinc-200/50 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-2"
          title={isSilverPriceStale ? (silverPriceError || "هشدار: قیمت نقره به‌روز نیست") : undefined}
        >
          {isSilverPriceStale ? (
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          ) : (
            <span className="inline-block w-2 h-2 rounded-full bg-[#C4852B] animate-pulse"></span>
          )}
          <span className="text-zinc-700 font-medium">
            {t.topBar.silverRate}
          </span>
          <span className="font-mono text-[#C4852B] font-bold text-xs">
            {Number(silverPricePerGramToman).toLocaleString()}
          </span>
          <span className="text-zinc-500 font-medium text-[10px]">
            {t.topBar.perGram}
          </span>

          {isSilverPriceStale && (
            <span className="inline-flex items-center gap-1 text-[9px] text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
              <span>⚠️</span>
              <span>قیمت به‌روز نیست</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-5 text-zinc-600 text-[11px]">
          {CONTACT_CONFIG.isVerified && CONTACT_CONFIG.landlineDisplay && (
            <a
              href={CONTACT_CONFIG.landlineHref}
              dir="ltr"
              className="inline-flex items-center gap-1.5 font-mono font-bold text-zinc-800 hover:text-[#660000] transition-colors bg-white/60 px-2.5 py-0.5 rounded-full border border-zinc-200/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-3 h-3 text-[#C4852B]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              <span>{CONTACT_CONFIG.landlineDisplay}</span>
            </a>
          )}
          <span className="hidden lg:inline">{t.topBar.shipping}</span>
          <span className="hidden lg:inline text-[#C4852B] font-bold">•</span>
          <span className="hidden sm:inline">{t.topBar.guarantee}</span>
        </div>
      </div>
    </div>
  );
}
