import type { Metadata } from "next";
import ArticleDetailView from "@/components/article/ArticleDetailView";
import { fetchArticles, fetchArticleBySlug } from "@/lib/api";

const STATIC_FALLBACK_SLUGS = [
  "silver-and-gemstone-care-guide",
  "identifying-authentic-neyshabur-turquoise",
  "art-of-minimalist-silver-jewelry-styling",
];

const ARTICLE_TITLES: Record<string, { title: string; summary: string; image: string }> = {
  "silver-and-gemstone-care-guide": {
    title: "راهنمای نگهداری و تمیز کردن زیورآلات نقره و سنگ‌های طبیعی",
    summary: "چگونه از درخشش و جلای ماندگار نقره ۹۲۵ و سنگ‌های اصیل فیروزه و عقیق در برابر کدر شدن و سایش محافظت کنیم؟",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
  },
  "identifying-authentic-neyshabur-turquoise": {
    title: "رازهای تشخیص سنگ فیروزه اصل نیشابور از نمونه‌های بهسازی‌شده",
    summary: "بررسی شناسنامه سنگ، طیف رنگی آبی آسمانی تا سبز زیتونی و شناخت رگه‌های شجری در فیروزه فاخر نیشابور.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
  },
  "art-of-minimalist-silver-jewelry-styling": {
    title: "هنر ست کردن زیورآلات نقره مینیمال در استایل‌های مدرن",
    summary: "اصول لایه‌بندی گردنبندهای ظریف، ترکیب دستبندهای زنجیری و انتخاب انگشتر مناسب با فرم دست.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
  },
};

export async function generateStaticParams() {
  const slugs = new Set<string>(STATIC_FALLBACK_SLUGS);
  try {
    const liveArticles = await fetchArticles();
    if (Array.isArray(liveArticles)) {
      liveArticles.forEach((a) => {
        if (a.slug) slugs.add(a.slug);
      });
    }
  } catch {
    // Fallback static slugs will be used
  }

  return Array.from(slugs).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = ARTICLE_TITLES[slug];

  const title = meta?.title || "مقاله تخصصی گوهرشناسی و نقره ۹۲۵";
  const summary = meta?.summary || "ژورنال تخصصی زیورآلات نقره استرلینگ ۹۲۵ دست‌ساز و سنگ‌های طبیعی اصیل.";
  const image = meta?.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop";
  const pageTitle = `${title} | ژورنال زیورآلات نفیسه عبادی`;

  return {
    title: pageTitle,
    description: summary,
    keywords: [
      "زیورآلات نقره ۹۲۵",
      "فیروزه نیشابور",
      "عقیق یمنی",
      "نگهداری نقره",
      "گوهرشناسی",
      "نقره دست‌ساز نفیسه عبادی"
    ],
    openGraph: {
      title: pageTitle,
      description: summary,
      url: `https://nafiseebadijewellery.com/articles/${slug}`,
      type: "article",
      images: [
        {
          url: image,
          width: 1000,
          height: 600,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: summary,
      images: [image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = ARTICLE_TITLES[slug];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": meta?.title || "مقاله تخصصی زیورآلات نقره",
    "description": meta?.summary || "ژورنال تخصصی گوهرشناسی و نگهداری نقره",
    "image": meta?.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
    "author": {
      "@type": "Organization",
      "name": "زیورآلات نفیسه عبادی"
    },
    "publisher": {
      "@type": "Organization",
      "name": "زیورآلات نفیسه عبادی",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nafiseebadijewellery.com/logo.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://nafiseebadijewellery.com/articles/${slug}`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ArticleDetailView slug={slug} />
    </>
  );
}
