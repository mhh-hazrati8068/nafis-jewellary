import { Language } from './translations';

// High-precision Jewelry Domain Dictionary for instant client-side translation
const JEWELRY_DICTIONARY: Record<string, { en: string; ar: string }> = {
  // Categories & Jewelry Types
  'انگشتر و حلقه نقره': { en: 'Silver Rings & Bands', ar: 'خواتم ودبلات فضة' },
  'انگشتر و حلقه نقره ۹۲۵': { en: '925 Silver Rings & Bands', ar: 'خواتم ودبلات فضة 925' },
  'گردنبند نقره و سنگ عقیق': { en: 'Silver & Agate Necklaces', ar: 'قلائد فضة وعقيق' },
  'گردنبند نقره و فیروزه': { en: 'Silver & Turquoise Necklaces', ar: 'قلائد فضة وفيروز' },
  'دستبند و زنجیر': { en: 'Bracelets & Chains', ar: 'أساور وسلاسل' },
  'دستبند نقره': { en: 'Silver Bracelet', ar: 'سوار فضة' },
  'انگشتر': { en: 'Ring', ar: 'خاتم' },
  'انگشترها': { en: 'Rings', ar: 'الخواتم' },
  'گردنبند': { en: 'Necklace', ar: 'قلادة' },
  'گردنبندها': { en: 'Necklaces', ar: 'القلائد' },
  'دستبند': { en: 'Bracelet', ar: 'سوار' },
  'دستبندها': { en: 'Bracelets', ar: 'الأساور' },
  'گوشواره': { en: 'Earrings', ar: 'أقراط' },
  'گوشواره‌ها': { en: 'Earrings', ar: 'الأقراط' },
  'حلقه': { en: 'Band / Ring', ar: 'دبلة / خاتم' },
  'نیم‌ست': { en: 'Half Set', ar: 'نصف طقم' },
  'ست': { en: 'Full Set', ar: 'طقم كامل' },
  'پلاک': { en: 'Pendant', ar: 'تعليقة' },
  'مدال': { en: 'Medallion', ar: 'ميدالية' },
  'زنجیر': { en: 'Chain', ar: 'سلسلة' },
  'کالکشن': { en: 'Collection', ar: 'مجموعة' },

  // Metals & Purity
  'نقره استرلینگ ۹۲۵': { en: '925 Sterling Silver', ar: 'فضة إسترليني 925' },
  'نقره ۹۲۵ دست‌ساز': { en: 'Handcrafted 925 Silver', ar: 'فضة 925 صياغة يدوية' },
  'نقره ۹۹۹ عیار خالص': { en: '999 Fine Pure Silver', ar: 'فضة عيار 999 نقية' },
  'نقره ۹۲۵': { en: '925 Sterling Silver', ar: 'فضة إسترليني 925' },
  'نقره ۹۹۹': { en: '999 Fine Silver', ar: 'فضة عيار 999' },
  'نقره دست‌ساز': { en: 'Handcrafted Silver', ar: 'فضة صناعة يدوية' },
  'زیورآلات نقره': { en: 'Silver Jewelry', ar: 'مجوهرات فضية' },
  'نقره': { en: 'Silver', ar: 'فضة' },
  'عیار': { en: 'Purity / Grade', ar: 'عيار' },

  // Gemstones & Minerals
  'سنگ فیروزه نیشابور اصل': { en: 'Genuine Neyshabur Turquoise', ar: 'فيروز نيسابوري أصلي' },
  'فیروزه نیشابور اصل': { en: 'Genuine Neyshabur Turquoise', ar: 'فيروز نيسابوري أصلي' },
  'فیروزه نیشابور': { en: 'Neyshabur Turquoise', ar: 'فيروز نيسابوري' },
  'فیروزه': { en: 'Turquoise', ar: 'فيروز' },
  'سنگ عقیق یمنی اصل': { en: 'Authentic Yemeni Agate', ar: 'عقيق يماني أصلي' },
  'عقیق یمنی': { en: 'Yemeni Agate', ar: 'عقيق يماني' },
  'سنگ عقیق': { en: 'Agate Gemstone', ar: 'حجر العقيق' },
  'عقیق': { en: 'Agate', ar: 'عقيق' },
  'الماس VVS': { en: 'VVS Diamond', ar: 'ألماس VVS نقي' },
  'الماس': { en: 'Diamond', ar: 'ألماس' },
  'مروارید طبیعی': { en: 'Natural Pearl', ar: 'لؤلؤ طبيعي' },
  'مروارید پرورشی': { en: 'Cultured Pearl', ar: 'لؤلؤ مستزرع' },
  'مروارید': { en: 'Pearl', ar: 'لؤلؤ' },
  'زمرد کلمبیا': { en: 'Colombian Emerald', ar: 'زمرد كولومبي' },
  'زمرد': { en: 'Emerald', ar: 'زمرد' },
  'یاقوت سرخ': { en: 'Ruby', ar: 'ياقوت أحمر' },
  'یاقوت کبود': { en: 'Blue Sapphire', ar: 'ياقوت أزرق' },
  'یاقوت': { en: 'Ruby / Sapphire', ar: 'ياقوت' },
  'زبرجد': { en: 'Peridot', ar: 'زبرجد' },
  'آمتیست': { en: 'Amethyst', ar: 'جمشت' },
  'در نجف': { en: 'Dur-e Najaf Quartz', ar: 'در النجف' },
  'توپاز': { en: 'Topaz', ar: 'توباز' },
  'لابرادوریت': { en: 'Labradorite', ar: 'لابرادوريت' },
  'اوپال': { en: 'Opal', ar: 'أوبال' },
  'تک‌نگین': { en: 'Solitaire Gem', ar: 'حجر منفرد' },
  'نگین': { en: 'Gemstone', ar: 'فص / حجر' },
  'سنگ': { en: 'Stone', ar: 'حجر' },

  // Craftsmanship & Attributes
  'دست‌ساز': { en: 'Handcrafted', ar: 'صناعة يدوية' },
  'مردانه': { en: 'Men\'s', ar: 'رجالي' },
  'زنانه': { en: 'Women\'s', ar: 'نسائي' },
  'مینیمال': { en: 'Minimalist', ar: 'مينيمال عصري' },
  'کلاسیک': { en: 'Classic', ar: 'كلاسيكي' },
  'مدرن': { en: 'Modern', ar: 'حديث' },
  'سلطنتی': { en: 'Royal', ar: 'ملكي' },
  'ازدواج': { en: 'Wedding', ar: 'زواج' },
  'آویز': { en: 'Pendant / Dangle', ar: 'متدلي' },
  'زنجیری': { en: 'Chain Link', ar: 'جنزير' },
  'طراحی اصیل': { en: 'Authentic Design', ar: 'تصميم أصيل' },

  // Pricing & Metrics
  'گرم': { en: 'grams', ar: 'جرام' },
  'تومان': { en: 'Toman', ar: 'تومان' },
  'موجودی:': { en: 'In stock:', ar: 'المتوفر:' },
  'موجودی': { en: 'Stock', ar: 'المخزون' },
  'عدد': { en: 'items', ar: 'قطع' },
  'اجرت ساخت': { en: 'Making Charge', ar: 'أجور الصياغة' },
  'قیمت زنده': { en: 'Live Price', ar: 'السعر المباشر' },
  'نرخ لحظه‌ای': { en: 'Live Market Rate', ar: 'السعر الفوري' },
  'محاسبه‌گر': { en: 'Calculator', ar: 'حاسبة' },
  'فاکتور': { en: 'Invoice', ar: 'فاتورة' },
  'سفارش': { en: 'Order', ar: 'طلب' },
  'پرداخت شده': { en: 'Paid', ar: 'تم الدفع' },
  'در انتظار پرداخت': { en: 'Pending Payment', ar: 'بانتظار الدفع' },
  'تکمیل شده': { en: 'Completed', ar: 'مكتمل' },
};

