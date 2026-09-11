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

export const mockProducts: Product[] = [
  {
    id: 1,
    nameFa: "انگشتر طلای ۱۸ عیار مینیمال",
    nameEn: "Minimalist 18K Gold Band",
    nameAr: "خاتم ذهب عيار 18 مينيمال عصري",
    price: 250,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    categoryAr: "خواتم",
    materialFa: "طلای ۱۸ عیار دست‌ساز",
    materialEn: "18K Yellow Gold",
    materialAr: "ذهب أصفر عيار 18 صياغة يدوية",
    descriptionFa: "طراحی دست‌ساز با الهام از هویت بصری زیورآلات نفیسه عبادی. ساخته شده از طلای خالص ۱۸ عیار با پرداخت نهایی صیقلی.",
    descriptionEn: "Handcrafted minimalist design inspired by the official Nafise Ebadi corporate visual identity. Made from certified 18K solid gold.",
    descriptionAr: "تصميم يدوي مستوحى من الهوية البصرية لمجوهرات نفيسة عبادي، مصاغ من الذهب الخالص عيار 18 بلمعان مصقول فائق الدقة.",
    image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 3.4,
    carat: "18K (750)",
    featured: true
  },
  {
    id: 2,
    nameFa: "حلقه تک‌نگین الماس VVS و عقیق",
    nameEn: "VVS Diamond & Agate Solitaire Ring",
    nameAr: "خاتم سوليتير ألماس VVS وعقيق",
    price: 1200,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    categoryAr: "خواتم",
    materialFa: "طلای سفید، سنگ عقیق سرخ و الماس طبیعی",
    materialEn: "18K White Gold, Natural Agate & VVS Diamond",
    materialAr: "ذهب أبيض عيار 18، عقيق أحمر طبيعي وألماس نقي",
    descriptionFa: "پیوند سنگ عقیق سرخ با الماس طبیعی پاک VVS و طلای سفید ۱۸ عیار. هر قطعه دارای شناسنامه رسمی اصالت کالا می‌باشد.",
    descriptionEn: "A fusion of natural red agate stone, VVS clarity diamond, and 18K white gold. Accompanied by an official certificate of authenticity.",
    descriptionAr: "مزيج ساحر بين العقيق الأحمر الطبيعي والألماس النقي VVS والذهب الأبيض عيار 18، مرفق بشهادة أصالة معتمدة.",
    image: "https://images.unsplash.com/photo-1599643478524-fb66f70a9578?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643478524-fb66f70a9578?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 5.2,
    carat: "18K (750)",
    featured: true
  },
  {
    id: 3,
    nameFa: "گوشواره آویز مروارید و طلا",
    nameEn: "Freshwater Pearl Drop Earrings",
    nameAr: "أقراط متدلية لؤلؤ وذهب عيار 18",
    price: 340,
    category: "earrings",
    categoryFa: "گوشواره",
    categoryEn: "Earrings",
    categoryAr: "أقراط",
    materialFa: "مروارید پرورشی آب شیرین و طلای ۱۸ عیار",
    materialEn: "Freshwater Pearl & 18K Solid Gold",
    materialAr: "لؤلؤ مستزرع طبيعي وذهب خالص عيار 18",
    descriptionFa: "گوشواره آویز مروارید طبیعی پرورشی با زنجیر ظریف طلای ۱۸ عیار. ایده‌آل برای استایل‌های مدرن و رسمی.",
    descriptionEn: "Freshwater cultured pearl drop earrings linked with delicate 18K gold chain work. Designed for contemporary elegance.",
    descriptionAr: "أقراط لؤلؤ طبيعي متدلية بسلاسل رقيقة من الذهب عيار 18، مصممة لأناقة لا تُنسى في الإطلالات اليومية والخاصة.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 2.8,
    carat: "18K (750)",
    featured: true
  },
  {
    id: 4,
    nameFa: "دستبند زنجیری طلای ناب ۱۸ عیار",
    nameEn: "18K Solid Gold Link Bracelet",
    nameAr: "سوار جنزير ذهب خالص عيار 18",
    price: 450,
    category: "bracelets",
    categoryFa: "دستبند",
    categoryEn: "Bracelets",
    categoryAr: "أساور",
    materialFa: "طلای ۱۸ عیار خالص دست‌ساز",
    materialEn: "18K Solid Handcrafted Gold",
    materialAr: "ذهب خالص عيار 18 صناعة يدوية",
    descriptionFa: "دستبند زنجیری با بافت اختصاصی و قفل ایمن. ساخته شده بر اساس استاندارد وزن و عیار سازمانی برند نفیسه عبادی.",
    descriptionEn: "Handcrafted solid chain link bracelet featuring custom clasp and precision weight certification.",
    descriptionAr: "سوار جنزير صياغة يدوية مع قفل آمن وعيار دقيق ومطابق لأرقى معايير الجودة.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 4.6,
    carat: "18K (750)",
    featured: true
  },
  {
    id: 5,
    nameFa: "گردنبند مدال عقیق و طلا",
    nameEn: "Agate Gemstone Gold Pendant Necklace",
    nameAr: "قلادة ذهب مع مدالية عقيق طبيعي",
    price: 680,
    category: "necklaces",
    categoryFa: "گردنبند",
    categoryEn: "Necklaces",
    categoryAr: "قلائد",
    materialFa: "سنگ عقیق طبیعی، الماس و طلای زرد",
    materialEn: "Natural Agate, Diamond & 18K Gold",
    materialAr: "عقيق طبيعي، ألماس وذهب أصفر عيار 18",
    descriptionFa: "گردنبند آویز عقیق با قاب طلا بر اساس المان‌های اصلی هویت تصویری برند (صفحه ۳ دفترچه راهنما).",
    descriptionEn: "Agate pendant necklace encased in 18K gold, designed according to the visual identity guidelines.",
    descriptionAr: "قلادة بحجر العقيق الطبيعي المؤطر بالذهب عيار 18 وفق أصول الهوية البصرية المميزة.",
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 6.1,
    carat: "18K (750)",
    featured: false
  },
  {
    id: 6,
    nameFa: "حلقه ازدواج طلای سفید و زرد",
    nameEn: "Dual Gold Wedding Ring",
    nameAr: "دبلة زواج ذهب أبيض وأصفر",
    price: 520,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    categoryAr: "خواتم",
    materialFa: "طلای ترکیبی سفید و زرد ۱۸ عیار",
    materialEn: "Dual Tone 18K White & Yellow Gold",
    materialAr: "ذهب مزدوج اللون أبيض وأصفر عيار 18",
    descriptionFa: "حلقه دو رنگ طلا با طراحی مدرن و خطوط موازی صیقلی.",
    descriptionEn: "Dual-tone gold wedding band featuring parallel precision polish line work.",
    descriptionAr: "دبلة زواج بلونين متناغمين من الذهب الأبيض والأصفر مع خطوط هندسية عصرية مصقولة.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 4.1,
    carat: "18K (750)",
    featured: false
  }
];
