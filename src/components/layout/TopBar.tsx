"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import GoldCalculatorModal from "@/components/calculator/GoldCalculatorModal";

export default function TopBar() {
  const { goldPricePerGram, t, language } = useAppStore();
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  return (
    <>
      <div className="bg-[#FAF9F5] dark:bg-[#F4F1EA] text-[#1A1816] py-2.5 px-4 text-[11px] font-medium tracking-[0.18em] uppercase border-b border-[#C4852B]/25 transition-colors duration-300">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group cursor-pointer"
            title={language === 'fa' ? 'برای محاسبه وزن و قیمت کلیک کنید' : 'Click to open Gold & Gemstone Calculator'}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[#C4852B] animate-pulse"></span>
            <span className="text-zinc-600 font-sans">{t.topBar.goldRate}</span>
            <span className="font-mono text-[#C4852B] font-bold underline decoration-[#C4852B]/40 underline-offset-4">
              ${goldPricePerGram.toFixed(2)} {t.topBar.perGram}
            </span>
            <span className="hidden md:inline-block text-[9px] text-[#660000] bg-[#660000]/10 px-2 py-0.5 rounded-full font-mono font-bold">
              {language === 'fa' ? 'محاسبه‌گر آنلاین ⚖️' : 'Calculator ⚖️'}
            </span>
          </button>
          
          <div className="hidden sm:flex items-center gap-6 text-zinc-600 text-[10px] tracking-[0.2em]">
            <span>{t.topBar.shipping}</span>
            <span className="text-[#660000] font-bold">•</span>
            <span>{t.topBar.guarantee}</span>
          </div>
        </div>
      </div>

      <GoldCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </>
  );
}


