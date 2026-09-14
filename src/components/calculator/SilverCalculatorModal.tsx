"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SilverCalculatorModal({ isOpen, onClose }: CalculatorProps) {
  const { language, silverPricePerGramToman } = useAppStore();
  const [weight, setWeight] = useState<number>(6.5);
  const [purity, setPurity] = useState<number>(925);
  const [makingFeePercent, setMakingFeePercent] = useState<number>(15);
  const [gemstonePriceToman, setGemstonePriceToman] = useState<number>(1500000);

  if (!isOpen) return null;

  // 925 Sterling Silver base calculation using live TGJU silver price
  const purityMultiplier = purity === 925 ? 0.925 : (purity / 1000);
  const rawSilverValue = weight * silverPricePerGramToman * purityMultiplier;
  const makingCharge = (rawSilverValue * makingFeePercent) / 100;
  const totalEstimatedPrice = Math.round(rawSilverValue + makingCharge + gemstonePriceToman);

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
              {language === 'fa' ? 'محاسبه‌گر تخصصی بر اساس نرخ رسمی نقره' : language === 'ar' ? 'حاسبة تقييم الفضة والأحجار الكريمة' : 'OFFICIAL 925 STERLING SILVER VALUATION MATRIX'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight">
              {language === 'fa' ? 'محاسبه‌گر آنلاین وزن و قیمت نقره ۹۲۵' : language === 'ar' ? 'حاسبة أسعار الفضة والأحجار الكريمة' : 'Silver & Gemstone Price Calculator'}
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
                {language === 'fa' ? 'وزن نقره (گرم):' : language === 'ar' ? 'وزن الفضة (غرام):' : 'Silver Weight (Grams):'}
              </span>
              <span className="text-sm font-bold text-[#C4852B] bg-[#C4852B]/10 px-2.5 py-0.5 rounded">
                {weight} {language === 'fa' ? 'گرم' : language === 'ar' ? 'غرام' : 'g'}
              </span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="100" 
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full accent-[#C4852B] cursor-pointer"
            />
          </div>

          {/* Purity Standard & Gemstone selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#626667] mb-1.5 font-bold">
                {language === 'fa' ? 'عیار استاندارد نقره' : language === 'ar' ? 'معيار نقاوة الفضة' : 'Silver Purity Standard'}
              </label>
              <select 
                value={purity}
                onChange={(e) => setPurity(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-semibold focus:outline-none focus:border-[#C4852B]"
              >
                <option value={925}>925 Sterling — نقره استرلینگ دست‌ساز</option>
                <option value={999}>999 Fine Pure — شمش نقره خالص</option>
                <option value={840}>840 Standard — نقره سنتی</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-[#626667] mb-1.5 font-bold">
                {language === 'fa' ? 'ارزش سنگ / نگین (تومان)' : language === 'ar' ? 'قيمة الحجر الكريم (تومان)' : 'Gemstone Value (Toman)'}
              </label>
              <input 
                type="number"
                step="50000"
                min="0"
                value={gemstonePriceToman}
                onChange={(e) => setGemstonePriceToman(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white font-semibold focus:outline-none focus:border-[#C4852B] font-mono"
              />
            </div>
          </div>

          {/* Crafting Fee Slider */}
          <div>
            <div className="flex justify-between items-center mb-2 font-mono">
              <span className="font-semibold text-zinc-700">
                {language === 'fa' ? 'درصد اجرت ساخت دست‌ساز:' : language === 'ar' ? 'أجرة الصياغة اليدوية:' : 'Artisan Crafting Fee:'}
              </span>
              <span className="text-sm font-bold text-[#660000] bg-[#660000]/10 px-2.5 py-0.5 rounded">
                {makingFeePercent}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="40" 
              step="1"
              value={makingFeePercent}
              onChange={(e) => setMakingFeePercent(parseInt(e.target.value))}
              className="w-full accent-[#660000] cursor-pointer"
            />
          </div>

          {/* Value Breakdown Box */}
          <div className="p-5 rounded-2xl bg-[#F4F1EA] border border-[#C4852B]/30 space-y-2.5 font-mono text-[11px]">
            <div className="flex justify-between text-[#626667]">
              <span>{language === 'fa' ? 'ارزش خام نقره:' : language === 'ar' ? 'قيمة الفضة الخام:' : 'Raw Silver Base:'}</span>
              <span>{Math.round(rawSilverValue).toLocaleString()} تومان</span>
            </div>
            <div className="flex justify-between text-[#626667]">
              <span>{language === 'fa' ? `اجرت ساخت دست‌ساز (${makingFeePercent}٪):` : language === 'ar' ? `أجرة الصياغة اليدوية (${makingFeePercent}%):` : `Artisan Crafting Fee (${makingFeePercent}%):`}</span>
              <span>{Math.round(makingCharge).toLocaleString()} تومان</span>
            </div>
            <div className="flex justify-between text-[#626667]">
              <span>{language === 'fa' ? 'ارزش نگین فیروزه / عقیق:' : language === 'ar' ? 'قيمة الحجر الطبيعي:' : 'Natural Gemstone (Turquoise/Agate):'}</span>
              <span>{Math.round(gemstonePriceToman).toLocaleString()} تومان</span>
            </div>
            
            <div className="pt-3 border-t border-zinc-300 flex justify-between items-center text-sm font-bold text-zinc-950">
              <span>{language === 'fa' ? 'مجموع برآورد رسمی:' : language === 'ar' ? 'إجمالي التقدير الرسمي:' : 'Official Estimated Total:'}</span>
              <span className="text-base text-[#660000] font-extrabold">{totalEstimatedPrice.toLocaleString()} تومان</span>
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
            {language === 'fa'
              ? 'نرخ نقره به صورت لحظه‌ای از اتحادیه طلا و جواهر (TGJU) همگام‌سازی می‌شود.'
              : language === 'ar'
              ? 'يتم تحديث أسعار الفضة لحظياً وفقاً للسوق الرسمي.'
              : 'Silver rates are synced live with the official precious metals exchange (TGJU).'}
          </p>

        </div>

      </div>
    </div>
  );
}
