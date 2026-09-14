"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";

interface CollectionItem {
  id: string;
  href: string;
  nameFa: string;
  nameEn: string;
  nameAr: string;
  descFa: string;
  descEn: string;
  descAr: string;
  icon: string;
  sampleProduct: {
    nameFa: string;
    nameEn: string;
    nameAr: string;
    image: string;
    priceFa: string;
    priceEn: string;
    priceAr: string;
    tagFa: string;
    tagEn: string;
    tagAr: string;
    stoneFa: string;
    stoneEn: string;
    stoneAr: string;
  };
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: "rings",
    href: "/rings",
    nameFa: "انگشترهای نقره ۹۲۵",
    nameEn: "925 Silver Rings",
    nameAr: "خواتم فضة 925",
    descFa: "حلقه‌ها و انگشترهای دست‌ساز با فیروزه و عقیق",
    descEn: "Handcrafted bands & rings with turquoise and agate",
    descAr: "خواتم ودبلات صياغة يدوية مع الفيروز والعقيق",
    icon: "💍",
    sampleProduct: {
      nameFa: "انگشتر نقره ۹۲۵ دست‌ساز با نگین فیروزه نیشابور اصل",
      nameEn: "Handcrafted 925 Silver Ring with Neyshabur Turquoise",
      nameAr: "خاتم فضة 925 مع حجر الفيروز النيسابوري الأصلي",
      image: "https://images.unsplash.com/photo-1599643478524-fb66f70a9578?q=80&w=800&auto=format&fit=crop",
      priceFa: "۶,۳۷۴,۰۰۰ تومان",
      priceEn: "6,374,000 Toman",
      priceAr: "6,374,000 تومان",
      tagFa: "کالکشن دست‌ساز",
      tagEn: "Handcrafted Collection",
      tagAr: "مجموعة يدوية",
      stoneFa: "فیروزه اصل نیشابور",
      stoneEn: "Neyshabur Turquoise",
      stoneAr: "فيروز نيسابوري طبيعي",
    },
  },
  {
    id: "necklaces",
    href: "/necklaces",
    nameFa: "گردنبندهای نقره",
    nameEn: "Silver Necklaces",
    nameAr: "قلائد وسلاسل فضة",
    descFa: "آویزها و سینه‌ریزهای نقره استرلینگ با عقیق یمنی",
    descEn: "Sterling silver pendants and natural Yemeni agate",
    descAr: "قلائد بحجر العقيق اليماني والفضة الاسترليني",
    icon: "📿",
    sampleProduct: {
      nameFa: "گردنبند مدال عقیق یمنی و نقره ۹۲۵ دست‌ساز",
      nameEn: "Authentic Yemeni Agate 925 Silver Pendant",
      nameAr: "قلادة فضة 925 مع مدالية عقيق يماني طبيعي",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
      priceFa: "۴,۹۵۰,۰۰۰ تومان",
      priceEn: "4,950,000 Toman",
      priceAr: "4,950,000 تومان",
      tagFa: "نقره و سنگ معدنی",
      tagEn: "Silver & Gemstones",
      tagAr: "فضة وأحجار طبيعية",
      stoneFa: "عقیق سرخ یمنی",
      stoneEn: "Red Yemeni Agate",
      stoneAr: "عقيق يماني أحمر",
    },
  },
  {
    id: "bracelets",
    href: "/bracelets",
    nameFa: "دستبندهای نقره",
    nameEn: "Silver Bracelets",
    nameAr: "أساور فضة صياغة يدوية",
    descFa: "دستبندهای زنجیری، کارتیه و بافت دست‌ساز نقره",
    descEn: "Hand-braided, link and chain silver bracelets",
    descAr: "أساور جنزير وتصاميم حديثة من الفضة 925",
    icon: "✨",
    sampleProduct: {
      nameFa: "دستبند زنجیری نقره ۹۲۵ دست‌ساز با بافت اختصاصی",
      nameEn: "925 Sterling Silver Handcrafted Link Bracelet",
      nameAr: "سوار جنزير فضة إسترليني 925 متقن الصنع",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      priceFa: "۳,۸۹۰,۰۰۰ تومان",
      priceEn: "3,890,000 Toman",
      priceAr: "3,890,000 تومان",
      tagFa: "بافت اختصاصی نقره",
      tagEn: "Custom Silver Weave",
      tagAr: "صياغة حصرية",
      stoneFa: "نقره ۹۲۵ خالص",
      stoneEn: "Solid 925 Silver",
      stoneAr: "فضة خالصة 925",
    },
  },
  {
    id: "earrings",
    href: "/earrings",
    nameFa: "گوشواره‌های نقره",
    nameEn: "Silver Earrings",
    nameAr: "أقراط فضة ولؤلؤ",
    descFa: "گوشواره‌های آویز و میخی با مروارید طبیعی و نگین",
    descEn: "Drop & stud earrings with natural pearls and gems",
    descAr: "أقراط متدلية مع لؤلؤ طبيعي وأحجار كريمة",
    icon: "💎",
    sampleProduct: {
      nameFa: "گوشواره آویز نقره ۹۲۵ و مروارید طبیعی پرورشی",
      nameEn: "Freshwater Pearl & 925 Silver Drop Earrings",
      nameAr: "أقراط متدلية لؤلؤ طبيعي وفضة 925",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      priceFa: "۲,۴۵۰,۰۰۰ تومان",
      priceEn: "2,450,000 Toman",
      priceAr: "2,450,000 تومان",
      tagFa: "مروارید اصل",
      tagEn: "Natural Pearl",
      tagAr: "لؤلؤ طبيعي",
      stoneFa: "مروارید پرورشی آب شیرین",
      stoneEn: "Freshwater Cultured Pearl",
      stoneAr: "لؤلؤ مستزرع طبيعي",
    },
  },
  {
    id: "turquoise-atelier",
    href: "/collections",
    nameFa: "کالکشن فیروزه نیشابور",
    nameEn: "Neyshabur Turquoise Atelier",
    nameAr: "مجموعة الفيروز النيسابوري",
    descFa: "شاهکار نقره با فیروزه شجری و عجمی اصل نیشابور",
    descEn: "Master silver pieces with certified Neyshabur turquoise",
    descAr: "قطع حصرية مرصعة بأجود أنواع الفيروز الأصيل",
    icon: "💠",
    sampleProduct: {
      nameFa: "ست سلطنتی نقره ۹۲۵ و فیروزه اصیل شجری نیشابور",
      nameEn: "Royal 925 Silver & Neyshabur Turquoise Set",
      nameAr: "طقم ملكي فضة 925 مع فيروز نيسابوري أصيل",
      image: "/images/hero-silver-bg.jpg",
      priceFa: "۸,۵۰۰,۰۰۰ تومان",
      priceEn: "8,500,000 Toman",
      priceAr: "8,500,000 تومان",
      tagFa: "شناسنامه اصالت رسمی",
      tagEn: "Certified Gemstone",
      tagAr: "شهادة أصالة معتمدة",
      stoneFa: "فیروزه شجری نیشابور",
      stoneEn: "Genuine Neyshabur Gem",
      stoneAr: "فيروز شجري نيسابوري",
    },
  },
  {
    id: "agate-heritage",
    href: "/collections",
    nameFa: "کالکشن عقیق یمنی",
    nameEn: "Yemeni Agate Heritage",
    nameAr: "مجموعة العقيق اليماني",
    descFa: "زیورآلات نقره مرصع به عقیق سرخ و سلیمانی طبیعی",
    descEn: "Fine silver creations set with natural red agate",
    descAr: "مجوهرات فضة مرصعة بالعقيق اليماني والسليماني",
    icon: "🪨",
    sampleProduct: {
      nameFa: "انگشتر نقره ۹۲۵ مینیمال دست‌ساز",
      nameEn: "Handcrafted Minimalist 925 Silver Band",
      nameAr: "خاتم فضة إسترليني 925 مينيمال عصري",
      image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop",
      priceFa: "۱,۸۵۰,۰۰۰ تومان",
      priceEn: "1,850,000 Toman",
      priceAr: "1,850,000 تومان",
      tagFa: "عقیق طبیعی معدنی",
      tagEn: "Natural Agate",
      tagAr: "عقيق طبيعي",
      stoneFa: "عقیق معدنی اصل",
      stoneEn: "Natural Mineral Agate",
      stoneAr: "عقيق معدني أصيل",
    },
  },
];

