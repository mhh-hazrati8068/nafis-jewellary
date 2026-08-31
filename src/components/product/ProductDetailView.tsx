"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";
import Link from "next/link";

interface ProductDetailViewProps {
  productId: number;
}

export default function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { getProductById, products, addToCart, toggleWishlist, wishlist, language, t } = useAppStore();

  const product = getProductById(productId) || products[0];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const activeImg = selectedImage || product.image;
  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="flex items-center gap-2 text-xs text-[#626667] mb-12 uppercase tracking-widest font-mono">
          <Link href="/" className="hover:text-[#C4852B]">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#C4852B]">Collections</Link>
          <span>/</span>
          <span className="text-zinc-950 font-semibold">
            {language === 'fa' ? product.nameFa : product.nameEn}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-24">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F4F1EA] border border-zinc-200 shadow-xl group">
              <img 
                src={activeImg} 
                alt={product.nameFa}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 bg-[#660000] text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1 rounded-full shadow-md font-bold">
                CERTIFIED 18K GOLD
              </span>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImg === img ? "border-[#C4852B] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#C4852B] font-mono uppercase tracking-[0.3em] font-bold">
                  {language === 'fa' ? product.categoryFa : product.categoryEn} • {product.carat}
                </span>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className="p-2.5 rounded-full border border-zinc-200 text-zinc-600 hover:text-[#660000] transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className={`w-5 h-5 ${isWishlisted ? "text-[#660000]" : ""}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                </button>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase mb-4 leading-tight text-zinc-950">
                {language === 'fa' ? product.nameFa : product.nameEn}
              </h1>

              <div className="font-mono text-2xl font-bold text-[#C4852B] mb-6">
                {product.price.toLocaleString()} تومان
              </div>

              <p className="text-xs md:text-sm text-[#626667] leading-relaxed mb-8">
                {language === 'fa' ? product.descriptionFa : product.descriptionEn}
              </p>

              <div className="p-6 rounded-2xl bg-[#F4F1EA] border border-[#C4852B]/30 mb-8 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#626667] uppercase tracking-widest block font-mono mb-1 font-bold">
                    {language === 'fa' ? 'جنس و عیار' : 'Material & Carat'}
                  </span>
                  <span className="font-semibold text-zinc-950">
                    {language === 'fa' ? product.materialFa : product.materialEn}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#626667] uppercase tracking-widest block font-mono mb-1 font-bold">
                    {language === 'fa' ? 'وزن تقریبی طلا' : 'Approximate Weight'}
                  </span>
                  <span className="font-semibold text-zinc-950 font-mono">
                    {product.weightGram} {language === 'fa' ? 'گرم' : 'grams'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center border border-zinc-300 rounded-full px-4 py-2 text-sm bg-white shadow-xs">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-2 text-zinc-400 hover:text-black cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 font-mono font-bold">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="px-2 text-zinc-400 hover:text-black cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  for (let i = 0; i < qty; i++) {
                    addToCart({
                      id: product.id,
                      name: language === 'fa' ? product.nameFa : product.nameEn,
                      price: product.price,
                      image: product.image,
                      category: language === 'fa' ? product.categoryFa : product.categoryEn,
                      material: language === 'fa' ? product.materialFa : product.materialEn
                    });
                  }
                }}
                className="flex-1 w-full py-4 bg-[#660000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-lg hover:bg-[#7D0000] transition-all cursor-pointer"
              >
                {t.products.addToCart}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
