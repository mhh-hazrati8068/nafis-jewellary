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
    '/about',
    '/contact',
    '/stores',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: (route === '' || route === '/shop' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : route === '/shop' || route === '/collections' ? 0.9 : 0.8,
  }));

  // Product detail dynamic routes
  const productRoutes = initialProducts.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