/**
 * Translates dynamic text (e.g. backend product titles, stone names, descriptions)
 * using client-side dictionary replacement.
 */
export function translateDynamicText(text: string | undefined | null, lang: Language): string {
  if (!text) return '';
  if (lang === 'fa') return text;

  // Direct match lookup first
  const trimmed = text.trim();
  if (JEWELRY_DICTIONARY[trimmed]) {
    return JEWELRY_DICTIONARY[trimmed][lang];
  }

  // Token / Substring replacement in order of phrase length (longest first)
  let result = text;
  const sortedKeys = Object.keys(JEWELRY_DICTIONARY).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (result.includes(key)) {
      const repl = JEWELRY_DICTIONARY[key][lang];
      result = result.split(key).join(repl);
    }
  }

  // Common description sentence patterns
  if (lang === 'en') {
    result = result
      .replace(/طراحی اصیل نقره با فرمول قیمت‌گذاری پویا بر پایه نرخ لحظه‌ای TGJU\. موجودی: (\d+) عدد/g, 'Authentic fine silver with dynamic TGJU live pricing. In stock: $1 pcs')
      .replace(/با فرمول قیمت‌گذاری پویا/g, 'with dynamic pricing formula');
  } else if (lang === 'ar') {
    result = result
      .replace(/طراحی اصیل نقره با فرمول قیمت‌گذاری پویا بر پایه نرخ لحظه‌ای TGJU\. موجودی: (\d+) عدد/g, 'فضة نقية أصيلة مع تسعير مباشر وفق أسعار السوق الحية. المتوفر: $1 قطع')
      .replace(/با فرمول قیمت‌گذاری پویا/g, 'مع تسعير فوري ديناميكي');
  }

  return result;
}

