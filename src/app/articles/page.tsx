"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { Article, fetchArticles, API_BASE_URL } from "@/lib/api";
import { JournalBookIcon } from "@/components/icons/JewelryIcons";

const FALLBACK_ARTICLES: Article[] = [
  {
    id: 101,
    slug: "silver-and-gemstone-care-guide",
    title: "راهنمای نگهداری و تمیز کردن زیورآلات نقره و سنگ‌های طبیعی",
    summary: "چگونه از درخشش و جلای ماندگار نقره ۹۲۵ و سنگ‌های اصیل فیروزه و عقیق در برابر کدر شدن و سایش محافظت کنیم؟",
    content: "زیورآلات نقره به دلیل زیبایی و اصالت خود، جایگاه ویژه‌ای در دنیای جواهرات دارند. برای حفظ درخشش نقره و جلوگیری از اکسید شدن، رعایت نکات نگهداری و شستشوی اصولی ضروری است.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  {
    id: 102,
    slug: "identifying-authentic-neyshabur-turquoise",
    title: "رازهای تشخیص سنگ فیروزه اصل نیشابور از نمونه‌های بهسازی‌شده",
    summary: "بررسی شناسنامه سنگ، طیف رنگی آبی آسمانی تا سبز زیتونی و شناخت رگه‌های شجری در فیروزه فاخر نیشابور.",
    content: "فیروزه نیشابور از کهن‌ترین و گرانبهاترین سنگ‌های تزیینی ایران است که به دلیل ساختار معدنی خاص و سختی مناسب، در تمام جهان شهرتی افسانه‌ای دارد.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 103,
    slug: "art-of-minimalist-silver-jewelry-styling",
    title: "هنر استایل و ست کردن زیورآلات نقره مینیمال در مراسم و زندگی روزمره",
    summary: "اصول هماهنگی گردنبندهای چندلایه، ترکیب عقیق یمنی با نقره ۹۲۵ و تکنیک‌های لایه‌بندی دستبندها برای ظاهری اشرافی و مدرن.",
    content: "در دنیای امروز، زیورآلات مینیمال بیانگر سلیقه‌ای خاص، پیراسته و بی‌زمان هستند. ترکیب خطوط تمیز نقره با سنگ‌های معدنی جلوه‌ای لوکس و منحصر‌به‌فرد پدید می‌آورد.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
];

export default function ArticlesPage() {
  const { t, language } = useAppStore();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let ignore = false;
    async function loadArticles() {
      setIsLoading(true);
      try {
        const liveArticles = await fetchArticles();
        if (!ignore) {
          if (Array.isArray(liveArticles) && liveArticles.length > 0) {
            setArticles(liveArticles);
          } else {
            setArticles(FALLBACK_ARTICLES);
          }
        }
      } catch {
        if (!ignore) {
          setArticles(FALLBACK_ARTICLES);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    loadArticles();
    return () => {
      ignore = true;
    };
  }, []);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase().trim();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        (a.content && a.content.toLowerCase().includes(q))
    );
  }, [articles, searchQuery]);

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (language === "fa") {
        return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(d);
      }
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getImageUrl = (url?: string | null, fallbackIndex = 0) => {
    if (url && url.startsWith("http")) return url;
    if (url && url.startsWith("/")) return `${API_BASE_URL}${url}`;
    const defaultImages = [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
    ];
    return defaultImages[fallbackIndex % defaultImages.length];
  };

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-zinc-950 transition-colors duration-500 pb-24">
      {/* Header Section */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-[#C4852B]/20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle,rgba(196,133,43,0.12)_0%,rgba(250,249,245,0)_70%)] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <span className="inline-block text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#C4852B] font-bold mb-3 px-3.5 py-1 rounded-full border border-[#C4852B]/30 bg-[#C4852B]/10">
            {t.articles.tag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-zinc-950 mb-4 leading-tight">
            {t.articles.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-[#626667] max-w-2xl mx-auto mb-8 leading-relaxed">
            {t.articles.subtitle}
          </p>

          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.articles.searchPlaceholder}
              className="w-full pl-10 pr-10 py-3 rounded-full border border-zinc-300 bg-white text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#C4852B] focus:ring-2 focus:ring-[#C4852B]/20 shadow-xs transition-all"
            />
            <span className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 rtl:right-auto rtl:left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 pt-12 sm:pt-16">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-3 border-[#C4852B]/30 border-t-[#C4852B] rounded-full animate-spin"></div>
            <span className="text-xs text-[#C4852B] font-mono tracking-widest uppercase font-bold">
              {language === "fa" ? "در حال بارگذاری مقالات..." : "Loading Journal..."}
            </span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200/80 p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-[#660000]/5 text-[#660000] flex items-center justify-center mx-auto mb-4">
              <JournalBookIcon className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 mb-2">{t.articles.empty}</h3>
            <p className="text-xs text-zinc-500 mb-6">
              {searchQuery ? "مقاله‌ای با این عبارت جستجو یافت نشد." : "به زودی مقالات جدید اضافه خواهند شد."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-5 py-2 rounded-full bg-[#660000] text-white text-xs font-bold uppercase tracking-wider"
              >
                پاک کردن جستجو
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Article Card (if first item exists) */}
            {featuredArticle && (
              <div className="group relative bg-white rounded-3xl overflow-hidden border border-[#C4852B]/25 shadow-xl hover:shadow-2xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[260px] sm:min-h-[340px] overflow-hidden bg-zinc-100">
                  <img
                    src={getImageUrl(featuredArticle.imageUrl, 0)}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-3 py-1 rounded-full bg-[#660000] text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                    Featured
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-[#C4852B] font-mono font-semibold mb-3">
                      <span>{formatDate(featuredArticle.createdAt)}</span>
                      <span>•</span>
                      <span>5 {t.articles.readingTime}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-950 mb-4 leading-tight group-hover:text-[#C4852B] transition-colors">
                      <Link href={`/articles/${featuredArticle.slug}`}>
                        {featuredArticle.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#626667] leading-relaxed mb-6 line-clamp-3">
                      {featuredArticle.summary}
                    </p>
                  </div>

                  <div>
                    <Link
                      href={`/articles/${featuredArticle.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#660000] hover:bg-[#7D0000] text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                    >
                      <span>{t.articles.readMore}</span>
                      <span className="text-sm">←</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Other Articles */}
            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {gridArticles.map((art, idx) => (
                  <article
                    key={art.id || art.slug}
                    className="group bg-white rounded-2xl overflow-hidden border border-[#C4852B]/20 shadow-sm hover:shadow-xl hover:border-[#C4852B]/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                        <img
                          src={getImageUrl(art.imageUrl, idx + 1)}
                          alt={art.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="p-5 sm:p-6">
                        <div className="flex items-center gap-2 text-[10px] text-[#C4852B] font-mono font-semibold mb-2">
                          <span>{formatDate(art.createdAt)}</span>
                          <span>•</span>
                          <span>4 {t.articles.readingTime}</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-zinc-950 mb-2 leading-snug group-hover:text-[#C4852B] transition-colors line-clamp-2">
                          <Link href={`/articles/${art.slug}`}>
                            {art.title}
                          </Link>
                        </h3>

                        <p className="text-xs text-[#626667] leading-relaxed line-clamp-3">
                          {art.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2">
                      <Link
                        href={`/articles/${art.slug}`}
                        className="text-xs font-bold text-[#660000] hover:text-[#C4852B] inline-flex items-center gap-1.5 uppercase tracking-wider transition-colors"
                      >
                        <span>{t.articles.readMore}</span>
                        <span>←</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explore Jewelry Bottom Banner */}
      <section className="container mx-auto px-4 sm:px-6 md:px-12 mt-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#660000] via-[#7A0000] to-[#660000] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl border border-[#C4852B]/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(196,133,43,0.2)_0%,transparent_70%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-3">
              {t.articles.exploreJewelry}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-200 mb-6 leading-relaxed">
              {t.articles.exploreJewelryDesc}
            </p>
            <Link
              href="/collections"
              className="inline-block px-8 py-3.5 rounded-full bg-[#C4852B] hover:bg-[#D4953B] text-zinc-950 font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg hover:scale-105"
            >
              {t.hero.explore}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
