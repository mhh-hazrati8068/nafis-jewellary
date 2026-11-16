export interface StoneSpecifications {
  name?: string;            // نام سنگ
  color?: string;           // رنگ و طیف رنگی
  naturalStatus?: string;   // طبیعی یا مصنوعی بودن سنگ
  clarity?: string;         // ویژگی‌های ظاهری و میزان شفافیت
  pattern?: string;         // طرح، نقش یا رگه‌های شاخص
  origin?: string;          // محل خاستگاه
  uniqueFeatures?: string;  // ویژگی‌های اختصاصی و متمایز سنگ
}

export interface ParsedProductMetadata {
  cleanDescription: string;
  stoneSpecs: StoneSpecifications;
  hasRhodiumPlating: boolean;
}

const META_MARKER_START = '[[NAFIS_META]]';
const META_MARKER_END = '[[/NAFIS_META]]';

const NEGATED_RHODIUM_REGEX = /(?:بدون|فاقد|ندارد)\s*(?:آبکاری\s*)?(?:رادیوم|رودیوم|rhodium)/i;
const POSITIVE_RHODIUM_REGEX = /(?:آبکاری\s*(?:محافظ\s*)?(?:رادیوم|رودیوم)|دارای\s*آبکاری\s*(?:رادیوم|رودیوم)|rhodium[\s-]plated)/i;

export function parseProductMetadataFromDescription(
  rawDescription?: string | null,
  fallbackStoneName?: string | null
): ParsedProductMetadata {
  const raw = (rawDescription || '').trim();
  const stoneSpecs: StoneSpecifications = {};
  if (fallbackStoneName && fallbackStoneName.trim()) {
    stoneSpecs.name = fallbackStoneName.trim();
  }

  let hasRhodiumPlating = false;
  let cleanDescription = raw;

  const startIdx = raw.indexOf(META_MARKER_START);
  const endIdx = raw.indexOf(META_MARKER_END);

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const jsonChunk = raw
      .slice(startIdx + META_MARKER_START.length, endIdx)
      .trim();
    cleanDescription = (
      raw.slice(0, startIdx) + raw.slice(endIdx + META_MARKER_END.length)
    ).trim();

    try {
      const parsed = JSON.parse(jsonChunk) as {
        stoneSpecs?: StoneSpecifications;
        hasRhodiumPlating?: boolean;
      };
      if (parsed.stoneSpecs) {
        if (parsed.stoneSpecs.name) stoneSpecs.name = parsed.stoneSpecs.name;
        if (parsed.stoneSpecs.color) stoneSpecs.color = parsed.stoneSpecs.color;
        if (parsed.stoneSpecs.naturalStatus) stoneSpecs.naturalStatus = parsed.stoneSpecs.naturalStatus;
        if (parsed.stoneSpecs.clarity) stoneSpecs.clarity = parsed.stoneSpecs.clarity;
        if (parsed.stoneSpecs.pattern) stoneSpecs.pattern = parsed.stoneSpecs.pattern;
        if (parsed.stoneSpecs.origin) stoneSpecs.origin = parsed.stoneSpecs.origin;
        if (parsed.stoneSpecs.uniqueFeatures) stoneSpecs.uniqueFeatures = parsed.stoneSpecs.uniqueFeatures;
      }
      if (typeof parsed.hasRhodiumPlating === 'boolean') {
        hasRhodiumPlating = parsed.hasRhodiumPlating;
      }
    } catch {
      // Ignore malformed metadata block and fall back to plain text
    }
  } else if (raw) {
    if (!NEGATED_RHODIUM_REGEX.test(raw) && POSITIVE_RHODIUM_REGEX.test(raw)) {
      hasRhodiumPlating = true;
    }
  }

  return {
    cleanDescription,
    stoneSpecs,
    hasRhodiumPlating,
  };
}

export function serializeProductDescriptionWithSpecs(
  prose: string,
  specs: StoneSpecifications,
  hasRhodiumPlating: boolean
): string {
  const cleanProse = (prose || '').trim();
  const compactedSpecs: StoneSpecifications = {};
  if (specs.color?.trim()) compactedSpecs.color = specs.color.trim();
  if (specs.naturalStatus?.trim()) compactedSpecs.naturalStatus = specs.naturalStatus.trim();
  if (specs.clarity?.trim()) compactedSpecs.clarity = specs.clarity.trim();
  if (specs.pattern?.trim()) compactedSpecs.pattern = specs.pattern.trim();
  if (specs.origin?.trim()) compactedSpecs.origin = specs.origin.trim();
  if (specs.uniqueFeatures?.trim()) compactedSpecs.uniqueFeatures = specs.uniqueFeatures.trim();

  const hasAnySpecs = Object.keys(compactedSpecs).length > 0 || hasRhodiumPlating;
  if (!hasAnySpecs) {
    return cleanProse;
  }

  const payload = JSON.stringify({
    ...(Object.keys(compactedSpecs).length > 0 ? { stoneSpecs: compactedSpecs } : {}),
    ...(hasRhodiumPlating ? { hasRhodiumPlating: true } : {}),
  });

  return cleanProse
    ? `${cleanProse}\n\n${META_MARKER_START}${payload}${META_MARKER_END}`
    : `${META_MARKER_START}${payload}${META_MARKER_END}`;
}

