"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem } from "@/components/ui/MotionWrappers";
import { getProductName, getProductMaterial } from "@/lib/dynamicTranslator";
import WishlistButton from "@/components/product/WishlistButton";

export default function ProductCarousel() {
  const { products, language, addToCart, t } = useAppStore();

  return (
    <section className="py-16 md:py-22 bg-[#FAF9F5] text-zinc-950 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 md:px-12">

        {/* Header */}
        <MotionFadeIn direction="up" className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-4">
          <div>
            <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.28em] font-semibold mb-2 block font-mono">
              {t.products.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#1A1816]">
              {t.products.title}
            </h2>
          </div>

          <Link
            href="/shop"
            className="group flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] font-bold text-[#660000] hover:opacity-80 transition-opacity"
          >
            <span>{t.products.viewAll}</span>
            <span className="transform group-hover:-translate-x-1 ltr:group-hover:translate-x-1 transition-transform duration-300">{language === 'en' ? '→' : '←'}</span>
          </Link>
        </MotionFadeIn>

        {/* Product Cards Grid: Balanced 4 Columns on Desktop, 3 on Tablet, Standard Square Frames */}
        <MotionStaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {products.slice(0, 8).map((product) => (
            <MotionStaggerItem key={product.id}>
              <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/80 hover:border-[#C4852B]/70 transition-all duration-300 p-4 shadow-2xs hover:shadow-md h-full justify-between">
                {/* Product Image in Balanced Square Frame */}
                <Link
                  href={`/product/${product.id}`}
                  className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF9F5] mb-3.5 block border border-zinc-100 p-2.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={getProductName(product, language)}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Minimal Carat & Wishlist Actions */}
                  <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10 pointer-events-none">
                    <span className="bg-[#660000]/90 text-white text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full font-bold">
                      {product.carat}
                    </span>
                    <WishlistButton productId={product.id} className="pointer-events-auto" />
                  </div>

                  {/* Clean Frosted Quick Add Bar */}
                  <div className="absolute inset-x-2 bottom-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          id: product.id,
                          name: getProductName(product, language),
                          price: product.price,
                          image: product.image
                        });
                      }}
                      className="w-full py-2 bg-white/95 backdrop-blur-md hover:bg-[#660000] hover:text-white text-[#1A1816] border border-[#C4852B]/30 text-[11px] font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      {t.products.quickAdd}
                    </button>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] text-[#626667] uppercase tracking-wider font-mono block mb-1">
                      {getProductMaterial(product, language)}
                    </span>

                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-sm text-[#1A1816] group-hover:text-[#660000] transition-colors duration-300 mb-1.5 line-clamp-2 leading-snug">
                        {getProductName(product, language)}
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
                        name: getProductName(product, language),
                        price: product.price,
                        image: product.image
                      })}
                      className="px-3 py-1.5 bg-[#660000] hover:bg-[#7D0000] text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
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
