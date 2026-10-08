import { Product } from '@/data/products';
import { BackendProduct, API_BASE_URL } from '@/lib/api';
import { translateDynamicText } from '@/lib/dynamicTranslator';

export function inferCategorySlug(name: string, categoryName?: string, categoryId?: number): 'rings' | 'necklaces' | 'bracelets' | 'earrings' {
  const combined = `${name} ${categoryName || ''}`.toLowerCase();
  if (categoryId === 1 || combined.includes('دستبند') || combined.includes('bracelet')) return 'bracelets';
  if (categoryId === 2 || combined.includes('انگشتر') || combined.includes('ring') || combined.includes('حلقه')) return 'rings';
  if (categoryId === 3 || combined.includes('گردنبند') || combined.includes('آویز') || combined.includes('necklace') || combined.includes('pendant')) return 'necklaces';
  if (categoryId === 4 || combined.includes('گوشواره') || combined.includes('earring')) return 'earrings';
  return 'rings';
}

// Convert Backend product to Frontend product with automatic localization
export function mapBackendToFrontend(bp: BackendProduct): Product {
  const imageUrl = bp.imageUrl 
    ? (bp.imageUrl.startsWith('http') ? bp.imageUrl : `${API_BASE_URL}${bp.imageUrl}`)
    : "/images/hero-silver-bg.jpg";

  const effectiveCatId = bp.categoryId ?? bp.category?.id;
  const effectiveCatName = bp.categoryName || bp.category?.name;
  const catSlug = inferCategorySlug(bp.name, effectiveCatName, effectiveCatId);

  const galleryUrls = (bp.galleryImages || [])
    .filter(Boolean)
    .map((img) => (img.startsWith('http') ? img : `${API_BASE_URL}${img}`));
  const allImages = [imageUrl, ...galleryUrls.filter((u) => u !== imageUrl)];

  return {
    id: bp.id,
    nameFa: bp.name,
    nameEn: translateDynamicText(bp.name, 'en'),
    nameAr: translateDynamicText(bp.name, 'ar'),
    price: bp.livePriceToman || 0,
    category: catSlug,
    categoryId: effectiveCatId,
    categoryFa: effectiveCatName || (catSlug === 'rings' ? 'انگشتر' : catSlug === 'necklaces' ? 'گردنبند' : catSlug === 'bracelets' ? 'دستبند' : 'گوشواره'),
    categoryEn: translateDynamicText(effectiveCatName || catSlug, 'en'),
    categoryAr: translateDynamicText(effectiveCatName || catSlug, 'ar'),
    materialFa: `نقره ۹۲۵ عیار خالص ${bp.weight ? `(${bp.weight} گرم)` : ''}`,
    materialEn: `Certified 925 Sterling Silver ${bp.weight ? `(${bp.weight}g)` : ''}`,
    materialAr: `فضة نقية استرليني عيار 925 ${bp.weight ? `(${bp.weight} جرام)` : ''}`,
    descriptionFa: `طراحی اصیل نقره با فرمول قیمت‌گذاری پویا بر پایه نرخ لحظه‌ای TGJU. موجودی: ${bp.stockQuantity} عدد`,
    descriptionEn: `Authentic fine silver with dynamic TGJU live pricing. In stock: ${bp.stockQuantity} pcs`,
    descriptionAr: `فضة نقية أصيلة مع تسعير مباشر وفق أسعار السوق الحية. المتوفر: ${bp.stockQuantity} قطع`,
    image: imageUrl,
    images: allImages.length > 0 ? allImages : [imageUrl],
    weightGram: bp.weight || 4.2,
    carat: "Silver 925",
    featured: bp.badge === 'BEST_SELLER' || bp.badge === 'SPECIAL_OFFER',
  };
}
