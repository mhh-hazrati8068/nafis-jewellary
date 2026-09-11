"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import Link from "next/link";
import { getProductName, getProductMaterial } from "@/lib/dynamicTranslator";

export default function SearchModal() {
  const { isSearchOpen, toggleSearch, products, language, addToCart, t } = useAppStore();
  const [query, setQuery] = useState("");

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === "" 
    ? [] 
    : products.filter(p => {
        const title = getProductName(p, language);
        const mat = getProductMaterial(p, language);
        const rawFa = (p.nameFa || '') + ' ' + (p.materialFa || '');
        return title.toLowerCase().includes(query.toLowerCase()) || 
               mat.toLowerCase().includes(query.toLowerCase()) ||
               rawFa.toLowerCase().includes(query.toLowerCase());
      });

  const getResultsText = () => {
    if (language === 'fa') return `${filteredProducts.length} محصول پیدا شد`;
    if (language === 'ar') return `تم العثور على ${filteredProducts.length} منتج`;
    return `${filteredProducts.length} Products Found`;
  };

  const getButtonText = () => {
    if (language === 'fa') return 'خرید';
    if (language === 'ar') return 'إضافة';
    return 'Add';
  };

  return (
    <div className="fixed inset-0 z-[120] flex flex-col items-center justify-start pt-16 md:pt-24 px-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={() => toggleSearch(false)}
      />

      <div className="relative w-full max-w-2xl bg-[#FAF9F5] text-zinc-950 rounded-2xl shadow-2xl border border-[#C4852B]/30 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-zinc-200 flex items-center gap-4 bg-[#F4F1EA]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#C4852B]">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.header.searchPlaceholder}
            className="flex-1 bg-transparent text-sm md:text-base text-zinc-950 placeholder-zinc-400 focus:outline-none"
          />

          <button 
            onClick={() => toggleSearch(false)}
            className="p-1.5 text-zinc-400 hover:text-[#660000] text-xs font-semibold uppercase tracking-wider cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 bg-[#FAF9F5]">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-xs text-[#626667]">
              <p className="uppercase tracking-[0.2em] font-mono mb-3 font-bold">
                {language === 'fa' ? 'جستجوهای پرطرفدار' : language === 'ar' ? 'الأكثر بحثاً' : 'Popular Searches'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { fa: 'انگشتر نقره', en: 'Silver Ring', ar: 'خاتم فضة' },
                  { fa: 'فیروزه نیشابور', en: 'Neyshabur Turquoise', ar: 'فيروز نيسابوري' },
                  { fa: 'عقیق سرخ', en: 'Red Agate', ar: 'عقيق أحمر' },
                  { fa: 'دستبند', en: 'Bracelet', ar: 'سوار' },
                  { fa: 'الماس VVS', en: 'VVS Diamond', ar: 'ألماس VVS' }
                ].map((item, idx) => {
                  const label = language === 'fa' ? item.fa : language === 'ar' ? item.ar : item.en;
                  return (
                    <button
                      key={idx}
                      onClick={() => setQuery(item.fa)}
                      className="px-3 py-1.5 rounded-full border border-[#C4852B]/30 bg-[#C4852B]/10 text-[#C4852B] hover:bg-[#C4852B] hover:text-white transition-colors font-medium cursor-pointer"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#626667]">
              <p className="text-sm font-semibold mb-1">
                {language === 'fa' ? 'نتیجه‌ای یافت نشد' : language === 'ar' ? 'لم يتم العثور على منتجات' : 'No products found'}
              </p>
              <p className="opacity-75">{language === 'fa' ? 'کلمات دیگری مانند انگشتر، فیروزه یا نقره را امتحان کنید' : language === 'ar' ? 'جرب البحث عن خاتم، فيروز، أو فضة' : 'Try searching for ring, turquoise, or silver'}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <span className="text-[10px] text-[#C4852B] uppercase tracking-widest font-mono font-bold">
                {getResultsText()}
              </span>
              {filteredProducts.map((p) => {
                const prodName = getProductName(p, language);
                const prodMat = getProductMaterial(p, language);
                return (
                  <div 
                    key={p.id} 
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-200 hover:border-[#C4852B] transition-all shadow-xs"
                  >
                    <Link 
                      href={`/product/${p.id}`} 
                      onClick={() => toggleSearch(false)}
                      className="flex items-center gap-4 flex-1"
                    >
                      <img src={p.image} alt={prodName} className="w-14 h-14 object-cover rounded-lg bg-[#F4F1EA]" />
                      <div>
                        <h4 className="font-bold text-sm text-zinc-950">
                          {prodName}
                        </h4>
                        <p className="text-[10px] text-[#626667]">{prodMat}</p>
                        <span className="font-mono text-xs font-bold text-[#C4852B]">
                          {p.price.toLocaleString()} {t.topBar.perGram.replace('/ gram', 'Toman').replace('تومان / گرم', 'تومان')}
                        </span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        addToCart({
                          id: p.id,
                          name: prodName,
                          price: p.price,
                          image: p.image
                        });
                        toggleSearch(false);
                      }}
                      className="px-4 py-2 bg-[#660000] hover:bg-[#7D0000] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {getButtonText()}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
