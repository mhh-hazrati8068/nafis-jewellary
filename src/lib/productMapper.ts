import { Product } from '@/data/products';
import { BackendProduct, API_BASE_URL } from '@/lib/api';
import { translateDynamicText } from '@/lib/dynamicTranslator';
import { parseProductMetadataFromDescription } from '@/lib/stoneSpecs';

const SET_TOKEN_REGEX = /(?:^|[\s\-_\/])(ست|نیم‌?ست|سرویس|sets?|parure)(?:$|[\s\-_\/])/i;

export function inferCategorySlug(
  name: string,
  categoryName?: string,
  categoryId?: number
): Product['category'] {
  const nameLower = (name || '').toLowerCase();
  const catLower = (categoryName || '').toLowerCase();
  const combined = `${nameLower} ${catLower}`;

  // 1. Standalone stones (must precede fallback so stones never map to rings)
  if (
    categoryId === 6 ||
    catLower === 'سنگ' ||
    catLower === 'سنگ‌ها' ||
    catLower.includes('سنگ قرآنی') ||
    catLower.includes('سنگ‌های قرآنی') ||
    catLower.includes('gemstone') ||
    catLower.includes('stone') ||
    (nameLower.trim().startsWith('سنگ ') &&
      !nameLower.includes('انگشتر') &&
      !nameLower.includes('گردنبند') &&
      !nameLower.includes('گردن آویز') &&
      !nameLower.includes('گردن‌آویز') &&
      !nameLower.includes('دستبند') &&
      !nameLower.includes('گوشواره'))
  ) {
    return 'stones';
  }

  // 2. Sets & Half-sets (using token boundaries so "دستبند" never matches "ست")
  if (SET_TOKEN_REGEX.test(catLower) || SET_TOKEN_REGEX.test(nameLower)) {
    return 'sets';
  }

  // 3. Chains (independent from bracelets)
  if (
    catLower === 'زنجیر' ||
    catLower === 'زنجیر نقره' ||
    (catLower.includes('زنجیر') && !catLower.includes('دستبند')) ||
    ((nameLower.includes('زنجیر') || nameLower.includes('chain')) &&
      categoryId !== 1 &&
      categoryId !== 3 &&
      !nameLower.includes('دستبند') &&
      !nameLower.includes('گردنبند') &&
      !nameLower.includes('گردن آویز') &&
      !nameLower.includes('گردن‌آویز') &&
      !nameLower.includes('انگشتر') &&
      !nameLower.includes('گوشواره'))
  ) {
    return 'chains';
  }

  // 4. Core categories
  if (categoryId === 1 || combined.includes('دستبند') || combined.includes('bracelet')) return 'bracelets';
  if (categoryId === 2 || combined.includes('انگشتر') || combined.includes('ring') || combined.includes('حلقه')) return 'rings';
  if (categoryId === 3 || combined.includes('گردنبند') || combined.includes('گردن آویز') || combined.includes('گردن‌آویز') || combined.includes('آویز') || combined.includes('necklace') || combined.includes('pendant')) return 'necklaces';
  if (categoryId === 4 || combined.includes('گوشواره') || combined.includes('earring')) return 'earrings';

  return 'other';
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

  const purity = bp.purity || "925";
  const sizeSuffix = bp.size ? ` (${bp.size})` : "";
  const resolvedStoneName = bp.stoneName || bp.stone?.name || (catSlug === 'stones' ? bp.name : undefined);
  const parsedMeta = parseProductMetadataFromDescription(bp.description, resolvedStoneName);
  const cleanDesc = parsedMeta.cleanDescription;
  const hasRhodiumPlating = Boolean(bp.hasRhodiumPlating || parsedMeta.hasRhodiumPlating);

  // Use the product's own description; fall back to a concise product-specific summary without boilerplate
  const descriptionFa =
    cleanDesc ||
    (resolvedStoneName
      ? `${bp.name}؛ ساخته شده با نقره عیار ${purity} و مزین به ${resolvedStoneName}.`
      : `${bp.name}؛ اثر دست‌ساز نقره عیار ${purity} از مجموعه نفیسه عبادی.`);
  const descriptionEn = cleanDesc
    ? translateDynamicText(cleanDesc, 'en')
    : `Handcrafted ${purity} sterling silver creation: ${translateDynamicText(bp.name, 'en')}.`;
  const descriptionAr = cleanDesc
    ? translateDynamicText(cleanDesc, 'ar')
    : `قطعة فضة إسترلينية عيار ${purity} مصوغة يدوياً: ${translateDynamicText(bp.name, 'ar')}.`;

  return {
    id: bp.id,
    nameFa: bp.name,
    nameEn: translateDynamicText(bp.name, 'en'),
    nameAr: translateDynamicText(bp.name, 'ar'),
    price: bp.livePriceToman || 0,
    category: catSlug,
    categoryId: effectiveCatId,
    categoryFa: effectiveCatName || (catSlug === 'rings' ? 'انگشتر' : catSlug === 'necklaces' ? 'گردنبند' : catSlug === 'bracelets' ? 'دستبند' : catSlug === 'stones' ? 'سنگ' : catSlug === 'chains' ? 'زنجیر' : catSlug === 'sets' ? 'ست و نیم‌ست' : 'گوشواره'),
    categoryEn: translateDynamicText(effectiveCatName || catSlug, 'en'),
    categoryAr: translateDynamicText(effectiveCatName || catSlug, 'ar'),
    materialFa: `نقره ${purity} عیار خالص ${bp.weight ? `(${bp.weight} گرم)` : ''}${sizeSuffix}`,
    materialEn: `Certified ${purity} Sterling Silver ${bp.weight ? `(${bp.weight}g)` : ''}${sizeSuffix}`,
    materialAr: `فضة نقية استرليني عيار ${purity} ${bp.weight ? `(${bp.weight} جرام)` : ''}${sizeSuffix}`,
    descriptionFa,
    descriptionEn,
    descriptionAr,
    description: cleanDesc || undefined,
    purity,
    size: bp.size,
    stoneName: resolvedStoneName,
    stoneSpecs: parsedMeta.stoneSpecs,
    hasRhodiumPlating,
    createdAt: bp.createdAt,
    updatedAt: bp.updatedAt,
    image: imageUrl,
    images: allImages.length > 0 ? allImages : [imageUrl],
    weightGram: bp.weight || 4.2,
    carat: `Silver ${purity}`,
    featured: bp.badge === 'BEST_SELLER' || bp.badge === 'SPECIAL_OFFER',
  };
}
