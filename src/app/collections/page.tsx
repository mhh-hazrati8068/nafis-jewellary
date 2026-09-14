"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";
import { getProductName, getProductMaterial } from "@/lib/dynamicTranslator";
import { RingIcon, NecklaceIcon, BraceletIcon } from "@/components/icons/JewelryIcons";

export default function CollectionsPage() {
  const { products, language, addToCart, t } = useAppStore();

  const collections = [
    {
      id: "rings",
      titleFa: "کالکشن انگشترهای نقره ۹۲۵ و فیروزه",
      titleEn: "Fine 925 Silver & Turquoise Ring Collection",
      titleAr: "مجموعة خواتم الفضة 925 والفيروز النيسابوري",
      subtitleFa: "پیوند سنگ فیروزه نیشابور و نقره استرلینگ",
      subtitleEn: "Neyshabur Turquoise & Fine Silver Fusion",
      subtitleAr: "تناغم الفيروز النيسابوري والفضة الإسترلينية",
      descriptionFa: "مجموعه‌ای باشکوه از انگشترهای دست‌ساز نقره خالص ۹۲۵ که با الهام از خطوط اصیل هویت تصویری برند نفیسه عبادی خلق شده‌اند.",
      descriptionEn: "A magnificent collection of handcrafted solid 925 sterling silver rings inspired by the architectural guidelines of the Nafise Ebadi visual identity.",
      descriptionAr: "تشكيلة ساحرة من الخواتم الصياغة اليدوية بالفضة الإسترلينية 925 المستوحاة من المعايير المعمارية للهوية البصرية لمجوهرات نفيسة عبادي.",
      image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=1000&auto=format&fit=crop",
      items: products.filter(p => p.category === 'rings')
    },
    {
      id: "necklaces",
      titleFa: "کالکشن گردنبند و آویزهای عقیق",
      titleEn: "Necklace & Agate Pendant Collection",
      titleAr: "مجموعة قلائد ومداليات العقيق",
      subtitleFa: "درخشش نقره ۹۲۵ و عقیق سرخ طبیعی",
      subtitleEn: "Authentic Agate & 925 Silver Elegance",
      subtitleAr: "بريق الفضة الإسترلينية والأحجار الكريمة",
      descriptionFa: "آویزهای مدال سنگ عقیق سرخ و نقره ۹۲۵ دست‌ساز با تراش اختصاصی برای درخشش در مراسم‌های فاخر.",
      descriptionEn: "Red agate gemstone pendant necklaces framed in 925 sterling silver, crafted for high-fashion editorial moments.",
      descriptionAr: "قلائد ومداليات بحجر العقيق الأحمر الطبيعي وصياغة فضية يدوية دقيقة للمناسبات الفاخرة.",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop",
      items: products.filter(p => p.category === 'necklaces')
    },
    {
      id: "bracelets",
      titleFa: "کالکشن دستبندهای زنجیری نقره",
      titleEn: "Silver Chain & Link Bracelet Collection",
      titleAr: "مجموعة الأساور والسلاسل الفضية",
      subtitleFa: "بافت‌های اختصاصی با قفل ایمن",
      subtitleEn: "Custom Weave & Precision Silver Work",
      subtitleAr: "حبكات خاصة وأقفال فائقة الأمان",
      descriptionFa: "دستبندهای نقره ۹۲۵ با زنجیره‌های محکم و صیقلی که بر اساس استاندارد عیار سازمانی طراحی شده‌اند.",
      descriptionEn: "Solid 925 silver bracelets with custom precision links engineered according to official brand standards.",
      descriptionAr: "أساور وسلاسل فضية مصقولة ومتينة مصممة وفق أعلى معايير الجودة والعيار الدقيق.",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
      items: products.filter(p => p.category === 'bracelets')
    }
  ];

  const getPageTag = () => {
    if (language === 'fa') return 'کالکشن‌های اختصاصی ۲۰۲۶';
    if (language === 'ar') return 'المجموعات الحصرية 2026';
    return '2026 Signature Collections';
  };

  const getPageDesc = () => {
    if (language === 'fa') return 'ورود به دنیای هنر و زیورآلات نفیسه عبادی؛ هر کالکشن روایتی منحصر‌به‌فرد از اصالت نقره ۹۲۵، سنگ عقیق و فیروزه نیشابور است.';
    if (language === 'ar') return 'ادخل عالم الإبداع مع مجوهرات نفيسة عبادي؛ كل مجموعة تروي حكاية فريدة من فخامة الفضة الإسترلينية 925 والأحجار الكريمة النادرة.';
    return 'Enter the world of Nafise Ebadi Jewellery; each collection presents an artistic narrative of 925 sterling silver and gemstones.';
  };

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
            {getPageTag()}
          </span>
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight uppercase mb-6 leading-tight">
            {t.header.collections}
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>
          <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
            {getPageDesc()}
          </p>
        </div>

        <div className="flex flex-col gap-24">
          {collections.map((col, idx) => {
            const title = language === 'fa' ? col.titleFa : language === 'ar' ? col.titleAr : col.titleEn;
            const subtitle = language === 'fa' ? col.subtitleFa : language === 'ar' ? col.subtitleAr : col.subtitleEn;
            const desc = language === 'fa' ? col.descriptionFa : language === 'ar' ? col.descriptionAr : col.descriptionEn;

            return (
              <div key={col.id} className="flex flex-col gap-12 border-b border-[#C4852B]/20 pb-20">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-200 shadow-xl group">
                    <img src={col.image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className="absolute bottom-6 left-6 font-mono text-xs text-white bg-[#660000] px-4 py-1.5 rounded-full border border-[#C4852B]/40">
                      CHAPTER {idx + 1}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      {col.id === 'rings' && <RingIcon className="w-4.5 h-4.5 text-[#C4852B]" />}
                      {col.id === 'necklaces' && <NecklaceIcon className="w-4.5 h-4.5 text-[#C4852B]" />}
                      {col.id === 'bracelets' && <BraceletIcon className="w-4.5 h-4.5 text-[#C4852B]" />}
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
                  </div>
                </div>

                {col.items.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {col.items.map((product) => {
                      const prodName = getProductName(product, language);
                      const prodMaterial = getProductMaterial(product, language);

                      return (
                        <div 
                          key={product.id} 
                          className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-[#C4852B] transition-all p-5 shadow-sm"
                        >
                          <Link href={`/product/${product.id}`} className="aspect-square rounded-xl overflow-hidden bg-[#F4F1EA] mb-4 block">
                            <img src={product.image} alt={prodName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </Link>
                          
                          <div className="flex flex-col flex-1 justify-between">
                            <div>
                              <span className="text-[10px] text-[#626667] font-mono uppercase tracking-wider block mb-1">
                                {prodMaterial}
                              </span>
                              <Link href={`/product/${product.id}`}>
                                <h3 className="font-bold text-base text-zinc-950 hover:text-[#C4852B] transition-colors mb-2">
                                  {prodName}
                                </h3>
                              </Link>
                            </div>

                            <div className="pt-4 border-t border-zinc-200 flex items-center justify-between mt-4">
                              <span className="font-mono text-base font-bold text-[#C4852B]">
                                {product.price.toLocaleString()} تومان
                              </span>
                              <button
                                onClick={() => addToCart({
                                  id: product.id,
                                  name: prodName,
                                  price: product.price,
                                  image: product.image
                                })}
                                className="px-4 py-2 bg-[#660000] text-white text-xs font-semibold rounded-lg hover:bg-[#7D0000] transition-colors cursor-pointer"
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
