"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  getProductName, 
  getProductCategory, 
  getProductMaterial, 
  getProductDescription 
} from "@/lib/dynamicTranslator";
import { SparkleStarIcon } from "@/components/icons/JewelryIcons";
import WishlistButton from "@/components/product/WishlistButton";

interface ProductDetailViewProps {
  productId: number;
}

export default function ProductDetailView({ productId }: ProductDetailViewProps) {
  const { getProductById, fetchSingleProduct, products, addToCart, toggleWishlist, wishlist, language, isSilverPriceStale, t } = useAppStore();

  const [loadedProduct, setLoadedProduct] = useState(getProductById(productId));

  useEffect(() => {
    const existing = getProductById(productId);
    if (!existing) {
      fetchSingleProduct(productId).then((p) => {
        if (p) setLoadedProduct(p);
      });
    }
  }, [productId, getProductById, fetchSingleProduct]);

  const product = loadedProduct || getProductById(productId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const activeImg = selectedImage || product?.image;
  const isWishlisted = product ? wishlist.includes(product.id) : false;

  const name = getProductName(product, language);
  const category = getProductCategory(product, language);
  const material = getProductMaterial(product, language);
  const description = getProductDescription(product, language);

  const getWeightLabel = () => {
    if (language === 'fa') return 'وزن نقره خالص ۹۲۵';
    if (language === 'ar') return 'وزن الفضة الاسترليني 925';
    return '925 Sterling Silver Weight';
  };

  const getWeightUnit = () => {
    if (language === 'fa') return 'گرم';
    if (language === 'ar') return 'جرام';
    return 'grams';
  };

  const getMaterialLabel = () => {
    if (language === 'fa') return 'جنس و عیار';
    if (language === 'ar') return 'المعدن والعيار';
    return 'Material & Carat';
  };

  if (!product) {
    return (
      <div className="py-24 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#C4852B] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-zinc-500 font-mono">
            {language === 'fa' ? 'در حال بارگذاری جزئیات اثر فاخر...' : 'Loading creation details...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        <div className="flex items-center gap-2 text-xs text-[#626667] mb-12 uppercase tracking-widest font-mono">
          <Link href="/" className="hover:text-[#C4852B]">{language === 'fa' ? 'خانه' : language === 'ar' ? 'الرئيسية' : 'Home'}</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#C4852B]">{t.header.collections}</Link>
          <span>/</span>
          <span className="text-zinc-950 font-semibold">
            {name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-24">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-xl group">
              <img 
                src={activeImg} 
                alt={name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <span className="absolute top-4 right-4 bg-[#660000] text-white text-[9px] font-mono tracking-widest uppercase px-3 py-1 rounded-full shadow-md font-bold">
                CERTIFIED AUTHENTIC
              </span>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden bg-white border-2 transition-all cursor-pointer ${
                      activeImg === img ? "border-[#C4852B] scale-105" : "border-zinc-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#C4852B] font-mono uppercase tracking-[0.3em] font-bold">
                  {category} • {product.carat}
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
                {name}
              </h1>

              <div className="font-mono text-2xl font-bold text-[#C4852B] mb-2">
                {product.price.toLocaleString()} تومان
              </div>

              {isSilverPriceStale && (
                <div className="inline-flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl font-medium mb-5">
                  <span>⚠️</span>
                  <span>{language === 'fa' ? 'توجه: نرخ نقره به‌روز نیست و قیمت بر پایه آخرین نرخ ثبت‌شده محاسبه شده است.' : 'Note: Silver rate is not up to date; calculated with last recorded rate.'}</span>
                </div>
              )}

              <p className="text-xs md:text-sm text-[#626667] leading-relaxed mb-8">
                {description}
              </p>

              <div className="p-6 rounded-2xl bg-[#F4F1EA] border border-[#C4852B]/30 mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#626667] uppercase tracking-widest block font-mono mb-1 font-bold">
                    {getMaterialLabel()}
                  </span>
                  <span className="font-semibold text-zinc-950">
                    {material}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#626667] uppercase tracking-widest block font-mono mb-1 font-bold">
                    {getWeightLabel()}
                  </span>
                  <span className="font-semibold text-zinc-950 font-mono">
                    {product.weightGram} {getWeightUnit()}
                  </span>
                </div>
                {product.size && (
                  <div>
                    <span className="text-[10px] text-[#626667] uppercase tracking-widest block font-mono mb-1 font-bold">
                      {language === 'fa' ? 'سایز / ابعاد' : language === 'ar' ? 'المقاس / الأبعاد' : 'Size / Dimensions'}
                    </span>
                    <span className="font-semibold text-zinc-950 font-mono">
                      {product.size}
                    </span>
                  </div>
                )}
                {product.hasRhodiumPlating && (
                  <div>
                    <span className="text-[10px] text-[#626667] uppercase tracking-widest block font-mono mb-1 font-bold">
                      {language === 'fa' ? 'پوشش و آبکاری' : language === 'ar' ? 'الطلاء' : 'Surface Finish'}
                    </span>
                    <span className="font-semibold text-[#660000]">
                      {language === 'fa' ? 'دارای آبکاری رادیوم' : language === 'ar' ? 'مطلي بالروديوم' : 'Rhodium Plated'}
                    </span>
                  </div>
                )}
              </div>

              {/* Dedicated Per-Product Gemstone Specifications */}
              {(product.stoneName ||
                product.stoneSpecs?.color ||
                product.stoneSpecs?.naturalStatus ||
                product.stoneSpecs?.clarity ||
                product.stoneSpecs?.pattern ||
                product.stoneSpecs?.origin ||
                product.stoneSpecs?.uniqueFeatures) && (
                <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#C4852B]/35 shadow-xs mb-8">
                  <h2 className="text-xs font-bold text-[#660000] mb-4 flex items-center gap-2">
                    <SparkleStarIcon className="w-4 h-4 text-[#C4852B]" />
                    <span>
                      {language === 'fa'
                        ? 'مشخصات اختصاصی سنگ این اثر'
                        : language === 'ar'
                        ? 'مواصفات الحجر الخاصة بهذه القطعة'
                        : 'Gemstone Specifications'}
                    </span>
                  </h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    {(product.stoneSpecs?.name || product.stoneName) && (
                      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-zinc-200/70">
                        <dt className="text-[10px] text-[#626667] font-bold mb-1">
                          {language === 'fa' ? 'نام سنگ' : language === 'ar' ? 'اسم الحجر' : 'Stone Name'}
                        </dt>
                        <dd className="font-semibold text-zinc-950">
                          {product.stoneSpecs?.name || product.stoneName}
                        </dd>
                      </div>
                    )}
                    {product.stoneSpecs?.color && (
                      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-zinc-200/70">
                        <dt className="text-[10px] text-[#626667] font-bold mb-1">
                          {language === 'fa' ? 'رنگ و طیف رنگی' : language === 'ar' ? 'اللون والطيف اللوني' : 'Color & Tone'}
                        </dt>
                        <dd className="font-semibold text-zinc-950">{product.stoneSpecs.color}</dd>
                      </div>
                    )}
                    {product.stoneSpecs?.naturalStatus && (
                      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-zinc-200/70">
                        <dt className="text-[10px] text-[#626667] font-bold mb-1">
                          {language === 'fa' ? 'اصالت و ساختار سنگ' : language === 'ar' ? 'طبيعة الحجر' : 'Natural / Origin Status'}
                        </dt>
                        <dd className="font-semibold text-zinc-950">{product.stoneSpecs.naturalStatus}</dd>
                      </div>
                    )}
                    {product.stoneSpecs?.clarity && (
                      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-zinc-200/70">
                        <dt className="text-[10px] text-[#626667] font-bold mb-1">
                          {language === 'fa' ? 'ویژگی‌های ظاهری و شفافیت' : language === 'ar' ? 'المظهر والشفافية' : 'Appearance & Clarity'}
                        </dt>
                        <dd className="font-semibold text-zinc-950">{product.stoneSpecs.clarity}</dd>
                      </div>
                    )}
                    {product.stoneSpecs?.pattern && (
                      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-zinc-200/70">
                        <dt className="text-[10px] text-[#626667] font-bold mb-1">
                          {language === 'fa' ? 'طرح، نقش و رگه‌های شاخص' : language === 'ar' ? 'النقش والعروق المميزة' : 'Pattern & Inclusions'}
                        </dt>
                        <dd className="font-semibold text-zinc-950">{product.stoneSpecs.pattern}</dd>
                      </div>
                    )}
                    {product.stoneSpecs?.origin && (
                      <div className="p-3 rounded-xl bg-[#FAF9F5] border border-zinc-200/70">
                        <dt className="text-[10px] text-[#626667] font-bold mb-1">
                          {language === 'fa' ? 'محل خاستگاه' : language === 'ar' ? 'الموطن الأصلي' : 'Origin'}
                        </dt>
                        <dd className="font-semibold text-zinc-950">{product.stoneSpecs.origin}</dd>
                      </div>
                    )}
                    {product.stoneSpecs?.uniqueFeatures && (
                      <div className="sm:col-span-2 p-3 rounded-xl bg-[#FAF9F5] border border-zinc-200/70">
                        <dt className="text-[10px] text-[#626667] font-bold mb-1">
                          {language === 'fa' ? 'ویژگی‌های اختصاصی و متمایز سنگ' : language === 'ar' ? 'المزايا الخاصة والفريدة' : 'Distinctive Features'}
                        </dt>
                        <dd className="font-semibold text-zinc-950 leading-relaxed">{product.stoneSpecs.uniqueFeatures}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}
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
                      name: name,
                      price: product.price,
                      image: product.image,
                      category: category,
                      material: material
                    });
                  }
                }}
                className="flex-1 w-full py-4 bg-[#660000] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full shadow-lg hover:bg-[#7D0000] transition-all cursor-pointer"
              >
                {t.products.addToCart}
              </button>

              <WishlistButton productId={product.id} variant="button" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
