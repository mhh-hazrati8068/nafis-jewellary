"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { useState } from "react";

export default function ShopPage() {
  const { products, language, addToCart, t } = useAppStore();
  const [selectedCat, setSelectedCat] = useState<string>("all");

  const filteredProducts = selectedCat === "all" 
    ? products 
    : products.filter(p => p.category === selectedCat);

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase mb-2 block font-bold">
            OFFICIAL CATALOGUE
          </span>
          <h1 className="text-3xl md:text-5xl font-bold uppercase mb-4">
            {language === 'fa' ? 'تمامی زیورآلات نفیسه عبادی' : 'All Jewelry Creations'}
          </h1>
          <p className="text-xs text-[#626667]">
            {language === 'fa' 
              ? 'مجموعه کامل انگشترها، گردنبندها، دستبندها و گوشواره‌های ۱۸ عیار.' 
              : 'Complete catalog of 18K solid gold, agate gemstone, and VVS diamond jewelry.'}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {[
            { id: 'all', nameFa: 'همه محصولات', nameEn: 'All Creations' },
            { id: 'rings', nameFa: 'انگشتر', nameEn: 'Rings' },
            { id: 'necklaces', nameFa: 'گردنبند', nameEn: 'Necklaces' },
            { id: 'bracelets', nameFa: 'دستبند', nameEn: 'Bracelets' },
            { id: 'earrings', nameFa: 'گوشواره', nameEn: 'Earrings' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                selectedCat === cat.id 
                  ? "bg-[#660000] text-white border-[#660000] shadow-sm" 
                  : "bg-white text-zinc-700 border-zinc-300 hover:border-[#C4852B]"
              }`}
            >
              {language === 'fa' ? cat.nameFa : cat.nameEn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-[#C4852B] transition-all p-5 shadow-sm luxury-card-hover"
            >
              <Link href={`/product/${product.id}`} className="aspect-square rounded-xl overflow-hidden bg-[#F4F1EA] mb-4 block">
                <img src={product.image} alt={product.nameFa} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
              
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] text-[#626667] font-mono uppercase tracking-wider block mb-1">
                    {language === 'fa' ? product.materialFa : product.materialEn}
                  </span>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-base text-zinc-950 hover:text-[#C4852B] transition-colors mb-2">
                      {language === 'fa' ? product.nameFa : product.nameEn}
                    </h3>
                  </Link>
                </div>

                <div className="pt-4 border-t border-zinc-200 flex items-center justify-between mt-4">
                  <span className="font-mono text-base font-bold text-[#C4852B]">${product.price}</span>
                  <button
                    onClick={() => addToCart({
                      id: product.id,
                      name: language === 'fa' ? product.nameFa : product.nameEn,
                      price: product.price,
                      image: product.image
                    })}
                    className="px-4 py-2 bg-[#660000] text-white text-xs font-semibold rounded-lg hover:bg-[#7D0000] transition-colors cursor-pointer"
                  >
                    {language === 'fa' ? 'افزودن به سبد' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
