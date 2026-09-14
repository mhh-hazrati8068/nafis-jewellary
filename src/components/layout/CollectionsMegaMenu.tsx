"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { getProductName, getProductMaterial, translateDynamicText } from "@/lib/dynamicTranslator";

export default function CollectionsMegaMenu() {
  const { categories, products, fetchCategories, fetchProducts, language, t } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  // Helper to map category name to icon
  const getCategoryIcon = (name: string, id: number) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("انگشتر") || lower.includes("حلقه") || lower.includes("ring") || id === 2) return "💍";
    if (lower.includes("گردنبند") || lower.includes("آویز") || lower.includes("necklace") || id === 3) return "📿";
    if (lower.includes("دستبند") || lower.includes("bracelet") || id === 1) return "✨";
    if (lower.includes("گوشواره") || lower.includes("earring") || id === 4) return "💎";
    return "💠";
  };

  // Helper to get category link
  const getCategoryHref = (name: string, id: number) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("انگشتر") || id === 2) return "/rings";
    if (lower.includes("گردنبند") || id === 3) return "/necklaces";
    if (lower.includes("دستبند") || id === 1) return "/bracelets";
    if (lower.includes("گوشواره") || id === 4) return "/earrings";
    return `/shop?category=${id}`;
  };

  // Dynamic Categories from Backend API
  const apiCategories = categories && categories.length > 0
    ? categories
    : [
        { id: 1, name: "دستبند", description: "دستبندهای نقره دست‌ساز و فاخر" },
        { id: 2, name: "انگشتر", description: "انگشترهای نگین‌دار و نقره اصیل" },
        { id: 3, name: "گردنبند", description: "گردنبند و آویزهای نقره نفیس" },
        { id: 4, name: "گوشواره", description: "گوشواره‌های دست‌ساز هنری" }
      ];

  const safeIndex = Math.min(selectedIndex, apiCategories.length - 1);
  const activeCategory = apiCategories[safeIndex] || apiCategories[0];

  // Dynamically find a real product from the active API category
  const sampleProduct = products.find((p) => {
    const catName = (activeCategory.name || "").toLowerCase();
    return (
      (p.categoryFa && p.categoryFa.toLowerCase().includes(catName)) ||
      (p.nameFa && p.nameFa.toLowerCase().includes(catName)) ||
      (catName.includes("انگشتر") && p.category === "rings") ||
      (catName.includes("گردنبند") && p.category === "necklaces") ||
      (catName.includes("دستبند") && p.category === "bracelets") ||
      (catName.includes("گوشواره") && p.category === "earrings")
    );
  }) || products[0];

  const getLocalizedCategoryName = (name: string) => {
    if (language === "fa") return name;
    return translateDynamicText(name, language);
  };

  const getLocalizedCategoryDesc = (desc?: string, name?: string) => {
    if (language === "fa") {
      return desc || `مجموعه زیورآلات نقره ۹۲۵ دست‌ساز در دسته‌بندی ${name || ""}`;
    }
    if (language === "ar") {
      return `مجموعة حصرية من الفضة الاسترليني 925 المصوغة يدوياً`;
    }
    return `Exclusive handcrafted 925 sterling silver ${name || "creations"}`;
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Nav Link Trigger */}
      <Link
        href="/collections"
        className={`flex items-center gap-1 py-2 font-semibold text-[13px] transition-colors relative group cursor-pointer ${
          isOpen ? "text-[#C4852B]" : "text-zinc-800 hover:text-[#C4852B]"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{t.header.collections}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-3.5 h-3.5 transition-transform duration-250 ${
            isOpen ? "rotate-180 text-[#C4852B]" : "text-zinc-500 group-hover:text-[#C4852B]"
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>

        {/* Hover underline animation */}
        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-[#C4852B] transition-all duration-300 ${
            isOpen ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </Link>

      {/* Floating Mega Menu Dropdown */}
      <div
        className={`fixed md:absolute top-full start-1/2 -translate-x-1/2 md:start-0 md:translate-x-0 rtl:md:start-auto rtl:md:right-[-120px] pt-3 z-50 transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-2 pointer-events-none invisible"
        }`}
      >
        <div className="w-[740px] lg:w-[820px] max-w-[94vw] bg-white/98 dark:bg-[#FAF9F5]/98 backdrop-blur-xl rounded-3xl p-6 border border-[#C4852B]/35 shadow-[0_20px_60px_rgba(0,0,0,0.14)] grid grid-cols-12 gap-6 overflow-hidden">
          
          {/* Column 1: Dynamic Categories List from Backend API (7 of 12 cols) */}
          <div className="col-span-7 flex flex-col justify-between border-e border-[#C4852B]/20 pe-6">
            <div>
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A06314] flex items-center gap-1.5 font-sans">
                  <span>✨</span>
                  <span>
                    {language === "fa"
                      ? "دسته‌بندی‌های رسمی فروشگاه"
                      : language === "ar"
                      ? "تصنيفات المتجر الرسمية"
                      : "Official API Categories"}
                  </span>
                </span>
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-bold text-[#660000] hover:text-[#C4852B] transition-colors"
                >
                  {language === "fa" ? "مشاهده همه ←" : language === "ar" ? "عرض الكل ←" : "All Products →"}
                </Link>
              </div>

              {/* Dynamic Categories Interactive List */}
              <div className="space-y-1.5">
                {apiCategories.map((cat, idx) => {
                  const isHovered = selectedIndex === idx;
                  const catName = getLocalizedCategoryName(cat.name);
                  const catDesc = getLocalizedCategoryDesc(cat.description, cat.name);
                  const catHref = getCategoryHref(cat.name, cat.id);
                  const icon = getCategoryIcon(cat.name, cat.id);

                  return (
                    <Link
                      key={cat.id}
                      href={catHref}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 text-start group cursor-pointer ${
                        isHovered
                          ? "bg-[#C4852B]/12 border border-[#C4852B]/40 shadow-2xs translate-x-1 rtl:-translate-x-1"
                          : "hover:bg-zinc-100/80 dark:hover:bg-[#F4F1EA] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0 p-1.5 rounded-xl bg-white/80 shadow-2xs">
                          {icon}
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`font-bold text-[13px] leading-snug transition-colors ${
                              isHovered ? "text-[#660000] dark:text-[#A06314]" : "text-zinc-900 group-hover:text-[#C4852B]"
                            }`}
                          >
                            {catName}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-medium leading-normal line-clamp-1">
                            {catDesc}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-xs transition-transform duration-200 shrink-0 ${
                          isHovered ? "text-[#C4852B] translate-x-1 rtl:-translate-x-1" : "text-zinc-400 group-hover:text-zinc-600"
                        }`}
                      >
                        {language === "en" ? "→" : "←"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Quick Links Banner */}
            <div className="pt-3 mt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
              <span className="text-zinc-500 font-medium">
                {language === "fa" ? "🛡️ ضمانت اصالت نقره ۹۲۵ و فاکتور رسمی" : language === "ar" ? "🛡️ ضمان أصالة الفضة 925" : "🛡️ Certified 925 Silver Authenticity"}
              </span>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="font-bold text-[#C4852B] hover:underline"
              >
                {t.header.aboutUs}
              </Link>
            </div>
          </div>

          {/* Column 2: Dynamic Sample Product from Active API Category (5 of 12 cols) */}
          <div className="col-span-5 flex flex-col justify-between bg-white dark:bg-[#FAF9F5] p-4 rounded-2xl border border-[#C4852B]/25 shadow-sm">
            {sampleProduct ? (
              <div>
                {/* Product Badge / Category Tag */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#660000]/10 text-[#660000] text-[10px] font-bold tracking-wider">
                    {getLocalizedCategoryName(activeCategory.name)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#C4852B]/15 text-[#A06314] text-[10px] font-bold">
                    {getProductMaterial(sampleProduct, language)}
                  </span>
                </div>

                {/* Sample Product Image */}
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80 mb-3 group">
                  <Image
                    src={sampleProduct.image}
                    alt={getProductName(sampleProduct, language)}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />
                  <div className="absolute bottom-2 start-2 end-2 flex justify-between items-end text-white">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs font-mono">
                      SILVER 925
                    </span>
                  </div>
                </div>

                {/* Sample Product Title */}
                <h4 className="font-bold text-xs sm:text-sm text-zinc-950 line-clamp-2 leading-snug mb-2">
                  {getProductName(sampleProduct, language)}
                </h4>

                {/* Live Price */}
                <div className="flex items-baseline gap-1.5 text-[#660000] font-bold font-mono text-sm">
                  <span className="text-zinc-500 font-sans text-[11px] font-medium">
                    {language === "fa" ? "قیمت:" : language === "ar" ? "السعر:" : "Price:"}
                  </span>
                  <span>{sampleProduct.price.toLocaleString()} تومان</span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-zinc-400">
                در حال دریافت نمونه محصول...
              </div>
            )}

            {/* Direct CTA Link to the Selected Category */}
            <Link
              href={getCategoryHref(activeCategory.name, activeCategory.id)}
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#660000] hover:bg-[#7D0000] text-white font-bold text-xs text-center transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>
                {language === "fa"
                  ? `مشاهده زیورآلات ${getLocalizedCategoryName(activeCategory.name)}`
                  : language === "ar"
                  ? `استعراض ${getLocalizedCategoryName(activeCategory.name)}`
                  : `Explore ${getLocalizedCategoryName(activeCategory.name)}`}
              </span>
              <span>{language === "en" ? "→" : "←"}</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
