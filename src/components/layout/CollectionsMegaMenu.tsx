"use client";

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { mapBackendToFrontend } from "@/lib/productMapper";
import { getProductName, getProductMaterial, translateDynamicText } from "@/lib/dynamicTranslator";
import { getCategorySvgIcon, SparkleStarIcon, SilverShieldIcon } from "@/components/icons/JewelryIcons";

export default function CollectionsMegaMenu() {
  const { categories, products, backendProducts, language, t } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  // Helper to get category link
  const getCategoryHref = (id: number) => `/shop?categoryId=${id}`;

  // Dynamic Categories from Backend API
  const apiCategories = categories && categories.length > 0
    ? categories
    : [
        { id: 1, name: "دستبند", description: "دستبندهای نقره دست‌ساز و فاخر" },
        { id: 2, name: "انگشتر", description: "انگشترهای نگین‌دار و نقره اصیل" },
        { id: 3, name: "گردنبند", description: "گردنبند و آویزهای نقره نفیس" },
        { id: 4, name: "گوشواره", description: "گوشواره‌های دست‌ساز هنری" }
      ];

  const safeIndex = Math.min(selectedIndex, Math.max(0, apiCategories.length - 1));
  const activeCategory = apiCategories[safeIndex] || apiCategories[0];

  // Always prefer full cached backend catalog so hovering works even when viewing an empty category page
  const catalogProducts = useMemo(() => {
    if (backendProducts && backendProducts.length > 0) {
      return backendProducts.map(mapBackendToFrontend);
    }
    return products;
  }, [backendProducts, products]);

  const sampleProduct = useMemo(() => {
    const catName = (activeCategory.name || "").toLowerCase();
    return (
      catalogProducts.find((p) => (
        p.categoryId === activeCategory.id ||
        (p.categoryFa && p.categoryFa.toLowerCase().includes(catName)) ||
        (p.nameFa && p.nameFa.toLowerCase().includes(catName)) ||
        (catName.includes("انگشتر") && p.category === "rings") ||
        (catName.includes("گردنبند") && p.category === "necklaces") ||
        (catName.includes("دستبند") && p.category === "bracelets") ||
        (catName.includes("گوشواره") && p.category === "earrings")
      )) || catalogProducts[0]
    );
  }, [activeCategory, catalogProducts]);

  const getLocalizedCategoryName = (name: string) => {
    if (language === "fa") return name;
    return translateDynamicText(name, language);
  };

  const getLocalizedCategoryDesc = (desc?: string, name?: string) => {
    if (language === "fa") {
      return desc || `مجموعه زیورآلات نقره ۹۲۵ دست‌ساز در دسته‌بندی ${name || ""}`;
    }
    if (language === "ar") {
      return "مجموعة حصرية من الفضة الاسترليني 925 المصوغة يدوياً";
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
        onClick={() => setIsOpen(false)}
        className={`flex items-center gap-1.5 py-2 font-semibold text-[13px] transition-colors relative group cursor-pointer ${
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
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#C4852B]" : "text-zinc-500 group-hover:text-[#C4852B]"
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>

        <span
          className={`absolute bottom-0 left-0 h-0.5 bg-[#C4852B] transition-all duration-300 ${
            isOpen ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>

      {/* Floating Mega Menu Dropdown */}
      <div
        className={`fixed md:absolute top-full start-1/2 -translate-x-1/2 md:start-0 md:translate-x-0 rtl:md:translate-x-0 pt-3 z-50 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto visible"
            : "opacity-0 -translate-y-1.5 pointer-events-none invisible"
        }`}
      >
        <div className="w-[min(780px,calc(100vw-2rem))] bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-[#C4852B]/25 shadow-[0_20px_50px_rgba(26,24,22,0.12)] grid grid-cols-12 gap-5 overflow-hidden">

          {/* Column 1: Dynamic Categories List from Backend API (7 of 12 cols) */}
          <div className="col-span-7 flex flex-col justify-between border-e border-zinc-200/70 pe-5">
            <div>
              <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-zinc-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9C6518] flex items-center gap-1.5 font-sans">
                  <SparkleStarIcon className="w-3.5 h-3.5 text-[#C4852B]" />
                  <span>
                    {language === "fa"
                      ? "دسته‌بندی‌های رسمی کارگاه"
                      : language === "ar"
                      ? "تصنيفات المتجر الرسمية"
                      : "Official Collections"}
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

              {/* Scrollable Categories List */}
              <div className="space-y-1.5 max-h-[320px] overflow-y-auto overscroll-contain pe-1">
                {apiCategories.map((cat, idx) => {
                  const isHovered = safeIndex === idx;
                  const catName = getLocalizedCategoryName(cat.name);
                  const catDesc = getLocalizedCategoryDesc(cat.description, cat.name);
                  const catHref = getCategoryHref(cat.id);

                  return (
                    <Link
                      key={cat.id}
                      href={catHref}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-colors duration-200 text-start group cursor-pointer ${
                        isHovered
                          ? "bg-[#FAF9F5] border border-[#C4852B]/35 shadow-2xs"
                          : "hover:bg-[#FAF9F5]/70 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors duration-200 ${
                          isHovered
                            ? "bg-[#660000] text-white border-[#660000]"
                            : "bg-white text-[#9C6518] border-[#C4852B]/20"
                        }`}>
                          {getCategorySvgIcon(cat.name, cat.id, "w-4.5 h-4.5")}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span
                            className={`font-bold text-[13px] leading-snug transition-colors truncate ${
                              isHovered ? "text-[#660000]" : "text-zinc-900"
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
                        className={`text-xs transition-colors duration-200 shrink-0 ${
                          isHovered ? "text-[#660000]" : "text-zinc-400"
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
            <div className="pt-3 mt-3 border-t border-zinc-100 flex items-center justify-between text-[11px]">
              <span className="text-zinc-600 font-medium flex items-center gap-1.5">
                <SilverShieldIcon className="w-3.5 h-3.5 text-[#C4852B]" />
                <span>
                  {language === "fa" ? "ضمانت اصالت نقره ۹۲۵ و فاکتور رسمی" : language === "ar" ? "ضمان أصالة الفضة 925" : "Certified 925 Silver Authenticity"}
                </span>
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
          <div className="col-span-5 flex flex-col justify-between bg-[#FAF9F5] p-4 rounded-2xl border border-zinc-200/80">
            {sampleProduct ? (
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#660000]/10 text-[#660000] text-[10px] font-bold tracking-wider">
                    {getLocalizedCategoryName(activeCategory.name)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-[#C4852B]/25 text-[#9C6518] text-[10px] font-bold">
                    {getProductMaterial(sampleProduct, language)}
                  </span>
                </div>

                <div className="relative w-full aspect-square max-h-44 rounded-xl overflow-hidden bg-white border border-zinc-200/70 p-2.5 mb-3 group">
                  <Image
                    src={sampleProduct.image}
                    alt={getProductName(sampleProduct, language)}
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-2 start-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/85 backdrop-blur-md border border-[#C4852B]/25 text-[#1A1816] font-mono">
                    SILVER 925
                  </span>
                </div>

                <h4 className="font-bold text-xs sm:text-sm text-zinc-950 line-clamp-2 leading-snug mb-2">
                  {getProductName(sampleProduct, language)}
                </h4>

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

            <Link
              href={getCategoryHref(activeCategory.id)}
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#660000] hover:bg-[#7D0000] text-white font-bold text-xs text-center transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
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