/**
 * Helper to get localized product name
 */
export function getProductName(
  product: { nameFa?: string; nameEn?: string; nameAr?: string; name?: string },
  lang: Language
): string {
  if (lang === 'fa') return product.nameFa || product.name || '';
  if (lang === 'ar') {
    if (product.nameAr) return product.nameAr;
    return translateDynamicText(product.nameFa || product.name || '', 'ar');
  }
  // English
  if (product.nameEn && product.nameEn !== product.nameFa) return product.nameEn;
  return translateDynamicText(product.nameFa || product.name || '', 'en');
}

/**
 * Helper to get localized product category
 */
export function getProductCategory(
  product: { categoryFa?: string; categoryEn?: string; categoryAr?: string; category?: string },
  lang: Language
): string {
  if (lang === 'fa') return product.categoryFa || product.category || '';
  if (lang === 'ar') {
    if (product.categoryAr) return product.categoryAr;
    return translateDynamicText(product.categoryFa || product.category || '', 'ar');
  }
  // English
  if (product.categoryEn && product.categoryEn !== product.categoryFa) return product.categoryEn;
  return translateDynamicText(product.categoryFa || product.category || '', 'en');
}

/**
 * Helper to get localized product material
 */
export function getProductMaterial(
  product: { materialFa?: string; materialEn?: string; materialAr?: string },
  lang: Language
): string {
  if (lang === 'fa') return product.materialFa || '';
  if (lang === 'ar') {
    if (product.materialAr) return product.materialAr;
    return translateDynamicText(product.materialFa || '', 'ar');
  }
  // English
  if (product.materialEn && product.materialEn !== product.materialFa) return product.materialEn;
  return translateDynamicText(product.materialFa || '', 'en');
}

/**
 * Helper to get localized product description
 */
export function getProductDescription(
  product: { descriptionFa?: string; descriptionEn?: string; descriptionAr?: string },
  lang: Language
): string {
  if (lang === 'fa') return product.descriptionFa || '';
  if (lang === 'ar') {
    if (product.descriptionAr) return product.descriptionAr;
    return translateDynamicText(product.descriptionFa || '', 'ar');
  }
  // English
  if (product.descriptionEn && product.descriptionEn !== product.descriptionFa) return product.descriptionEn;
  return translateDynamicText(product.descriptionFa || '', 'en');
}

/**
 * Optional async browser translator with LocalStorage cache for custom long texts
 */
export async function getClientCachedTranslation(text: string, targetLang: Language): Promise<string> {
  if (!text || targetLang === 'fa') return text;

  const cacheKey = `nafis_tr_${targetLang}_${text.substring(0, 40)}`;
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  }

  // Fallback to dictionary translator first
  const dictTranslated = translateDynamicText(text, targetLang);
  if (dictTranslated !== text) {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(cacheKey, dictTranslated); } catch {}
    }
    return dictTranslated;
  }

  return dictTranslated;
}
