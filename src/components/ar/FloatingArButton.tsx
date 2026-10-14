"use client";

import { useAppStore } from "@/store/useAppStore";
import { SparkleStarIcon, RingIcon } from "@/components/icons/JewelryIcons";

export default function FloatingArButton() {
  const { openArModal } = useAppStore();

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={() => openArModal()}
        className="group flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-[#660000] via-[#8B1818] to-[#660000] text-white shadow-[0_8px_25px_rgba(102,0,0,0.5)] border border-[#C4852B]/60 hover:scale-106 hover:shadow-[0_12px_30px_rgba(196,133,43,0.4)] transition-all duration-300 cursor-pointer"
        aria-label="پرو مجازی AR با هوش مصنوعی"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A84B] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E5A84B]"></span>
        </span>

        <RingIcon className="w-4 h-4 text-[#E5A84B] group-hover:rotate-12 transition-transform" />

        <div className="flex flex-col items-start text-start leading-none">
          <span className="text-[11px] sm:text-xs font-bold tracking-tight">
            موتور سه‌بعدی و AR
          </span>
          <span className="text-[8px] font-mono text-[#E5A84B] uppercase tracking-wider pt-0.5">
            IMAGE TO 3D / AR
          </span>
        </div>
      </button>
    </div>
  );
}