export default function CollectionsMegaMenu() {
  const { language, t } = useAppStore();
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

  const activeCollection = COLLECTIONS[selectedIndex] || COLLECTIONS[0];
  const sample = activeCollection.sampleProduct;

  const getCollectionName = (item: CollectionItem) => {
    if (language === "ar") return item.nameAr;
    if (language === "en") return item.nameEn;
    return item.nameFa;
  };

  const getCollectionDesc = (item: CollectionItem) => {
    if (language === "ar") return item.descAr;
    if (language === "en") return item.descEn;
    return item.descFa;
  };

  const getSampleName = () => {
    if (language === "ar") return sample.nameAr;
    if (language === "en") return sample.nameEn;
    return sample.nameFa;
  };

  const getSamplePrice = () => {
    if (language === "ar") return sample.priceAr;
    if (language === "en") return sample.priceEn;
    return sample.priceFa;
  };

  const getSampleTag = () => {
    if (language === "ar") return sample.tagAr;
    if (language === "en") return sample.tagEn;
    return sample.tagFa;
  };

  const getSampleStone = () => {
    if (language === "ar") return sample.stoneAr;
    if (language === "en") return sample.stoneEn;
    return sample.stoneFa;
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
          
          {/* Column 1: Collections Navigation List (7 of 12 cols) */}
          <div className="col-span-7 flex flex-col justify-between border-e border-[#C4852B]/20 pe-6">
            <div>
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A06314] flex items-center gap-1.5 font-sans">
                  <span>✨</span>
                  <span>
                    {language === "fa"
                      ? "کالکشن‌های اختصاصی نقره ۹۲۵"
                      : language === "ar"
                      ? "المجموعات الحصرية للفضة 925"
                      : "Exclusive 925 Silver Collections"}
                  </span>
                </span>
                <Link
                  href="/collections"
                  onClick={() => setIsOpen(false)}
                  className="text-[11px] font-bold text-[#660000] hover:text-[#C4852B] transition-colors"
                >
                  {language === "fa" ? "همه کالکشن‌ها ←" : language === "ar" ? "جميع المجموعات ←" : "All Collections →"}
                </Link>
              </div>

              {/* Collections Interactive List */}
              <div className="space-y-1">
                {COLLECTIONS.map((col, idx) => {
                  const isHovered = selectedIndex === idx;
                  return (
                    <Link
                      key={col.id}
                      href={col.href}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-200 text-start group cursor-pointer ${
                        isHovered
                          ? "bg-[#C4852B]/12 border border-[#C4852B]/40 shadow-2xs translate-x-1 rtl:-translate-x-1"
                          : "hover:bg-zinc-100/80 dark:hover:bg-[#F4F1EA] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0 p-1 rounded-xl bg-white/80 shadow-2xs">
                          {col.icon}
                        </span>
                        <div className="flex flex-col">
                          <span
                            className={`font-bold text-[13px] leading-snug transition-colors ${
                              isHovered ? "text-[#660000] dark:text-[#A06314]" : "text-zinc-900 group-hover:text-[#C4852B]"
                            }`}
                          >
                            {getCollectionName(col)}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-medium leading-normal line-clamp-1">
                            {getCollectionDesc(col)}
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

          {/* Column 2: Interactive Sample Product Preview Card (5 of 12 cols) */}
          <div className="col-span-5 flex flex-col justify-between bg-white dark:bg-[#FAF9F5] p-4 rounded-2xl border border-[#C4852B]/25 shadow-sm">
            <div>
              {/* Product Badge / Category Tag */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#660000]/10 text-[#660000] text-[10px] font-bold tracking-wider">
                  {getSampleTag()}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#C4852B]/15 text-[#A06314] text-[10px] font-bold">
                  {getSampleStone()}
                </span>
              </div>

              {/* Sample Product Image */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80 mb-3 group">
                <Image
                  src={sample.image}
                  alt={getSampleName()}
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
                {getSampleName()}
              </h4>

              {/* Live Price */}
              <div className="flex items-baseline gap-1.5 text-[#660000] font-bold font-mono text-sm">
                <span className="text-zinc-500 font-sans text-[11px] font-medium">
                  {language === "fa" ? "قیمت:" : language === "ar" ? "السعر:" : "Price:"}
                </span>
                <span>{getSamplePrice()}</span>
              </div>
            </div>

            {/* Direct CTA Link to the Collection */}
            <Link
              href={activeCollection.href}
              onClick={() => setIsOpen(false)}
              className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#660000] hover:bg-[#7D0000] text-white font-bold text-xs text-center transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>
                {language === "fa"
                  ? `مشاهده ${getCollectionName(activeCollection)}`
                  : language === "ar"
                  ? `استعراض ${getCollectionName(activeCollection)}`
                  : `Explore ${getCollectionName(activeCollection)}`}
              </span>
              <span>{language === "en" ? "→" : "←"}</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
