export interface Product {
  id: number
  nameFa: string
  nameEn: string
  nameAr?: string
  price: number
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  categoryFa: string
  categoryEn: string
  categoryAr?: string
  materialFa: string
  materialEn: string
  materialAr?: string
  descriptionFa: string
  descriptionEn: string
  descriptionAr?: string
  image: string
  images: string[]
  weightGram: number
  carat: string
  featured?: boolean
}

export const initialProducts: Product[] = [
  {
    id: 1,
    nameFa: "انگشتر نقره ۹۲۵ مینیمال دست‌ساز",
    nameEn: "Handcrafted Minimalist 925 Silver Band",
    nameAr: "خاتم فضة إسترليني 925 مينيمال عصري",
    price: 1850000,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    categoryAr: "خواتم",
    materialFa: "نقره استرلینگ ۹۲۵ دست‌ساز",
    materialEn: "Handcrafted 925 Sterling Silver",
    materialAr: "فضة إسترليني 925 صياغة يدوية",
    descriptionFa: "طراحی مینیمال و دست‌ساز نقره‌سازان نفیسه عبادی. ساخته شده از نقره استرلینگ ۹۲۵ با پرداخت نهایی صیقلی، براق و ضدحساسیت.",
    descriptionEn: "Handcrafted minimalist design by Nafise Ebadi master silversmiths. Made from certified 925 sterling silver with mirror finish.",
    descriptionAr: "تصميم يدوي مينيمال راقٍ من الفضة عيار 925 بصياغة يدوية ولمعان مصقول فائق الدقة.",
    image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 4.5,
    carat: "Silver 925",
    featured: true
  },
  {
    id: 2,
    nameFa: "انگشتر نقره دست‌ساز با سنگ فیروزه اصل نیشابور",
    nameEn: "Neyshabur Turquoise 925 Silver Solitaire Ring",
    nameAr: "خاتم فضة 925 مع حجر الفيروز النيسابوري الأصلي",
    price: 6374453,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    categoryAr: "خواتم",
    materialFa: "نقره ۹۲۵ دست‌ساز و سنگ فیروزه اصل نیشابور",
    materialEn: "925 Sterling Silver & Genuine Neyshabur Turquoise",
    materialAr: "فضة إسترليني 925 وفيروز نيسابوري طبيعي",
    descriptionFa: "پیوند سنگ فیروزه شجری اصیل نیشابور با نقره ۹۲۵ دست‌ساز. هر قطعه دارای شناسنامه رسمی اصالت گوهرشناسی می‌باشد.",
    descriptionEn: "A fusion of genuine Neyshabur natural turquoise stone and fine 925 sterling silver. Accompanied by an official certificate of authenticity.",
    descriptionAr: "مزيج ساحر بين الفيروز النيسابوري الطبيعي والفضة الاسترليني عيار 925، مرفق بشهادة أصالة معتمدة.",
    image: "https://images.unsplash.com/photo-1599643478524-fb66f70a9578?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478524-fb66f70a9578?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 6.2,
    carat: "Silver 925",
    featured: true
  },
  {
    id: 3,
    nameFa: "گوشواره آویز نقره و مروارید طبیعی",
    nameEn: "Freshwater Pearl & 925 Silver Drop Earrings",
    nameAr: "أقراط متدلية لؤلؤ طبيعي وفضة 925",
    price: 2450000,
    category: "earrings",
    categoryFa: "گوشواره",
    categoryEn: "Earrings",
    categoryAr: "أقراط",
    materialFa: "مروارید پرورشی آب شیرین و نقره ۹۲۵",
    materialEn: "Freshwater Pearl & 925 Sterling Silver",
    materialAr: "لؤلؤ مستزرع طبيعي وفضة خالصة عيار 925",
    descriptionFa: "گوشواره آویز مروارید طبیعی پرورشی با زنجیر ظریف نقره ۹۲۵. ایده‌آل برای استایل‌های مدرن و شیک.",
    descriptionEn: "Freshwater cultured pearl drop earrings linked with delicate 925 silver chain work. Designed for contemporary elegance.",
    descriptionAr: "أقراط لؤلؤ طبيعي متدلية بسلاسل رقيقة من الفضة عيار 925، مصممة لأناقة لا تُنسى.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 3.8,
    carat: "Silver 925",
    featured: true
  },
  {
    id: 4,
    nameFa: "دستبند زنجیری نقره دست‌ساز ۹۲۵",
    nameEn: "925 Sterling Silver Handcrafted Link Bracelet",
    nameAr: "سوار جنزير فضة إسترليني 925",
    price: 3890000,
    category: "bracelets",
    categoryFa: "دستبند",
    categoryEn: "Bracelets",
    categoryAr: "أساور",
    materialFa: "نقره ۹۲۵ استرلینگ خالص دست‌ساز",
    materialEn: "Handcrafted 925 Sterling Silver",
    materialAr: "فضة خالصة عيار 925 صناعة يدوية",
    descriptionFa: "دستبند زنجیری با بافت اختصاصی و قفل ایمن نقره. ساخته شده بر اساس استاندارد خلوص ۹۲۵ برند نفیسه عبادی.",
    descriptionEn: "Handcrafted solid chain link bracelet featuring custom clasp and certified 925 silver purity.",
    descriptionAr: "سوار جنزير فضة صياغة يدوية مع قفل آمن وعيار دقيق ومطابق لأرقى معايير الجودة.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 7.5,
    carat: "Silver 925",
    featured: true
  },
  {
    id: 5,
    nameFa: "گردنبند مدال عقیق یمنی و نقره ۹۲۵",
    nameEn: "Authentic Yemeni Agate 925 Silver Pendant Necklace",
    nameAr: "قلادة فضة 925 مع مدالية عقيق يماني طبيعي",
    price: 4950000,
    category: "necklaces",
    categoryFa: "گردنبند",
    categoryEn: "Necklaces",
    categoryAr: "قلائد",
    materialFa: "سنگ عقیق طبیعی یمن و نقره ۹۲۵",
    materialEn: "Natural Yemeni Agate & 925 Silver",
    materialAr: "عقيق طبيعي وفضة عيار 925",
    descriptionFa: "گردنبند آویز عقیق طبیعی سرخ با قاب دست‌ساز نقره بر اساس المان‌های اصلی هویت تصویری برند.",
    descriptionEn: "Agate pendant necklace encased in fine 925 sterling silver, designed according to the brand visual identity guidelines.",
    descriptionAr: "قلادة بحجر العقيق الطبيعي المؤطر بالفضة 925 وفق أصول الهوية البصرية المميزة.",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 8.4,
    carat: "Silver 925",
    featured: false
  },
  {
    id: 6,
    nameFa: "حلقه نقره ۹۲۵ خطوط موازی صیقلی",
    nameEn: "Parallel Precision Polish 925 Silver Ring",
    nameAr: "دبلة فضة 925 مصقولة بخطوط متوازية",
    price: 2750000,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    categoryAr: "خواتم",
    materialFa: "نقره ۹۲۵ صیقلی با روکش محافظ ضد کدر",
    materialEn: "Polished 925 Sterling Silver with Anti-Tarnish Finish",
    materialAr: "فضة إسترليني 925 مصقولة ومقاومة للأكسدة",
    descriptionFa: "حلقه نقره دست‌ساز با طراحی مدرن و خطوط موازی صیقلی ظریف.",
    descriptionEn: "Handcrafted 925 sterling silver band featuring parallel precision polish line work.",
    descriptionAr: "دبلة فضة 925 بتصميم عصري مع خطوط هندسية مصقولة.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 5.1,
    carat: "Silver 925",
    featured: false
  }
];
