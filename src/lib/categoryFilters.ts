import { Product } from '@/data/products';

export type CollectionFilter = 'women' | 'men' | 'sets' | 'stones' | 'bracelets' | 'chains';
export type SubCategoryFilter = 'all' | 'necklaces' | 'rings' | 'bracelets';

const SET_REGEX = /(?:^|[\s\-_\/])(ست|نیم‌?ست|سرویس|sets?|parure)(?:$|[\s\-_\/])/i;
const MEN_REGEX = /(?:مردانه|آقایان|پسرانه|\bmen\b|\bmens\b|\bman\b)/i;
const WOMEN_REGEX = /(?:زنانه|بانوان|دخترانه|\bwomen\b|\bwomens\b)/i;
const MIYUKI_REGEX = /(?:میوکی|miyuki)/i;

function getNameAndCategoryText(p: Product): string {
  return `${p.nameFa || ''} ${p.nameEn || ''} ${p.categoryFa || ''}`;
}

function getSearchableText(p: Product): string {
  return `${p.nameFa || ''} ${p.nameEn || ''} ${p.categoryFa || ''} ${p.description || ''} ${p.descriptionFa || ''}`;
}

export function normalizePersianSearch(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function matchesCategoryKeyword(p: Product, categoryName?: string): boolean {
  const keyword = normalizePersianSearch(categoryName || '');
  if (!keyword) return false;
  const hay = normalizePersianSearch(getNameAndCategoryText(p));
  return hay.includes(keyword);
}

export function isStandaloneStone(p: Product): boolean {
  if (p.category === 'stones' || p.categoryId === 6) return true;
  const cat = (p.categoryFa || '').trim();
  if (cat === 'سنگ' || cat === 'سنگ‌ها' || cat.includes('سنگ قرآنی') || cat.includes('سنگ‌های قرآنی')) {
    return true;
  }
  const name = (p.nameFa || '').trim();
  return (
    name.startsWith('سنگ ') &&
    !name.includes('انگشتر') &&
    !name.includes('گردنبند') &&
    !name.includes('گردن آویز') &&
    !name.includes('گردن‌آویز') &&
    !name.includes('دستبند') &&
    !name.includes('گوشواره')
  );
}

export function isSetProduct(p: Product): boolean {
  if (p.category === 'sets') return true;
  return SET_REGEX.test(p.categoryFa || '') || SET_REGEX.test(p.nameFa || '');
}

export function isChainProduct(p: Product): boolean {
  if (p.category === 'chains') return true;
  const cat = (p.categoryFa || '').toLowerCase();
  const name = (p.nameFa || '').toLowerCase();
  if (cat.includes('زنجیر') && !cat.includes('دستبند')) return true;
  return (
    (name.includes('زنجیر') || name.includes('chain')) &&
    p.categoryId !== 1 &&
    p.categoryId !== 3 &&
    !name.includes('دستبند') &&
    !name.includes('گردنبند') &&
    !name.includes('گردن آویز') &&
    !name.includes('گردن‌آویز') &&
    !name.includes('انگشتر') &&
    !name.includes('گوشواره')
  );
}

export function isBraceletOnlyProduct(p: Product): boolean {
  return (p.category === 'bracelets' || p.categoryId === 1) && !isChainProduct(p);
}

export function isMenProduct(p: Product): boolean {
  return MEN_REGEX.test(getNameAndCategoryText(p)) || MEN_REGEX.test(getSearchableText(p));
}

export function isWomenExplicit(p: Product): boolean {
  return WOMEN_REGEX.test(getNameAndCategoryText(p)) || WOMEN_REGEX.test(getSearchableText(p));
}

export function isMiyukiProduct(p: Product): boolean {
  return MIYUKI_REGEX.test(getSearchableText(p));
}

/**
 * Women's Specialized Collection:
 * Includes items explicitly marked Women's/زنانه/بانوان in their name/category,
 * plus women's necklaces/pendants, rings, and bracelets (excluding men's items and standalone stones).
 */
export function matchesWomenCollection(p: Product, subCat: SubCategoryFilter = 'all'): boolean {
  if (isStandaloneStone(p)) return false;
  if (MEN_REGEX.test(getNameAndCategoryText(p))) return false;
  if (subCat !== 'all' && p.category !== subCat) return false;
  if (WOMEN_REGEX.test(getNameAndCategoryText(p))) return true;
  if (isMenProduct(p)) return false;
  if (isSetProduct(p) || isChainProduct(p)) return false;
  return p.category === 'necklaces' || p.category === 'rings' || p.category === 'bracelets';
}

/**
 * Men's Luxury Collection:
 * Dynamically includes every product whose name/category contains "مردانه" / "آقایان" / "men"
 * (while excluding explicitly women's items, Miyuki, and standalone stones unless named men's),
 * and filters by subcategory when requested.
 */
export function matchesMenCollection(p: Product, subCat: SubCategoryFilter = 'all'): boolean {
  if (isWomenExplicit(p) || isMiyukiProduct(p)) return false;
  if (isStandaloneStone(p) && !MEN_REGEX.test(getNameAndCategoryText(p))) return false;
  if (!isMenProduct(p)) return false;
  if (subCat !== 'all' && p.category !== subCat) return false;
  return true;
}

export function filterProductsByCollection(
  products: Product[],
  filter: CollectionFilter,
  subCat: SubCategoryFilter = 'all'
): Product[] {
  switch (filter) {
    case 'sets':
      return products.filter(isSetProduct);
    case 'women':
      return products.filter((p) => matchesWomenCollection(p, subCat));
    case 'men':
      return products.filter((p) => matchesMenCollection(p, subCat));
    case 'stones':
      return products.filter(isStandaloneStone);
    case 'bracelets':
      return products.filter(isBraceletOnlyProduct);
    case 'chains':
      return products.filter(isChainProduct);
    default:
      return products;
  }
}
