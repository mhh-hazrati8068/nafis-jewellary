export interface Product {
  id: number
  nameFa: string
  nameEn: string
  price: number
  category: 'rings' | 'necklaces' | 'bracelets' | 'earrings'
  categoryFa: string
  categoryEn: string
  materialFa: string
  materialEn: string
  descriptionFa: string
  descriptionEn: string
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
    price: 250,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    materialFa: "طلای ۱۸ عیار دست‌ساز",
    materialEn: "18K Yellow Gold",
    descriptionFa: "طراحی دست‌ساز با الهام از هویت بصری زیورآلات نفیسه عبادی. ساخته شده از طلای خالص ۱۸ عیار با پرداخت نهایی صیقلی.",
    descriptionEn: "Handcrafted minimalist design inspired by the official Nafise Ebadi corporate visual identity. Made from certified 18K solid gold.",
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
    price: 1200,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    materialFa: "طلای سفید، سنگ عقیق سرخ و الماس طبیعی",
    materialEn: "18K White Gold, Natural Agate & VVS Diamond",
    descriptionFa: "پیوند سنگ عقیق سرخ با الماس طبیعی پاک VVS و طلای سفید ۱۸ عیار. هر قطعه دارای شناسنامه رسمی اصالت کالا می‌باشد.",
    descriptionEn: "A fusion of natural red agate stone, VVS clarity diamond, and 18K white gold. Accompanied by an official certificate of authenticity.",
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
    price: 340,
    category: "earrings",
    categoryFa: "گوشواره",
    categoryEn: "Earrings",
    materialFa: "مروارید پرورشی آب شیرین و طلای ۱۸ عیار",
    materialEn: "Freshwater Pearl & 18K Solid Gold",
    descriptionFa: "گوشواره آویز مروارید طبیعی پرورشی با زنجیر ظریف طلای ۱۸ عیار. ایده‌آل برای استایل‌های مدرن و رسمی.",
    descriptionEn: "Freshwater cultured pearl drop earrings linked with delicate 18K gold chain work. Designed for contemporary elegance.",
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
    price: 450,
    category: "bracelets",
    categoryFa: "دستبند",
    categoryEn: "Bracelets",
    materialFa: "طلای ۱۸ عیار خالص دست‌ساز",
    materialEn: "18K Solid Handcrafted Gold",
    descriptionFa: "دستبند زنجیری با بافت اختصاصی و قفل ایمن. ساخته شده بر اساس استاندارد وزن و عیار سازمانی برند نفیسه عبادی.",
    descriptionEn: "Handcrafted solid chain link bracelet featuring custom clasp and precision weight certification.",
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
    price: 680,
    category: "necklaces",
    categoryFa: "گردنبند",
    categoryEn: "Necklaces",
    materialFa: "سنگ عقیق طبیعی، الماس و طلای زرد",
    materialEn: "Natural Agate, Diamond & 18K Gold",
    descriptionFa: "گردنبند آویز عقیق با قاب طلا بر اساس المان‌های اصلی هویت تصویری برند (صفحه ۳ دفترچه راهنما).",
    descriptionEn: "Agate pendant necklace encased in 18K gold, designed according to the visual identity guidelines.",
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
    price: 520,
    category: "rings",
    categoryFa: "انگشتر",
    categoryEn: "Rings",
    materialFa: "طلای ترکیبی سفید و زرد ۱۸ عیار",
    materialEn: "Dual Tone 18K White & Yellow Gold",
    descriptionFa: "حلقه دو رنگ طلا با طراحی مدرن و خطوط موازی صیقلی.",
    descriptionEn: "Dual-tone gold wedding band featuring parallel precision polish line work.",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
    ],
    weightGram: 4.1,
    carat: "18K (750)",
    featured: false
  }
];
