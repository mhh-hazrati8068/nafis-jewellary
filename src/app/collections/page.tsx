"use client";

import { useAppStore } from "@/store/useAppStore";
import Link from "next/link";

export default function CollectionsPage() {
  const { products, language, addToCart, t } = useAppStore();

  const collections = [
    {
      id: "rings",
      titleFa: "کالکشن انگشترهای ۱۸ عیار",
      titleEn: "18K Gold Ring Collection",
      subtitleFa: "پیوند سنگ عقیق و الماس پاک VVS",
      subtitleEn: "VVS Diamond & Natural Agate Fusion",
      descriptionFa: "مجموعه‌ای باشکوه از انگشترهای دست‌ساز طلای خالص ۱۸ عیار که با الهام از خطوط معمارانه هویت تصویری برند نفیسه عبادی ۲۰۰۶ خلق شده‌اند.",
      descriptionEn: "A magnificent collection of handcrafted solid 18K gold rings inspired by the architectural guidelines of the Nafise Ebadi corporate visual identity.",
      image: "https://images.unsplash.com/photo-1605100804763-247f66126e28?q=80&w=1000&auto=format&fit=crop",
      items: products.filter(p => p.category === 'rings')
    },
    {
      id: "necklaces",
      titleFa: "کالکشن گردنبند و آویزهای عقیق",
      titleEn: "Necklace & Agate Pendant Collection",
      subtitleFa: "درخشش طلای زرد و سنگ‌های اصل",
      subtitleEn: "Authentic Agate & Yellow Gold Elegance",
      descriptionFa: "آویزهای مدال سنگ عقیق سرخ و طلای دست‌ساز با تراش اختصاصی برای درخشش در مراسم‌های فاخر.",
      descriptionEn: "Red agate gemstone pendant necklaces framed in 18K yellow gold, crafted for high-fashion editorial moments.",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop",
      items: products.filter(p => p.category === 'necklaces')
    },
    {
      id: "bracelets",
      titleFa: "کالکشن دستبندهای زنجیری",
      titleEn: "Chain & Link Bracelet Collection",
      subtitleFa: "بافت‌های اختصاصی با قفل ایمن",
      subtitleEn: "Custom Weave & Precision Gold Work",
      descriptionFa: "دستبندهای طلا با زنجیره‌های محکم و صیقلی که بر اساس استاندارد وزن و عیار سازمانی طراحی شده‌اند.",
      descriptionEn: "Solid gold bracelets with custom precision links engineered according to official brand standards.",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop",
      items: products.filter(p => p.category === 'bracelets')
    }
  ];

  return (
    <div className="py-16 md:py-28 bg-[#FFFFFF] dark:bg-[#FAF9F5] text-zinc-950 min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[10px] text-[#C4852B] uppercase tracking-[0.3em] font-semibold mb-3 block font-mono">
            {language === 'fa' ? 'کالکشن‌های اختصاصی ۲۰۲۶' : '2026 Signature Collections'}
          </span>
          <h1 className="text-3xl md:text-6xl font-bold tracking-tight uppercase mb-6 leading-tight">
            {t.header.collections}
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-[#C4852B] to-[#660000] mx-auto mb-6"></div>
          <p className="text-xs md:text-sm text-[#626667] leading-relaxed">
            {language === 'fa' 
              ? 'ورود به دنیای هنر و زیورآلات نفیسه عبادی؛ هر کالکشن روایتی منحصر‌به‌فرد از اصالت طلای ۱۸ عیار، سنگ عقیق و الماس پاک است.'
              : 'Enter the world of Nafise Ebadi Jewellery; each collection presents an artistic narrative of 18K solid gold and gemstones.'}
          </p>
        </div>

        <div className="flex flex-col gap-24">
          {collections.map((col, idx) => (
            <div key={col.id} className="flex flex-col gap-12 border-b border-[#C4852B]/20 pb-20">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-zinc-200 shadow-xl group">
                  <img src={col.image} alt={col.titleFa} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span className="absolute bottom-6 left-6 font-mono text-xs text-white bg-[#660000] px-4 py-1.5 rounded-full border border-[#C4852B]/40">
                    CHAPTER {idx + 1}
                  </span>
                </div>

                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase mb-2 font-bold">
                    {language === 'fa' ? col.subtitleFa : col.subtitleEn}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-bold uppercase mb-4 text-zinc-950">
                    {language === 'fa' ? col.titleFa : col.titleEn}
                  </h2>
                  <p className="text-xs md:text-sm text-[#626667] leading-relaxed mb-6">
                    {language === 'fa' ? col.descriptionFa : col.descriptionEn}
                  </p>
                </div>
              </div>

              {col.items.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {col.items.map((product) => (
                    <div 
                      key={product.id} 
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-[#C4852B] transition-all p-5 shadow-sm"
                    >
                      <Link href={`/product/${product.id}`} className="aspect-square rounded-xl overflow-hidden bg-[#F4F1EA] mb-4 block">
                        <img src={product.image} alt={product.nameFa} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </Link>
                      
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <span className="text-[10px] text-[#626667] font-mono uppercase tracking-wider block mb-1">
                            {language === 'fa' ? product.materialFa : product.materialEn}
                          </span>
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-bold text-base text-zinc-950 hover:text-[#C4852B] transition-colors mb-2">
                              {language === 'fa' ? product.nameFa : product.nameEn}
                            </h3>
                          </Link>
                        </div>

                        <div className="pt-4 border-t border-zinc-200 flex items-center justify-between mt-4">
                          <span className="font-mono text-base font-bold text-[#C4852B]">${product.price}</span>
                          <button
                            onClick={() => addToCart({
                              id: product.id,
                              name: language === 'fa' ? product.nameFa : product.nameEn,
                              price: product.price,
                              image: product.image
                            })}
                            className="px-4 py-2 bg-[#660000] text-white text-xs font-semibold rounded-lg hover:bg-[#7D0000] transition-colors cursor-pointer"
                          >
                            {language === 'fa' ? 'خرید' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
