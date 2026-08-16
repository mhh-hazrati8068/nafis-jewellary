"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoldCalculatorModal({ isOpen, onClose }: CalculatorProps) {
  const { language, goldPricePerGram } = useAppStore();
  const [weight, setWeight] = useState<number>(4.5);
  const [karat, setKarat] = useState<number>(18);
  const [makingFeePercent, setMakingFeePercent] = useState<number>(12);
  const [gemstoneCarats, setGemstoneCarats] = useState<number>(0.35);

  if (!isOpen) return null;

  // 18K (750) pure gold base multiplier
  const karatMultiplier = karat / 24;
  const rawGoldValue = weight * goldPricePerGram * (karat === 18 ? 0.75 : karatMultiplier);
  const makingCharge = (rawGoldValue * makingFeePercent) / 100;
  const gemstoneValue = gemstoneCarats * 320; // VVS diamond/agate valuation formula
  const totalEstimatedPrice = Math.round(rawGoldValue + makingCharge + gemstoneValue);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#FAF9F5] text-zinc-950 rounded-3xl shadow-2xl border border-[#C4852B]/40 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-zinc-200 flex items-center justify-between bg-[#F4F1EA]">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C4852B] font-bold block mb-1">
              {language === 'fa' ? 'محاسبه‌گر تخصصی بر اساس نرخ رسمی طلا' : 'OFFICIAL 18K GOLD VALUATION MATRIX'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight">
              {language === 'fa' ? 'محاسبه‌گر آنلاین وزن و عیار طلا' : 'Gold & Gemstone Price Calculator'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-[#660000] text-sm font-bold transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Controls */}
        <div className="p-6 sm:p-8 space-y-6 text-xs">
          
          {/* Weight Slider */}
          <div>
            <div className="flex justify-between items-center mb-2 font-mono">
              <span className="font-semibold text-zinc-700">
                {language === 'fa' ? 'وزن طلا (گرم):' : 'Gold Weight (Grams):'}
              </span>
              <span className="text-sm font-bold text-[#C4852B] bg-[#C4852B]/10 px-2.5 py-0.5 rounded">
                {weight} {language === 'fa' ? 'گرم' : 'g'}
              </span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="50" 
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full accent-[#C4852B] cursor-pointer"
            />
          </div>

          {/* Karat Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#626667] mb-1.5 font-bold">
                {language === 'fa' ? 'عیار استاندارد' : 'Gold Purity Standard'}
              </label>
              <select 
                value={karat}
                onChange={(e) => setKarat(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-semibold focus:outline-none focus:border-[#C4852B]"
              >
                <option value={18}>18K (750 Standard) — عیار رسمی</option>
                <option value={24}>24K (999 Pure) — شمش طلای ناب</option>
                <option value={14}>14K (585 Commercial)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#626667] mb-1.5 font-bold">
                {language === 'fa' ? 'وزن گوهر / عقیق (قیراط)' : 'Gemstone Carats'}
              </label>
              <input 
                type="number"
                step="0.05"
                min="0"
                max="10"
                value={gemstoneCarats}
                onChange={(e) => setGemstoneCarats(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-semibold focus:outline-none focus:border-[#C4852B]"
              />
            </div>
          </div>

          {/* Value Breakdown Box */}
          <div className="p-5 rounded-2xl bg-[#F4F1EA] border border-[#C4852B]/30 space-y-2.5 font-mono text-[11px]">
            <div className="flex justify-between text-[#626667]">
              <span>{language === 'fa' ? 'ارزش طلای خام ۱۸ عیار:' : '18K Raw Gold Base:'}</span>
              <span>${Math.round(rawGoldValue).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#626667]">
              <span>{language === 'fa' ? 'اجرت ساخت دست‌ساز (۱۲٪):' : 'Artisan Crafting Fee (12%):'}</span>
              <span>${Math.round(makingCharge).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#626667]">
              <span>{language === 'fa' ? 'ارزش عقیق طبیعی و الماس:' : 'Natural Gemstone & Diamond:'}</span>
              <span>${Math.round(gemstoneValue).toLocaleString()}</span>
            </div>
            
            <div className="pt-3 border-t border-zinc-300 flex justify-between items-center text-sm font-bold text-zinc-950">
              <span>{language === 'fa' ? 'مجموع برآورد رسمی:' : 'Official Estimated Total:'}</span>
              <span className="text-lg text-[#C4852B] font-bold">${totalEstimatedPrice.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-[#660000] hover:bg-[#7D0000] text-white font-bold uppercase tracking-[0.2em] rounded-xl shadow-md transition-all text-xs cursor-pointer"
          >
            {language === 'fa' ? 'ثبت سفارش یا مشاوره خرید' : 'Book Private Consultation'}
          </button>
        </div>

      </div>
    </div>
  );
}
