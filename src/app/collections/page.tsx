"use client";

import { useEffect, useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { getProductName, getProductMaterial } from "@/lib/dynamicTranslator";
import { mapBackendToFrontend } from "@/lib/productMapper";
import { filterProductsByCollection, isBraceletOnlyProduct, matchesCategoryKeyword } from "@/lib/categoryFilters";
import WishlistButton from "@/components/product/WishlistButton";
import { RingIcon, NecklaceIcon, BraceletIcon, GemstoneIcon, AllCollectionsIcon } from "@/components/icons/JewelryIcons";

export default function CollectionsPage() {
  const { products, backendProducts, categories, fetchProducts, fetchCategories, language, addToCart, t } = useAppStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts(null);
  }, [fetchCategories, fetchProducts]);

  const allProducts = useMemo(() => {
    if (backendProducts && backendProducts.length > 0) {
      return backendProducts.map(mapBackendToFrontend);
    }
    return products;
  }, [backendProducts, products]);

  const baseCollections = useMemo(() => {
    const curated = [
      {
        id: "men",
        titleFa: "کالکشن فاخر مردانه (آقایان)",
        titleEn: "Men's Heritage Collection",
        titleAr: "مجموعة الرجال الفاخرة",
        subtitleFa: "آثار و زیورآلات اختصاصی مردانه و آقایان",
        subtitleEn: "Handcrafted Men's 925 Silver & Agate",
        subtitleAr: "قطع فضة رجالية فاخرة",
        descriptionFa: "تمامی محصولات و آثار دارای عنوان مردانه و طراحی‌شده با نقره استرلینگ ۹۲۵، عقیق یمنی و دُرّ نجف اصیل.",
        descriptionEn: "All handcrafted 925 sterling silver pieces tailored for the Men's collection.",
        descriptionAr: "تشكيلة الفضة الإسترلينية 925 والأحجار الكريمة المخصصة للرجال.",
        image: "/images/hero-silver-ring-light.jpg",
        href: "/shop?filter=men",
        items: filterProductsByCollection(allProducts, "men"),
      },
      {
        id: "women",
        titleFa: "کالکشن تخصصی بانوان (زنانه)",
        titleEn: "Women's High Jewellery",
        titleAr: "مجموعة السيدات الراقية",
        subtitleFa: "گردنبند، انگشتر و دستبندهای ظریف بانوان",
        subtitleEn: "Delicate 925 Silver & Natural Gems",
        subtitleAr: "مجوهرات فضية نسائية ناعمة",
        descriptionFa: "مجموعه زیورآلات ظریف و اختصاصی بانوان با طراحی مینیمال نقره ۹۲۵، سنگ‌های قرآنی و عقیق‌های کمیاب طبیعی.",
        descriptionEn: "Fine 925 sterling silver creations thoughtfully proportioned for women.",
        descriptionAr: "تصاميم نسائية أنيقة من الفضة الإسترلينية 925 والأحجار الطبيعية النادرة.",
        image: "/images/campaign_agate_necklace_alt.jpg",
        href: "/shop?filter=women",
        items: filterProductsByCollection(allProducts, "women"),
      },
      {
        id: "rings",
        titleFa: "کالکشن انگشترهای نقره ۹۲۵، عقیق و دُرّ نجف",
        titleEn: "Fine 925 Silver & Agate Ring Collection",
        titleAr: "مجموعة خواتم الفضة 925 والعقيق ودر النجف",
        subtitleFa: "پیوند سنگ دُرّ نجف، عقیق و نقره استرلینگ",
        subtitleEn: "Yemeni Agate, Durr-e Najaf & Fine Silver Fusion",
        subtitleAr: "تناغم العقيق اليماني ودر النجف مع الفضة الإسترلينية",
        descriptionFa: "مجموعه‌ای باشکوه از انگشترهای دست‌ساز نقره خالص ۹۲۵، دُرّ نجف طبیعی و عقیق اصیل که با ظرافت استادکاران زرگر خلق شده‌اند.",
        descriptionEn: "A curated collection of handcrafted solid 925 sterling silver rings set with natural Yemeni agate and Durr-e Najaf.",
        descriptionAr: "تشكيلة ساحرة من الخواتم المصوغة يدوياً بالفضة الإسترلينية 925 وأحجار العقيق الطبيعي ودر النجف.",
        image: "/images/campaign_agate_hand_ring.jpg",
        href: "/shop?categoryId=2",
        items: allProducts.filter((p) => p.category === "rings" || matchesCategoryKeyword(p, "انگشتر")),
      },
      {
        id: "necklaces",
        titleFa: "کالکشن گردنبند و آویزهای عقیق",
        titleEn: "Necklace & Agate Pendant Collection",
        titleAr: "مجموعة قلائد ومداليات العقيق",
        subtitleFa: "درخشش نقره ۹۲۵ و عقیق سرخ طبیعی",
        subtitleEn: "Authentic Agate & 925 Silver Elegance",
        subtitleAr: "بريق الفضة الإسترلينية والأحجار الكريمة",
        descriptionFa: "آویزهای مدال سنگ عقیق سرخ و نقره ۹۲۵ دست‌ساز با تراش اختصاصی و قلم‌زنی سنتی.",
        descriptionEn: "Agate gemstone pendant necklaces framed in 925 sterling silver with master craftsmanship.",
        descriptionAr: "قلائد ومداليات بحجر العقيق الأحمر الطبيعي وصياغة فضية يدوية دقيقة.",
        image: "/images/atelier_craft_detail.jpg",
        href: "/shop?categoryId=3",
        items: allProducts.filter((p) => p.category === "necklaces" || matchesCategoryKeyword(p, "گردنبند") || matchesCategoryKeyword(p, "گردن آویز")),
      },
      {
        id: "bracelets",
        titleFa: "کالکشن دستبندهای نقره",
        titleEn: "Silver Bracelet Collection",
        titleAr: "مجموعة الأساور الفضية",
        subtitleFa: "بافت‌های اختصاصی با قفل ایمن",
        subtitleEn: "Custom Weave & Precision Silver Work",
        subtitleAr: "حبكات خاصة وأقفال فائقة الأمان",
        descriptionFa: "دستبندهای نقره ۹۲۵ با زنجیره‌های محکم، نگین عقیق یمنی و صیقل آینه‌ای زرگری.",
        descriptionEn: "Solid 925 silver bracelets with custom links, Yemeni agate, and mirror finishing.",
        descriptionAr: "أساور فضية مصقولة ومتينة مصممة وفق أعلى معايير الجودة.",
        image: "/images/campaign_silver_bracelet.jpg",
        href: "/shop?categoryId=1",
        items: allProducts.filter(isBraceletOnlyProduct),
      },
      {
        id: "stones",
        titleFa: "سنگ‌های قرآنی اعماد",
        titleEn: "E'mad Quranic Gemstones",
        titleAr: "أحجار عماد القرآنية",
        subtitleFa: "سنگ‌های اصیل مزین به حکاکی میکروسکوپی کل قرآن",
        subtitleEn: "Whole Holy Quran Inscribed Gemstones",
        subtitleAr: "أحجار كريمة منقوشة بكامل القرآن الكريم",
        descriptionFa: "سنگ‌های اصیل عقیق یمنی و دُرّ نجف مزین به آیات کل قرآن کریم با ضمانت مرجوعی شرکت اعماد.",
        descriptionEn: "Authentic natural agates and Durr-e Najaf microscopically inscribed with the complete Holy Quran.",
        descriptionAr: "أحجار العقيق اليماني ودر النجف المنقوشة بكامل آيات القرآن الكريم.",
        image: "/images/brand_atelier_story.jpg",
        href: "/shop?categoryId=6",
        items: filterProductsByCollection(allProducts, "stones"),
      },
    ];

    // Also include any custom backend categories created dynamically by Admin whose keyword isn't already represented
    const standardNames = ["دستبند", "انگشتر", "گردنبند", "سنگ"];
    const customCols = categories
      .filter((c) => !standardNames.some((std) => c.name.includes(std)))
      .map((c) => ({
        id: `cat-${c.id}`,
        titleFa: c.name,
        titleEn: c.name,
        titleAr: c.name,
        subtitleFa: "دسته‌بندی اختصاصی فروشگاه",
        subtitleEn: "Custom Store Collection",
        subtitleAr: "فئة خاصة",
        descriptionFa: c.description || `آثار و محصولات مرتبط با ${c.name}`,
        descriptionEn: c.description || `Curated creations matching ${c.name}`,
        descriptionAr: c.description || c.name,
        image: "/images/luxury_jewelry_box.jpg",
        href: `/shop?categoryId=${c.id}`,
        items: allProducts.filter((p) => p.categoryId === c.id || matchesCategoryKeyword(p, c.name)),
      }))
      .filter((col) => col.items.length > 0);

    return [...curated, ...customCols];
  }, [allProducts, categories]);

  const getPageTag = () => {
    if (language === 'fa') return 'کالکشن‌های اختصاصی ۲۰۲۶';
    if (language === 'ar') return 'المجموعات الحصرية 2026';
    return '2026 Signature Collections';
  };

  const getPageDesc = () => {
    if (language === 'fa') return 'ورود به دنیای هنر و زیورآلات نفیسه عبادی؛ هر کالکشن مجموعه‌ای هماهنگ از اصالت نقره ۹۲۵، سنگ‌های اصیل عقیق طبیعی و دُرّ نجف است.';
    if (language === 'ar') return 'ادخل عالم الإبداع مع مجوهرات نفيسة عبادي؛ كل مجموعة تروي حكاية فريدة من فخامة الفضة الإسترلينية 925 والأحجار الكريمة النادرة.';
    return 'Enter the world of Nafise Ebadi Jewellery; each collection brings together cohesive pieces in 925 sterling silver and natural gemstones.';
  };

  const getChapterIcon = (id: string) => {
    if (id === 'rings') return <RingIcon className="w-4.5 h-4.5 text-[#C4852B]" />;
    if (id === 'necklaces') return <NecklaceIcon className="w-4.5 h-4.5 text-[#C4852B]" />;
    if (id === 'bracelets') return <BraceletIcon className="w-4.5 h-4.5 text-[#C4852B]" />;
    if (id === 'stones') return <GemstoneIcon className="w-4.5 h-4.5 text-[#C4852B]" />;
    return <AllCollectionsIcon className="w-4.5 h-4.5 text-[#C4852B]" />;
  };

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
            {getPageTag()}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase mb-6 leading-tight">
            {t.header.collections}
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>
          <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
            {getPageDesc()}
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {baseCollections.map((col, idx) => {
            const title = language === 'fa' ? col.titleFa : language === 'ar' ? col.titleAr : col.titleEn;
            const subtitle = language === 'fa' ? col.subtitleFa : language === 'ar' ? col.subtitleAr : col.subtitleEn;
            const desc = language === 'fa' ? col.descriptionFa : language === 'ar' ? col.descriptionAr : col.descriptionEn;

            return (
              <div key={col.id} className="flex flex-col gap-10 border-b border-[#C4852B]/20 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-200 shadow-lg bg-[#F4F1EA] group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={col.image} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700" />
                    <span className="absolute bottom-4 start-4 font-mono text-[10px] text-[#1A1816] bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C4852B]/30 font-bold">
                      CHAPTER {idx + 1} • {col.items.length} {language === 'fa' ? 'اثر' : 'PIECES'}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      {getChapterIcon(col.id)}
                      <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase font-bold">
                        {subtitle}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold uppercase mb-4 text-zinc-950">
                      {title}
                    </h2>
                    <p className="text-xs md:text-sm text-[#626667] leading-relaxed mb-6">
                      {desc}
                    </p>
                    <div>
                      <Link
                        href={col.href}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#660000] hover:text-[#C4852B] transition-colors"
                      >
                        <span>{language === 'fa' ? 'مشاهده محصولات این کالکشن' : 'Explore Collection'}</span>
                        <svg className="w-3.5 h-3.5 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                {col.items.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
                    {col.items.map((product) => {
                      const prodName = getProductName(product, language);
                      const prodMaterial = getProductMaterial(product, language);

                      return (
                        <div
                          key={`${col.id}-${product.id}`}
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
