"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { translateDynamicText } from "@/lib/dynamicTranslator";
import { MotionFadeIn, MotionStaggerContainer, MotionStaggerItem, TiltCard } from "@/components/ui/MotionWrappers";

export default function CategoryGrid() {
  const { t, language, categories, products, fetchCategories, fetchProducts } = useAppStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const defaultCategoryImages: Record<string, string> = {
    "انگشتر": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop",
    "گردنبند": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
    "دستبند": "https://images.unsplash.com/photo-1611591475143-4f8a09e08390?q=80&w=1000&auto=format&fit=crop",
    "گوشواره": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop"
  };

  const getCategoryHref = (name: string, id: number) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("انگشتر") || id === 2) return "/rings";
    if (lower.includes("گردنبند") || id === 3) return "/necklaces";
    if (lower.includes("دستبند") || id === 1) return "/bracelets";
    if (lower.includes("گوشواره") || id === 4) return "/earrings";
    return `/shop?category=${id}`;
  };

  const apiCats = categories && categories.length > 0 ? categories : [
    { id: 1, name: "دستبند", description: "دستبندهای نقره دست‌ساز و فاخر" },
    { id: 2, name: "انگشتر", description: "انگشترهای نگین‌دار و نقره اصیل" },
    { id: 3, name: "گردنبند", description: "گردنبند و آویزهای نقره نفیس" },
    { id: 4, name: "گوشواره", description: "گوشواره‌های دست‌ساز هنری" }
  ];

  const categoryCards = apiCats.map((cat, idx) => {
    const matchingProd = products.find(p => 
      p.categoryFa?.includes(cat.name) || 
      p.nameFa?.includes(cat.name)
    );
    const img = matchingProd?.image || defaultCategoryImages[cat.name] || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop";
    const href = getCategoryHref(cat.name, cat.id);
    const colSpan = idx === 0 || idx === apiCats.length - 1 ? "col-span-1 lg:col-span-2" : "col-span-1";
    
    return {
      id: cat.id,
      title: language === 'fa' ? cat.name : translateDynamicText(cat.name, language),
      subtitle: cat.description || (language === 'fa' ? 'نقره استرلینگ ۹۲۵ دست‌ساز' : 'Handcrafted 925 Silver'),
      href,
      image: img,
      colSpan
    };
  });

  return (
    <section className="py-20 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Section Title */}
        <MotionFadeIn direction="up" className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-2 block font-mono">
            {t.categories.tag}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight">
            {t.categories.title}
          </h2>
        </MotionFadeIn>

        {/* Categories Grid */}
        <MotionStaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {categoryCards.map((cat) => (
            <MotionStaggerItem key={cat.id} className={cat.colSpan}>
              <TiltCard className="h-full">
                <Link 
                  href={cat.href}
                  className="group relative h-[320px] sm:h-[380px] rounded-3xl overflow-hidden border border-zinc-200 luxury-card-hover shadow-sm block w-full"
                >
                  {/* Image */}
                  <img 
                    src={cat.image} 
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816]/90 via-[#1A1816]/25 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex flex-col justify-end">
                    <span className="text-[10px] text-[#C4852B] font-mono uppercase tracking-[0.25em] mb-1 font-semibold">
                      {cat.subtitle}
                    </span>
                    
                    <h3 className="text-2xl sm:text-3xl font-bold text-white uppercase mb-4 tracking-wide group-hover:text-[#C4852B] transition-colors">
                      {cat.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-[0.2em]">
                      <span>{t.categories.discover}</span>
                      <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </MotionStaggerItem>
          ))}
        </MotionStaggerContainer>

      </div>
    </section>
  );
}
