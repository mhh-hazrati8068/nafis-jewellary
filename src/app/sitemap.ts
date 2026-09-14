import { MetadataRoute } from 'next';
import { initialProducts } from '@/data/products';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Product detail dynamic routes
  const productRoutes = initialProducts.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes, ...productRoutes];
}
