import { MetadataRoute } from 'next';
import { API_BASE_URL } from '@/lib/api';

export const dynamic = "force-static";

const KNOWN_PRODUCT_IDS = [
  "19", "20", "21", "22", "23", "24", "25", "26", 
  "27", "28", "35", "36", "37", "38", "39"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nafiseebadijewellery.com';
  const currentDate = new Date();

  // Static routes
  const staticRoutes = [
    '',
    '/shop',
    '/collections',
    '/rings',
    '/necklaces',
    '/bracelets',
    '/earrings',
    '/articles',
    '/about',
    '/contact',
    '/stores',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: (route === '' || route === '/shop' || route === '/articles' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : route === '/shop' || route === '/collections' ? 0.9 : 0.8,
  }));

  // Article routes
  const articleSlugs = [
    'silver-and-gemstone-care-guide',
    'identifying-authentic-neyshabur-turquoise',
    'art-of-minimalist-silver-jewelry-styling'
  ];
  const articleRoutes = articleSlugs.map((slug) => ({
    url: `${baseUrl}/articles/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Real Product routes
  const productIds = new Set<string>(KNOWN_PRODUCT_IDS);
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, { cache: 'no-store' });
    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items)) {
        items.forEach((it: any) => {
          if (it?.id) productIds.add(it.id.toString());
        });
      }
    }
  } catch {}

  const productRoutes: MetadataRoute.Sitemap = Array.from(productIds).map((id) => ({
    url: `${baseUrl}/product/${id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes, ...productRoutes];
}
