import ArticleDetailView from "@/components/article/ArticleDetailView";
import { fetchArticles } from "@/lib/api";

const STATIC_FALLBACK_SLUGS = [
  "silver-and-gemstone-care-guide",
  "identifying-authentic-neyshabur-turquoise",
  "art-of-minimalist-silver-jewelry-styling",
];

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

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleDetailView slug={slug} />;
}
