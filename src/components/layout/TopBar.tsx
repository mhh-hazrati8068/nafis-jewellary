"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import SilverCalculatorModal from "@/components/calculator/SilverCalculatorModal";

export default function TopBar() {
  const { silverPricePerGramToman, t } = useAppStore();
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  return (
    <>
      <div className="bg-[#FAF9F5] dark:bg-[#F4F1EA] text-[#1A1816] py-2.5 px-4 text-[11px] font-medium ltr:tracking-[0.15em] border-b border-[#C4852B]/25 transition-colors duration-300">
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={() => setIsCalcOpen(true)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group cursor-pointer"
            title={t.topBar.calculatorTooltip}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[#C4852B] animate-pulse"></span>
            <span className="text-zinc-600 font-sans">
              {t.topBar.silverRate}
            </span>
            <span className="font-mono text-[#C4852B] font-bold underline decoration-[#C4852B]/40 underline-offset-4">
              {Number(silverPricePerGramToman).toLocaleString()}
            </span>
            <span className="text-[#C4852B] font-semibold text-[10px]">
              {t.topBar.perGram}
            </span>
            <span className="hidden md:inline-block text-[9px] text-[#660000] bg-[#660000]/10 px-2 py-0.5 rounded-full font-bold">
              {t.topBar.calculator}
            </span>
          </button>
          
          <div className="hidden sm:flex items-center gap-6 text-zinc-600 text-[10px] ltr:tracking-[0.15em]">
            <span>{t.topBar.shipping}</span>
            <span className="text-[#660000] font-bold">•</span>
            <span>{t.topBar.guarantee}</span>
          </div>
        </div>
      </div>

      <SilverCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </>
  );
}
