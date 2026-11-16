"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProductName, getProductMaterial, translateDynamicText } from "@/lib/dynamicTranslator";
import WishlistButton from "@/components/product/WishlistButton";
import { getCategorySvgIcon, AllCollectionsIcon, RingIcon, NecklaceIcon, BraceletIcon, JewelrySetIcon, GemstoneIcon } from "@/components/icons/JewelryIcons";
import {
  CollectionFilter,
  SubCategoryFilter,
  filterProductsByCollection,
  isBraceletOnlyProduct,
  matchesCategoryKeyword,
} from "@/lib/categoryFilters";
import { mapBackendToFrontend } from "@/lib/productMapper";

const VALID_FILTERS: CollectionFilter[] = ["women", "men", "sets", "stones", "bracelets", "chains"];
const VALID_SUBS: SubCategoryFilter[] = ["all", "necklaces", "rings", "bracelets"];

function ShopContent() {
  const { 
    products, 
    backendProducts,
    categories, 
    selectedCategoryId, 
    setSelectedCategoryId, 
    fetchCategories, 
    fetchProducts,
    language, 
    addToCart, 
    t, 
    isLoadingProducts
  } = useAppStore();

  const searchParams = useSearchParams();
  const router = useRouter();

  const rawFilter = searchParams.get("filter") as CollectionFilter | null;
  const activeFilter: CollectionFilter | null = rawFilter && VALID_FILTERS.includes(rawFilter) ? rawFilter : null;

  const rawSub = searchParams.get("sub") as SubCategoryFilter | null;
  const activeSub: SubCategoryFilter = rawSub && VALID_SUBS.includes(rawSub) ? rawSub : "all";

  // Ensure full catalog is available whenever filtering collections/categories relatively
  useEffect(() => {
    if (!backendProducts || backendProducts.length === 0) {
      fetchProducts(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync categoryId / collection filter from URL params on load and change
  useEffect(() => {
    fetchCategories();
    if (activeFilter) {
      if (selectedCategoryId !== null) setSelectedCategoryId(null);
      return;
    }
    const catParam = searchParams.get("categoryId") || searchParams.get("category");
    if (catParam) {
      const parsed = Number(catParam);
      if (!isNaN(parsed)) {
        if (selectedCategoryId !== parsed) setSelectedCategoryId(parsed);
        return;
      }
    }
    if (selectedCategoryId !== null) setSelectedCategoryId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, activeFilter]);

  const handleSelectCategory = (catId: number | null) => {
    setSelectedCategoryId(catId);
    if (catId) {
      router.replace(`/shop?categoryId=${catId}`, { scroll: false });
    } else {
      router.replace("/shop", { scroll: false });
    }
  };

  const handleSelectSubFilter = (sub: SubCategoryFilter) => {
    if (!activeFilter) return;
    const params = new URLSearchParams();
    params.set("filter", activeFilter);
    if (sub !== "all") {
      params.set("sub", sub);
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const fullCatalogProducts =
    backendProducts && backendProducts.length > 0
      ? backendProducts.map(mapBackendToFrontend)
      : products;

  // Compute displayed products according to active collection filter or category (including keyword matches in product name)
  const displayedProducts = (() => {
    if (activeFilter) {
      return filterProductsByCollection(fullCatalogProducts, activeFilter, activeSub);
    }
    if (selectedCategoryId !== null) {
      const activeCat = categories.find((c) => c.id === selectedCategoryId);
      const sourceList = fullCatalogProducts.length > 0 ? fullCatalogProducts : products;
      if (selectedCategoryId === 1) {
        return sourceList.filter(
          (p) => (p.categoryId === 1 || (activeCat ? matchesCategoryKeyword(p, activeCat.name) : false)) && isBraceletOnlyProduct(p)
        );
      }
      const matched = sourceList.filter(
        (p) => p.categoryId === selectedCategoryId || (activeCat ? matchesCategoryKeyword(p, activeCat.name) : false)
      );
      return matched.length > 0 ? matched : products;
    }
    return fullCatalogProducts.length > 0 ? fullCatalogProducts : products;
  })();

  const getPageTitle = () => {
    if (activeFilter === "women") {
      if (language === "fa") return "مجموعه تخصصی بانوان";
      if (language === "ar") return "مجموعة السيدات الراقية";
      return "Women's High Jewellery";
    }
    if (activeFilter === "men") {
      if (language === "fa") return "مجموعه فاخر آقایان";
      if (language === "ar") return "مجموعة الرجال الفاخرة";
      return "Men's Heritage Silver";
    }
    if (activeFilter === "sets") {
      if (language === "fa") return "ست‌ها و نیم‌ست‌های نقره";
      if (language === "ar") return "أطقم ونصف أطقم الفضة";
      return "Silver Sets & Half-Sets";
    }
    if (activeFilter === "chains") {
      if (language === "fa") return "زنجیر نقره";
      if (language === "ar") return "سلاسل الفضة";
      return "Silver Chains";
    }
    if (activeFilter === "stones") {
      if (language === "fa") return "سنگ‌های قرآنی";
      if (language === "ar") return "الأحجار القرآنية";
      return "Quranic Gemstones";
    }
    if (selectedCategoryId) {
      const activeCat = categories.find((c) => c.id === selectedCategoryId);
      if (activeCat) {
        const catName = language === "fa" ? activeCat.name : translateDynamicText(activeCat.name, language);
        if (language === "fa") return `زیورآلات نقره - دسته‌بندی ${catName}`;
        if (language === "ar") return `مجوهرات الفضة - فئة ${catName}`;
        return `Silver Jewelry - ${catName}`;
      }
    }
    if (language === "fa") return "تمامی زیورآلات نقره نفیسه عبادی";
    if (language === "ar") return "جميع إبداعات الفضة الاسترليني نفيسة عبادي";
    return "All Silver Jewelry Creations";
  };

  const getPageSubtitle = () => {
    if (activeFilter === "women") {
      if (language === "fa") return "گردنبند و گردن‌آویز زنانه، انگشتر زنانه و دستبند زنانه نقره ۹۲۵.";
      if (language === "ar") return "قلائد، خواتم وأساور نسائية من الفضة الإسترلينية 925.";
      return "Curated women's 925 silver necklaces, rings, and bracelets.";
    }
    if (activeFilter === "men") {
      if (language === "fa") return "انگشترهای مردانه، دستبندهای نقره مردانه و گردن‌آویزهای اختصاصی آقایان.";
      if (language === "ar") return "خواتم وأساور فضة رجالية حصرية بتصاميم فاخرة.";
      return "Exclusive men's 925 silver rings, bracelets, and pendants.";
    }
    if (activeFilter === "sets") {
      if (language === "fa") return "مجموعه ست‌ها و نیم‌ست‌های نقره ۹۲۵ نفیسه عبادی (به‌محض عرضه آثار جدید در این بخش قرار می‌گیرند).";
      if (language === "ar") return "مجموعة أطقم ونصف أطقم الفضة الإسترلينية 925.";
      return "Signature 925 sterling silver jewelry sets and half-sets.";
    }
    if (activeFilter === "chains") {
      if (language === "fa") return "انواع زنجیرهای نقره ۹۲۵ دست‌ساز با بافت‌های اصیل و قفل‌های ایمن.";
      if (language === "ar") return "سلاسل فضة إسترليني 925 بتصاميم متينة وأقفال آمنة.";
      return "Handcrafted 925 sterling silver chains with secure clasps.";
    }
    if (language === "fa") return "مجموعه کامل انگشترها، گردنبندها، دستبندها و سنگ‌های قرآنی نقره ۹۲۵، عقیق‌های معدنی و دُرّ نجف طبیعی.";
    if (language === "ar") return "التشكيلة الكاملة من الخواتم والقلائد والأساور والأحجار القرآنية من الفضة الإسترليني 925 والعقيق ودر النجف.";
    return "Complete catalog of handcrafted 925 sterling silver, natural Yemeni agate, and Durr-e Najaf jewelry.";
  };

  const getEmptyStateMessage = () => {
    if (activeFilter === "sets") {
      if (language === "fa") return "در حال حاضر محصولی در دسته‌بندی ست و نیم‌ست موجود نیست. آثار جدید در آینده در این بخش عرضه خواهند شد.";
      if (language === "ar") return "لا توجد منتجات في فئة الأطقم ونصف الأطقم حالياً. سيتم إضافة القطع الجديدة عند توفرها.";
      return "No products are currently available in the Sets & Half-Sets category. New pieces will appear here once released.";
    }
    if (activeFilter === "men" && activeSub === "necklaces") {
      if (language === "fa") return "در حال حاضر گردنبند و گردن‌آویز مردانه‌ای در این دسته موجود نیست.";
      if (language === "ar") return "لا توجد قلائد رجالية متوفرة حالياً في هذه الفئة.";
      return "No men's necklaces are currently available in this category.";
    }
    if (activeFilter === "men" && activeSub === "bracelets") {
      if (language === "fa") return "در حال حاضر دستبند نقره مردانه‌ای در این دسته موجود نیست.";
      if (language === "ar") return "لا توجد أساور فضة رجالية متوفرة حالياً.";
      return "No men's silver bracelets are currently available.";
    }
    if (activeFilter === "chains") {
      if (language === "fa") return "در حال حاضر محصولی در دسته‌بندی زنجیر نقره موجود نیست.";
      if (language === "ar") return "لا توجد سلاسل فضة متوفرة حالياً.";
      return "No silver chains are currently available.";
    }
    if (language === "fa") return "هیچ محصولی در این دسته‌بندی یافت نشد.";
    if (language === "ar") return "لم يتم العثور على منتجات في هذه الفئة.";
    return "No products found in this category.";
  };

  const allLabel = language === "fa" ? "همه محصولات" : language === "ar" ? "جميع المنتجات" : "All Creations";

  const womenTabs: { id: SubCategoryFilter; labelFa: string; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
    { id: "all", labelFa: "همه آثار بانوان", labelEn: "All Women's", labelAr: "جميع قطع السيدات", icon: <AllCollectionsIcon className="w-3.5 h-3.5" /> },
    { id: "necklaces", labelFa: "گردنبند و گردن‌آویز زنانه", labelEn: "Women's Necklaces", labelAr: "قلائد نسائية", icon: <NecklaceIcon className="w-3.5 h-3.5" /> },
    { id: "rings", labelFa: "انگشتر زنانه", labelEn: "Women's Rings", labelAr: "خواتم نسائية", icon: <RingIcon className="w-3.5 h-3.5" /> },
    { id: "bracelets", labelFa: "دستبند زنانه", labelEn: "Women's Bracelets", labelAr: "أساور نسائية", icon: <BraceletIcon className="w-3.5 h-3.5" /> },
  ];

  const menTabs: { id: SubCategoryFilter; labelFa: string; labelEn: string; labelAr: string; icon: React.ReactNode }[] = [
    { id: "all", labelFa: "همه آثار آقایان", labelEn: "All Men's", labelAr: "جميع قطع الرجال", icon: <AllCollectionsIcon className="w-3.5 h-3.5" /> },
    { id: "rings", labelFa: "انگشتر مردانه", labelEn: "Men's Rings", labelAr: "خواتم رجالية", icon: <RingIcon className="w-3.5 h-3.5" /> },
    { id: "bracelets", labelFa: "دستبند مردانه", labelEn: "Men's Bracelets", labelAr: "أساور رجالية", icon: <BraceletIcon className="w-3.5 h-3.5" /> },
    { id: "necklaces", labelFa: "گردنبند و گردن‌آویز مردانه", labelEn: "Men's Necklaces", labelAr: "قلائد رجالية", icon: <NecklaceIcon className="w-3.5 h-3.5" /> },
  ];

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

        {/* Category / Collection Sub-Navigation Pills */}
        {activeFilter === "women" || activeFilter === "men" ? (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {(activeFilter === "women" ? womenTabs : menTabs).map((tab) => {
              const isSelected = activeSub === tab.id;
              const label = language === "fa" ? tab.labelFa : language === "ar" ? tab.labelAr : tab.labelEn;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectSubFilter(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? "bg-[#660000] text-white border-[#660000] shadow-sm"
                      : "bg-white text-zinc-700 border-zinc-300 hover:border-[#C4852B]"
                  }`}
                >
                  {tab.icon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        ) : activeFilter === "sets" || activeFilter === "chains" ? (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <span className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#660000] text-white border border-[#660000] shadow-sm flex items-center gap-2">
              {activeFilter === "sets" ? <JewelrySetIcon className="w-3.5 h-3.5" /> : <GemstoneIcon className="w-3.5 h-3.5" />}
              <span>{getPageTitle()}</span>
            </span>
            <button
              type="button"
              onClick={() => handleSelectCategory(null)}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 bg-white text-zinc-700 border-zinc-300 hover:border-[#C4852B]"
            >
              <AllCollectionsIcon className="w-3.5 h-3.5" />
              <span>{allLabel}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {/* All category pill */}
            <button
              type="button"
              onClick={() => handleSelectCategory(null)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 ${
                selectedCategoryId === null && !activeFilter
                  ? "bg-[#660000] text-white border-[#660000] shadow-sm" 
                  : "bg-white text-zinc-700 border-zinc-300 hover:border-[#C4852B]"
              }`}
            >
              <AllCollectionsIcon className="w-3.5 h-3.5" />
              <span>{allLabel}</span>
            </button>

            {/* Dynamic categories from backend */}
            {categories.map((cat) => {
              const catName = language === "fa" ? cat.name : translateDynamicText(cat.name, language);
              const isSelected = selectedCategoryId === cat.id && !activeFilter;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 ${
                    isSelected 
                      ? "bg-[#660000] text-white border-[#660000] shadow-sm" 
                      : "bg-white text-zinc-700 border-zinc-300 hover:border-[#C4852B]"
                  }`}
                >
                  {getCategorySvgIcon(cat.name, cat.id, "w-3.5 h-3.5")}
                  <span>{catName}</span>
                </button>
              );
            })}
          </div>
        )}

        {isLoadingProducts ? (
          <div className="py-20 text-center text-xs text-zinc-500">
            در حال دریافت محصولات از سرور...
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">{getEmptyStateMessage()}</p>
            <button
              type="button"
              onClick={() => handleSelectCategory(null)}
              className="px-5 py-2.5 bg-[#660000] hover:bg-[#7D0000] text-white text-xs rounded-lg font-semibold cursor-pointer transition-colors"
            >
              {language === "fa" ? "مشاهده تمامی محصولات" : language === "ar" ? "عرض جميع المنتجات" : "View All Products"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {displayedProducts.map((product) => {
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
                    <img 
                      src={product.image} 
                      alt={prodName} 
                      loading="lazy" 
                      decoding="async" 
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500" 
                    />
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
        )}

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">بارگذاری فروشگاه...</div>}>
      <ShopContent />
    </Suspense>
  );
}
