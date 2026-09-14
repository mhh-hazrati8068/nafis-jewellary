import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Solitaire Fine Ring Icon (انگشتر و حلقه جواهر)
 * Refined faceted gemstone set upon an elegant polished band
 */
export function RingIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Faceted Gemstone Crown */}
      <path d="M8.5 4.5h7l2.5 3-6 5.5-6-5.5 2.5-3Z" />
      <path d="M8.5 4.5l3.5 8.5 3.5-8.5" />
      <path d="M6 7.5h12" />
      {/* Ring Shank / Band */}
      <path d="M7 11.5c-2.4 1.8-4 4.7-4 8 0 2.5 4 4 9 4s9-1.5 9-4c0-3.3-1.6-6.2-4-8" />
    </svg>
  );
}

/**
 * Pendant Necklace Icon (گردنبند و آویز نفیس)
 * Gracefully draped chain suspending a faceted teardrop jewel
 */
export function NecklaceIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Elegant Draped Chain */}
      <path d="M4 3.5c1.5 5 4.5 9.5 8 9.5s6.5-4.5 8-9.5" />
      {/* Clasp / Bail */}
      <path d="M12 13v2.5" />
      {/* Faceted Solitaire Teardrop Pendant */}
      <path d="M12 15.5c-2 1.8-2.5 3.5-2.5 4.5a2.5 2.5 0 0 0 5 0c0-1-.5-2.7-2.5-4.5Z" />
      <circle cx="12" cy="19.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Tennis Bracelet / Bangle Icon (دستبند و النگو زنجیری)
 * Connected luxury gemstone links with clasp
 */
export function BraceletIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Oval Bangle Contour */}
      <ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-15 12 12)" />
      {/* Gemstone / Linked Stations */}
      <circle cx="7.5" cy="9.5" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
      <circle cx="16.5" cy="9" r="1" fill="currentColor" />
      <circle cx="16.5" cy="14.5" r="1" fill="currentColor" />
      <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
      <circle cx="7.5" cy="14.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * Drop Earrings Icon (گوشواره‌های جواهری و آویز)
 * Stud tops suspending faceted drop gems
 */
export function EarringsIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Left Earring */}
      <circle cx="8" cy="4.5" r="1.5" />
      <path d="M8 6v3" />
      <path d="M8 9l2 3.5-2 4.5-2-4.5L8 9Z" />
      <path d="M6 12.5h4" />

      {/* Right Earring */}
      <circle cx="16" cy="4.5" r="1.5" />
      <path d="M16 6v3" />
      <path d="M16 9l2 3.5-2 4.5-2-4.5L16 9Z" />
      <path d="M14 12.5h4" />
    </svg>
  );
}

/**
 * Diamond / Brilliant Gemstone Icon (الماس و سنگ‌های قیمتی)
 * Classic brilliant-cut octagon facet
 */
export function GemstoneIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 3.5h12l4.5 5.5-10.5 12L1.5 9 6 3.5Z" />
      <path d="M1.5 9h21" />
      <path d="M6 3.5L10 9l2 12 2-12 4-5.5" />
    </svg>
  );
}

/**
 * Jewelry Set / Parure Icon (سرویس و نیم‌ست)
 */
export function JewelrySetIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M3 5c2 4 5 7 9 7s7-3 9-7" />
      <path d="M12 12v3" />
      <polygon points="12,15 14,18 12,21 10,18" />
      {/* Companion Studs */}
      <circle cx="6" cy="18" r="1.75" />
      <circle cx="18" cy="18" r="1.75" />
    </svg>
  );
}

/**
 * Luxury Sparkle / Shimmer Star Icon (درخشش و جلوه لوکس)
 */
export function SparkleStarIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2v20M2 12h20" />
      <path d="M12 2c0 5.5 4.5 10 10 10-5.5 0-10 4.5-10 10 0-5.5-4.5-10-10-10 5.5 0 10-4.5 10-10Z" />
      <circle cx="18" cy="6" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="6" cy="18" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * 925 Silver Hallmark & Certificate Shield Icon (نشان اصالت نقره ۹۲۵)
 */
export function SilverShieldIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/**
 * Silversmith Atelier / Handcrafted Icon (هنر دست‌ساز و کارگاه)
 */
export function HandcraftedAtelierIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m14.5 4 5.5 5.5-9.5 9.5H5v-5.5L14.5 4Z" />
      <path d="m13 5.5 5.5 5.5" />
      <path d="m2 22 3-3" />
      <circle cx="18" cy="3" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * All Collections Rosette / Showcase Icon (همه مجموعه‌ها)
 */
export function AllCollectionsIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      <circle cx="6.5" cy="17.5" r="1" fill="currentColor" />
      <circle cx="17.5" cy="17.5" r="1" fill="currentColor" />
    </svg>
  );
}

/**
 * Dynamic category icon resolver returning proper bespoke luxury SVG component
 */
export function getCategorySvgIcon(name: string, id: number, className = "w-5 h-5"): React.ReactNode {
  const lower = (name || "").toLowerCase();
  
  if (lower.includes("انگشتر") || lower.includes("حلقه") || lower.includes("ring") || id === 2) {
    return <RingIcon className={className} />;
  }
  if (lower.includes("گردنبند") || lower.includes("آویز") || lower.includes("necklace") || lower.includes("پلاک") || id === 3) {
    return <NecklaceIcon className={className} />;
  }
  if (lower.includes("دستبند") || lower.includes("النگو") || lower.includes("bracelet") || id === 1) {
    return <BraceletIcon className={className} />;
  }
  if (lower.includes("گوشواره") || lower.includes("earring") || id === 4) {
    return <EarringsIcon className={className} />;
  }
  if (lower.includes("سرویس") || lower.includes("نیم ست") || lower.includes("set") || lower.includes("parure")) {
    return <JewelrySetIcon className={className} />;
  }
  if (lower.includes("نگین") || lower.includes("سنگ") || lower.includes("gem") || lower.includes("stone")) {
    return <GemstoneIcon className={className} />;
  }
  if (lower.includes("دست‌ساز") || lower.includes("کارگاه") || lower.includes("craft")) {
    return <HandcraftedAtelierIcon className={className} />;
  }

  return <SparkleStarIcon className={className} />;
}
