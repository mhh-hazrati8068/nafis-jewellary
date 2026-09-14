"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { Article, fetchArticleBySlug, API_BASE_URL } from "@/lib/api";

const FALLBACK_ARTICLES: Record<string, Article> = {
  "silver-and-gemstone-care-guide": {
    id: 101,
    slug: "silver-and-gemstone-care-guide",
    title: "راهنمای نگهداری و تمیز کردن زیورآلات نقره و سنگ‌های طبیعی",
    summary: "چگونه از درخشش و جلای ماندگار نقره ۹۲۵ و سنگ‌های اصیل فیروزه و عقیق در برابر کدر شدن و سایش محافظت کنیم؟",
    content: `زیورآلات نقره و سنگ‌های قیمتی به دلیل زیبایی، ظرافت و اصالت خود، جلوه‌ای جاودانه به استایل شما می‌بخشند. برای حفظ درخشش نقره و جلوگیری از اکسیداسیون طبیعی در مجاورت هوا و رطوبت، رعایت چند نکته اساسی ضروری است:

### ۱. دور نگه داشتن از مواد شیمیایی و شوینده‌ها
عطرها، ادکلن‌ها، لوسیون‌های پوستی و شوینده‌های خانگی می‌توانند باعث کدر شدن سطح نقره و تغییر رنگ سنگ‌های طبیعی نظیر فیروزه شوند. همواره توصیه می‌شود زیورآلات خود را پس از اتمام آرایش و عطر زدن استفاده نمایید.

### ۲. نگهداری اصولی در جعبه‌های ضد رطوبت
هنگامی که از زیورآلات خود استفاده نمی‌کنید، آن‌ها را در جعبه‌های مخملی یا کیسه‌های زیپ‌دار بدون هوا نگهداری کنید تا از واکنش با اکسیژن و رطوبت هوا محافظت شوند.

### ۳. شستشوی ملایم با دستمال مخصوص
برای تمیز کردن سطوح نقره، از دستمال‌های نرم میکروفیبر مخصوص جلا دادن نقره استفاده کنید. هرگز از برس‌های زبر یا پودرهای ساینده استفاده نکنید زیرا باعث ایجاد خط و خش روی صیقل ظریف فلز می‌شوند.

### ۴. مراقبت ویژه از سنگ فیروزه نیشابور
سنگ فیروزه بافتی متخلخل و زنده دارد. از تماس مستقیم فیروزه با چربی پوست، روغن‌ها و آب داغ خودداری کنید تا رنگ آبی بی‌نظیر آن برای نسل‌ها پایدار بماند.`,
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date().toISOString(),
  },
  "identifying-authentic-neyshabur-turquoise": {
    id: 102,
    slug: "identifying-authentic-neyshabur-turquoise",
    title: "رازهای تشخیص سنگ فیروزه اصل نیشابور از نمونه‌های بهسازی‌شده",
    summary: "بررسی شناسنامه سنگ، طیف رنگی آبی آسمانی تا سبز زیتونی و شناخت رگه‌های شجری در فیروزه فاخر نیشابور.",
    content: `فیروزه نیشابور از کهن‌ترین و نامدارترین گوهرهای ایران‌زمین است که در سراسر بازارهای جهانی طلا و جواهر، به عنوان معیار کیفیت فیروزه شناخته می‌شود.

### شناسنامه و ویژگی‌های فیروزه اصیل نیشابور:
- **تنوع رنگی طبیعی:** از آبی آسمانی زنده و یکدست (عجمی) تا سبز آبی با رگه‌های طلایی و قهوه‌ای مسحورکننده (شجری).
- **سختی و بافت سنگ:** فیروزه معدن نیشابور سختی بالاتری نسبت به فیروزه‌های وارداتی دارد و در برابر حرارت و صیقل مقاومت نشان می‌دهد.
- **رگه‌های شجر طبیعی:** خطوط شجری در فیروزه اصل دارای عمق و الگوی کاملاً نامنظم و طبیعی هستند، در حالی که در نمونه‌های فیک رگه‌ها تکراری و سطحی به نظر می‌رسند.

تمام نگین‌های به‌کار رفته در زیورآلات نفیسه عبادی با ضمانت اصالت فیزیکی و فاکتور رسمی تقدیم همراهان گرامی می‌گردد.`,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  "art-of-minimalist-silver-jewelry-styling": {
    id: 103,
    slug: "art-of-minimalist-silver-jewelry-styling",
    title: "هنر استایل و ست کردن زیورآلات نقره مینیمال در مراسم و زندگی روزمره",
    summary: "اصول هماهنگی گردنبندهای چندلایه، ترکیب عقیق یمنی با نقره ۹۲۵ و تکنیک‌های لایه‌بندی دستبندها برای ظاهری اشرافی و مدرن.",
    content: `زیورآلات مینیمال به گونه‌ای طراحی شده‌اند که زیبایی شما را بدون اغراق بازتاب دهند. این طراحی‌ها به شما اجازه می‌دهند تا با ترکیب قطعات گوناگون، امضای استایل شخصی خود را خلق کنید.

### نکات کلیدی در چیدمان زیورآلات:
۱. **ترکیب لایه‌ای گردنبندها:** از یک چوکر نقره ظریف همراه با گردنبند آویزدار با طول متوسط استفاده کنید تا هماهنگی بصری چشم‌نوازی ایجاد شود.
۲. **تعادل در انتخاب انگشترها:** یک انگشتر نگین‌دار درشت در یک دست را با یک حلقه ساده و مینیمال در دست دیگر متعادل سازید.
۳. **تطابق رنگی سنگ‌ها:** ترکیب رنگ‌های گرم مانند عقیق سرخ یا فیروزه با خطوط تمیز نقره استرلینگ ۹۲۵، جلوه‌ای هم‌زمان کلاسیک و آوانگارد می‌سازد.`,
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
};

export default function ArticleDetailView({ slug }: { slug: string }) {
  const { t, language } = useAppStore();

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadArticle() {
      setIsLoading(true);
      try {
        const liveArticle = await fetchArticleBySlug(slug);
        if (!ignore) {
          if (liveArticle) {
            setArticle(liveArticle);
          } else if (FALLBACK_ARTICLES[slug]) {
            setArticle(FALLBACK_ARTICLES[slug]);
          } else {
            const decoded = decodeURIComponent(slug);
            setArticle(FALLBACK_ARTICLES[decoded] || null);
          }
        }
      } catch {
        if (!ignore) {
          const decoded = decodeURIComponent(slug);
          setArticle(FALLBACK_ARTICLES[decoded] || FALLBACK_ARTICLES[slug] || null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    loadArticle();
    return () => {
      ignore = true;
    };
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (language === "fa") {
        return new Intl.DateTimeFormat("fa-IR", { dateStyle: "long" }).format(d);
      }
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getImageUrl = (url?: string | null) => {
    if (url && url.startsWith("http")) return url;
    if (url && url.startsWith("/")) return `${API_BASE_URL}${url}`;
    return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop";
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center py-32 text-zinc-900">
        <div className="w-10 h-10 border-3 border-[#C4852B]/30 border-t-[#C4852B] rounded-full animate-spin mb-4"></div>
        <span className="text-xs text-[#C4852B] font-mono tracking-widest uppercase font-bold">
          {language === "fa" ? "در حال بارگذاری مقاله..." : "Loading Article..."}
        </span>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center py-32 px-4 text-center">
        <div className="text-4xl mb-4">📖</div>
        <h1 className="text-xl font-bold text-zinc-900 mb-2">مقاله مورد نظر یافت نشد</h1>
        <p className="text-xs text-zinc-500 mb-6">احتمالاً این مقاله حذف شده یا آدرس آن تغییر یافته است.</p>
        <Link
          href="/articles"
          className="px-6 py-2.5 rounded-full bg-[#660000] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#7D0000]"
        >
          {t.articles.backToArticles}
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-zinc-950 transition-colors duration-500 pb-24">
      {/* Breadcrumb Navigation */}
      <nav className="container mx-auto px-4 sm:px-6 md:px-12 pt-8 pb-4">
        <div className="flex items-center gap-2 text-[11px] text-[#626667] flex-wrap">
          <Link href="/" className="hover:text-[#C4852B] transition-colors">
            {language === "fa" ? "صفحه اصلی" : language === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/articles" className="hover:text-[#C4852B] transition-colors">
            {t.header.journal}
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-semibold truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </div>
      </nav>

      {/* Article Header */}
      <article className="container mx-auto px-4 sm:px-6 md:px-12 pt-4">
        <header className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-3 text-[11px] text-[#C4852B] font-mono font-bold mb-4 px-3.5 py-1 rounded-full border border-[#C4852B]/30 bg-[#C4852B]/10">
            <span>{formatDate(article.createdAt)}</span>
            <span>•</span>
            <span>5 {t.articles.readingTime}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-zinc-950 uppercase tracking-tight mb-6 leading-tight">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-sm sm:text-base md:text-lg text-[#660000] font-medium leading-relaxed max-w-2xl mx-auto mb-6">
              {article.summary}
            </p>
          )}

          {/* Author Badge & Share Button */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#C4852B]/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#C4852B]"></span>
              <span className="text-[11px] font-bold text-zinc-800 font-brand-en">
                Nafise Ebadi Atelier
              </span>
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-zinc-200 hover:border-[#C4852B] text-[11px] font-semibold text-zinc-700 transition-colors shadow-xs cursor-pointer"
            >
              <span>🔗</span>
              <span>{copied ? t.articles.copied : t.articles.share}</span>
            </button>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="max-w-4xl mx-auto aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[#C4852B]/30 mb-12 sm:mb-16 bg-zinc-100">
          <img
            src={getImageUrl(article.imageUrl)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-zinc-200/80 shadow-md">
          <div className="prose prose-zinc max-w-none text-xs sm:text-sm md:text-base leading-relaxed text-[#404040] space-y-6">
            {article.content.split("\n\n").map((block, idx) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("###")) {
                return (
                  <h3
                    key={idx}
                    className="text-base sm:text-lg md:text-xl font-extrabold text-zinc-950 mt-8 mb-3 text-[#660000] border-r-4 rtl:border-r-4 ltr:border-l-4 border-[#660000] pr-3 rtl:pr-3 ltr:pl-3"
                  >
                    {trimmed.replace(/^###\s*/, "")}
                  </h3>
                );
              }
              if (trimmed.startsWith("-") || trimmed.startsWith("•")) {
                const items = trimmed.split("\n").filter(Boolean);
                return (
                  <ul key={idx} className="list-disc pr-6 rtl:pr-6 ltr:pl-6 space-y-2 text-[#4a4a4a]">
                    {items.map((it, i) => (
                      <li key={i}>{it.replace(/^[-•]\s*/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx} className="leading-relaxed">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Bottom Actions inside Article Card */}
          <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#660000] hover:text-[#C4852B] transition-colors"
            >
              <span>←</span>
              <span>{t.articles.backToArticles}</span>
            </Link>

            <button
              onClick={handleCopyLink}
              className="px-5 py-2.5 rounded-full bg-[#FAF9F5] border border-[#C4852B]/40 hover:bg-[#C4852B] hover:text-white text-xs font-bold text-zinc-800 transition-all duration-300 shadow-xs cursor-pointer"
            >
              {copied ? t.articles.copied : t.articles.share}
            </button>
          </div>
        </div>
      </article>

      {/* Explore Products Section */}
      <section className="container mx-auto px-4 sm:px-6 md:px-12 mt-16 max-w-4xl">
        <div className="rounded-3xl bg-gradient-to-r from-[#660000] via-[#7A0000] to-[#660000] text-white p-8 sm:p-10 text-center relative overflow-hidden shadow-xl border border-[#C4852B]/30">
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-extrabold uppercase mb-2">
              {t.articles.exploreJewelry}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-200 mb-6">
              {t.articles.exploreJewelryDesc}
            </p>
            <Link
              href="/collections"
              className="inline-block px-8 py-3 rounded-full bg-[#C4852B] hover:bg-[#D4953B] text-zinc-950 font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 shadow-md"
            >
              {t.hero.explore}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
