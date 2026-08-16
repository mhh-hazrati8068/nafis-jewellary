"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrappers";

export default function ProductCarousel() {
  const { products, language, addToCart, t } = useAppStore();

  return (
    <section className="py-20 md:py-32 bg-[#FAF9F5] text-zinc-950 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Header */}
        <MotionFadeIn direction="up" className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-2 block font-mono">
              {t.products.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
              {t.products.title}
            </h2>
          </div>
          
          <Link 
            href="/shop" 
            className="group flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold text-[#660000] hover:opacity-80 transition-opacity"
          >
            <span>{t.products.viewAll}</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </MotionFadeIn>

        {/* Product Cards Grid */}
        <MotionStaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 6).map((product) => (
            <MotionStaggerItem key={product.id}>
              <div 
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-[#C4852B] luxury-card-hover p-5 shadow-sm h-full justify-between"
              >
                {/* Product Image */}
                <Link 
                  href={`/product/${product.id}`}
                  className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F4F1EA] mb-5 block"
                >
                  <img 
                    src={product.image} 
                    alt={product.nameFa}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  
                  {/* 18K Gold Badge */}
                  <span className="absolute top-3 left-3 bg-[#660000] text-white text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
                    {product.carat}
                  </span>

                  {/* Quick Add Overlay Button */}
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out bg-gradient-to-t from-black/60 to-transparent flex justify-center">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: language === 'fa' ? product.nameFa : product.nameEn,
                          price: product.price,
                          image: product.image
                        });
                      }}
                      className="w-full py-2.5 bg-[#C4852B] hover:bg-[#A76E1F] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg transition-colors cursor-pointer"
                    >
                      {t.products.quickAdd}
                    </button>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] text-[#626667] uppercase tracking-widest font-mono block mb-1">
                      {language === 'fa' ? product.materialFa : product.materialEn}
                    </span>
                    
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-base text-zinc-950 group-hover:text-[#C4852B] transition-colors duration-300 mb-2">
                        {language === 'fa' ? product.nameFa : product.nameEn}
                      </h3>
                    </Link>
                  </div>

                  <div className="pt-4 border-t border-zinc-200 flex items-center justify-between mt-4">
                    <span className="font-mono text-lg font-bold text-[#C4852B]">
                      ${product.price.toLocaleString()}
                    </span>

                    <button
                      onClick={() => addToCart({
                        id: product.id,
                        name: language === 'fa' ? product.nameFa : product.nameEn,
                        price: product.price,
                        image: product.image
                      })}
                      className="px-4 py-2 bg-[#660000] hover:bg-[#7D0000] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {t.products.addToCart}
                    </button>
                  </div>
                </div>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>

      </div>
    </section>
  );
}
