"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { useEffect } from "react";
import { getProductName, getProductMaterial } from "@/lib/dynamicTranslator";
import WishlistButton from "@/components/product/WishlistButton";
import { isBraceletOnlyProduct } from "@/lib/categoryFilters";

export default function BraceletsPage() {
  const { products, language, addToCart, t, fetchProducts, isLoadingProducts } = useAppStore();

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const bracelets = products.filter(isBraceletOnlyProduct);

  const getSubtitle = () => {
    if (language === 'fa') return 'دستبندهای نقره ۹۲۵ با زنجیره‌های محکم، صیقلی و بافت اختصاصی.';
    if (language === 'ar') return 'أساور وسلاسل من الفضة الإسترلينية 925 مع صياغة متينة وأقفال آمنة.';
    return 'Handcrafted 925 sterling silver chain link bracelets with precision clasps.';
  };

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-[#C4852B]/20 pb-8">
          <div>
            <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase mb-2 block font-bold">
              SOLID 925 STERLING SILVER BRACELETS
            </span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase">{t.header.bracelets}</h1>
          </div>
          <p className="text-xs text-[#626667] max-w-sm mt-4 md:mt-0">
            {getSubtitle()}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {bracelets.map((product) => {
            const prodName = getProductName(product, language);
            const prodMaterial = getProductMaterial(product, language);

            return (
              <div 
                key={product.id} 
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/80 hover:border-[#C4852B]/70 transition-all p-4 shadow-2xs hover:shadow-md h-full justify-between"
              >
                <Link href={`/product/${product.id}`} className="relative aspect-square rounded-xl overflow-hidden bg-[#FAF9F5] mb-3.5 block border border-zinc-100 p-2.5">
                  <WishlistButton productId={product.id} className="absolute top-2.5 end-2.5 z-10" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={prodName} loading="lazy" decoding="async" className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500" />
                </Link>
                
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] text-[#626667] font-mono uppercase tracking-wider block mb-1">
                      {prodMaterial}
                    </span>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-sm text-zinc-950 hover:text-[#660000] transition-colors mb-1.5 line-clamp-2 leading-snug">
                        {prodName}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 mt-3">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#C4852B]">
                      {product.price.toLocaleString()} تومان
                    </span>
                    <button
                      onClick={() => addToCart({
                        id: product.id,
                        name: prodName,
                        price: product.price,
                        image: product.image
                      })}
                      className="px-3 py-1.5 bg-[#660000] text-white text-[11px] font-bold rounded-lg hover:bg-[#7D0000] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t.products.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
