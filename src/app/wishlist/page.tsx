"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getProductName, getProductMaterial } from "@/lib/dynamicTranslator";
import { HeartLuxuryIcon, ShoppingBagLuxuryIcon } from "@/components/icons/JewelryIcons";

export default function WishlistPage() {
  const { wishlist, products, toggleWishlist, addToCart, language, t, fetchProducts } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [addedToastId, setAddedToastId] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, [fetchProducts]);

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleAddToCart = (product: typeof products[0]) => {
    const name = getProductName(product, language);
    addToCart({
      id: product.id,
      name,
      price: product.price,
      image: product.image,
      category: product.category,
      material: getProductMaterial(product, language),
    });
    setAddedToastId(product.id);
    setTimeout(() => setAddedToastId(null), 2500);
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      const name = getProductName(product, language);
      addToCart({
        id: product.id,
        name,
        price: product.price,
        image: product.image,
        category: product.category,
        material: getProductMaterial(product, language),
      });
    });
  };

  if (!mounted) {
    return (
      <div className="py-24 text-center text-xs text-zinc-500 min-h-[60vh] flex items-center justify-center">
        در حال بارگذاری لیست علاقه‌مندی‌ها...
      </div>
    );
  }

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        
        {/* Header Title */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-[11px] text-[#A06314] font-mono tracking-widest uppercase mb-2 block font-bold">
            WISHLIST
          </span>
          <h1 className="text-3xl md:text-5xl font-bold uppercase mb-4">
            {t.wishlistPage.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
            {t.wishlistPage.subtitle}
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="max-w-md mx-auto text-center p-10 sm:p-12 rounded-3xl bg-[#F4F1EA] border border-[#C4852B]/30 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#660000]/10 text-[#660000] flex items-center justify-center mb-5 shadow-2xs">
              <HeartLuxuryIcon className="w-8 h-8 fill-[#660000]/20" />
            </div>
            <h3 className="text-xl font-bold text-zinc-950 mb-2">
              {t.wishlistPage.emptyTitle}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed mb-6 font-sans">
              {t.wishlistPage.emptyDesc}
            </p>
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-[#660000] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#7D0000] transition-all shadow-md cursor-pointer"
            >
              {t.wishlistPage.explore}
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div>
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200">
              <span className="text-xs font-bold text-zinc-700 font-sans">
                {wishlistProducts.length} {t.wishlistPage.savedItems}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddAllToCart}
                  className="px-5 py-2.5 bg-[#660000] text-white text-xs font-bold rounded-xl hover:bg-[#7D0000] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <ShoppingBagLuxuryIcon className="w-4 h-4" />
                  <span>{t.wishlistPage.addAllToCart}</span>
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => {
                const prodName = getProductName(product, language);
                const prodMaterial = getProductMaterial(product, language);
                const isJustAdded = addedToastId === product.id;

                return (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#C4852B]/25 hover:border-[#C4852B] transition-all p-4 shadow-sm hover:shadow-md relative"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-6 end-6 z-10 p-2 rounded-full bg-white/90 text-[#660000] hover:bg-[#660000] hover:text-white transition-all shadow-sm cursor-pointer"
                      title={t.wishlistPage.remove}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                      </svg>
                    </button>

                    {/* Product Image Link */}
                    <Link
                      href={`/product/${product.id}`}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-[#F4F1EA] mb-3 block"
                    >
                      <Image
                        src={product.image}
                        alt={prodName}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex flex-col flex-1 justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-500 font-mono block mb-1">
                          {prodMaterial}
                        </span>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold text-sm text-zinc-950 hover:text-[#C4852B] transition-colors line-clamp-2 leading-snug mb-2">
                            {prodName}
                          </h3>
                        </Link>
                      </div>

                      <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2 mt-2">
                        <span className="font-mono text-sm font-bold text-[#C4852B]">
                          {product.price.toLocaleString()} تومان
                        </span>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`w-full py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isJustAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-[#660000] hover:bg-[#7D0000] text-white shadow-xs"
                          }`}
                        >
                          {isJustAdded ? (
                            <span>✓</span>
                          ) : (
                            <ShoppingBagLuxuryIcon className="w-4 h-4" />
                          )}
                          <span>{isJustAdded ? t.wishlistPage.addedToCart : t.products.addToCart}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
