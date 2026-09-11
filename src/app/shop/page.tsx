"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { useEffect } from "react";
import { getProductName, getProductMaterial, translateDynamicText } from "@/lib/dynamicTranslator";

export default function ShopPage() {
  const { 
    products, 
    categories, 
    selectedCategoryId, 
    setSelectedCategoryId, 
    fetchCategories, 
    language, 
    addToCart, 
    t, 
    isLoadingProducts 
  } = useAppStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getPageTitle = () => {
    if (language === 'fa') return 'تمامی زیورآلات نفیسه عبادی';
    if (language === 'ar') return 'جميع إبداعات مجوهرات نفيسة عبادي';
    return 'All Jewelry Creations';
  };

  const getPageSubtitle = () => {
    if (language === 'fa') return 'مجموعه کامل انگشترها، گردنبندها، دستبندها و گوشواره‌های ۱۸ عیار و نقره.';
    if (language === 'ar') return 'التشكيلة الكاملة من الخواتم والقلائد والأساور والأقراط من الذهب عيار 18 والفضة النقية والأحجار الكريمة.';
    return 'Complete catalog of 18K solid gold, fine silver, agate gemstones, and VVS diamond jewelry.';
  };

  const allLabel = language === 'fa' ? 'همه محصولات' : language === 'ar' ? 'جميع المنتجات' : 'All Creations';

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase mb-2 block font-bold">
            OFFICIAL CATALOGUE
          </span>
          <h1 className="text-3xl md:text-5xl font-bold uppercase mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-[#626667]">
            {getPageSubtitle()}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {/* All category pill */}
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
              selectedCategoryId === null 
                ? "bg-[#660000] text-white border-[#660000] shadow-sm" 
                : "bg-white text-zinc-700 border-zinc-300 hover:border-[#C4852B]"
            }`}
          >
            {allLabel}
          </button>

          {/* Dynamic categories from backend */}
          {categories.map((cat) => {
            const catName = language === 'fa' ? cat.name : translateDynamicText(cat.name, language);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                  selectedCategoryId === cat.id 
                    ? "bg-[#660000] text-white border-[#660000] shadow-sm" 
                    : "bg-white text-zinc-700 border-zinc-300 hover:border-[#C4852B]"
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>

        {isLoadingProducts ? (
          <div className="py-20 text-center text-xs text-zinc-500">
            در حال دریافت محصولات از سرور...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const prodName = getProductName(product, language);
              const prodMaterial = getProductMaterial(product, language);

              return (
                <div 
                  key={product.id} 
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-[#C4852B] transition-all p-5 shadow-sm luxury-card-hover"
                >
                  <Link href={`/product/${product.id}`} className="aspect-square rounded-xl overflow-hidden bg-[#F4F1EA] mb-4 block">
                    <img src={product.image} alt={prodName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] text-[#626667] font-mono uppercase tracking-wider block mb-1">
                        {prodMaterial}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-bold text-base text-zinc-950 hover:text-[#C4852B] transition-colors mb-2">
                          {prodName}
                        </h3>
                      </Link>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 flex items-center justify-between mt-4">
                      <span className="font-mono text-sm font-bold text-[#C4852B]">
                        {product.price.toLocaleString()} تومان
                      </span>
                      <button
                        onClick={() => addToCart({
                          id: product.id,
                          name: prodName,
                          price: product.price,
                          image: product.image
                        })}
                        className="px-4 py-2 bg-[#660000] text-white text-xs font-semibold rounded-lg hover:bg-[#7D0000] transition-colors cursor-pointer"
                      >
                        {t.products.addToCart}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
