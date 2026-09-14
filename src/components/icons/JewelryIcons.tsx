import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Solitaire Fine Ring Icon (انگشتر و حلقه جواهر)
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
      <path d="M8.5 4.5h7l2.5 3-6 5.5-6-5.5 2.5-3Z" />
      <path d="M8.5 4.5l3.5 8.5 3.5-8.5" />
      <path d="M6 7.5h12" />
      <path d="M7 11.5c-2.4 1.8-4 4.7-4 8 0 2.5 4 4 9 4s9-1.5 9-4c0-3.3-1.6-6.2-4-8" />
    </svg>
  );
}

/**
 * Pendant Necklace Icon (گردنبند و آویز نفیس)
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
      <path d="M4 3.5c1.5 5 4.5 9.5 8 9.5s6.5-4.5 8-9.5" />
      <path d="M12 13v2.5" />
      <path d="M12 15.5c-2 1.8-2.5 3.5-2.5 4.5a2.5 2.5 0 0 0 5 0c0-1-.5-2.7-2.5-4.5Z" />
      <circle cx="12" cy="19.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Tennis Bracelet / Bangle Icon (دستبند و النگو زنجیری)
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
      <ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-15 12 12)" />
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
      <circle cx="8" cy="4.5" r="1.5" />
      <path d="M8 6v3" />
      <path d="M8 9l2 3.5-2 4.5-2-4.5L8 9Z" />
      <path d="M6 12.5h4" />
      <circle cx="16" cy="4.5" r="1.5" />
      <path d="M16 6v3" />
      <path d="M16 9l2 3.5-2 4.5-2-4.5L16 9Z" />
      <path d="M14 12.5h4" />
    </svg>
  );
}

/**
 * Diamond / Brilliant Gemstone Icon (الماس و سنگ‌های قیمتی)
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
 * Turquoise & Mineral Gemstone Mineral Icon (فیروزه و عقیق اصیل معدنی)
 */
export function TurquoiseMineralIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" />
      <polyline points="12,2 12,22" />
      <polyline points="21,7 12,12 3,7" />
      <polyline points="21,17 12,12 3,17" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Silversmith Crafting Chisel & Hammer Icon (هنر دست استادکاران نقره‌ساز)
 */
export function SilversmithHammerIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="m15 4 5 5-3 3-5-5 3-3Z" />
      <path d="m14 7-9.5 9.5a2 2 0 1 0 2.8 2.8L17 10" />
      <path d="M3 21l3-3" />
      <path d="m18 3 3 3" />
      <circle cx="19" cy="5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * 925 Pure Silver Ingot Purity Icon (نقره ۹۲۵ استرلینگ عیار خالص)
 */
export function SilverPurityIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M4 16l3-10h10l3 10H4Z" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
      <path d="M8 10h8" />
      <path d="M10 13h4" />
      <circle cx="6" cy="4" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="4" r="1" fill="currentColor" stroke="none" />
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
 * Official Invoice / Receipt Icon (فاکتور و سند رسمی)
 */
export function OfficialReceiptIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  );
}

/**
 * Print & Export Icon (چاپ و صدور PDF)
 */
export function PrinterIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M6 9V3h12v6" />
      <rect x="4" y="9" width="16" height="9" rx="2" />
      <path d="M6 15h12v6H6v-6Z" />
      <circle cx="16.5" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Online Payment / Credit Card Icon (پرداخت الکترونیک)
 */
export function CreditCardPayIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="7" cy="15" r="1" fill="currentColor" />
      <line x1="12" y1="15" x2="17" y2="15" />
    </svg>
  );
}

/**
 * Luxury Shopping Bag Icon (کیسه خرید و فروشگاه)
 */
export function ShoppingBagLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M6 8h12l1.5 13H4.5L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <circle cx="12" cy="13" r="1.5" />
    </svg>
  );
}

/**
 * Store Pin Location Icon (شعب و موقعیت گالری)
 */
export function StorePinIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/**
 * Phone Call Icon (پشتیبانی تلفنی و تماس)
 */
export function PhoneCallLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

/**
 * Clock Time / Working Hours Icon (ساعات کاری و زمان)
 */
export function ClockTimeIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/**
 * Journal / Book Article Icon (ژورنال و مقالات گوهرشناسی)
 */
export function JournalBookIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      <path d="M8 7h8M8 11h5" />
    </svg>
  );
}

/**
 * Key Lock / Auth Icon (ورود و حساب کاربری)
 */
export function KeyAuthIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="m21 2-2 2m-1.5 1.5L14 9l-2-2-4 4-2-2-4 4 3 3 8-8 2 2 3.5-3.5" />
      <circle cx="7.5" cy="16.5" r="4.5" />
    </svg>
  );
}

/**
 * User Avatar Icon (حساب کاربری)
 */
export function UserAvatarIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

/**
 * Admin Crown Luxury Icon (نشان مدیریت و پنل ادمین)
 */
export function AdminCrownLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M3 18h18l-2-11-4 5-3-8-3 8-4-5-2 11Z" />
      <circle cx="3" cy="7" r="1" fill="currentColor" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
      <circle cx="21" cy="7" r="1" fill="currentColor" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}

/**
 * Precision Scale Calculator Icon (محاسبه‌گر نرخ آنلاین نقره)
 */
export function ScaleCalculatorLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M12 3v18M8 21h8" />
      <path d="M4 7h16" />
      <path d="m4 7 3 5h-6l3-5ZM20 7l3 5h-6l3-5Z" />
    </svg>
  );
}

/**
 * Luxury Packaging Gift Box Icon (بسته‌بندی رسمی و جعبه نفیس)
 */
export function PackagingBoxIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M12 8v13" />
      <path d="M3 12h18" />
      <path d="M12 8C12 5.5 10 3 7.5 3S4.5 4.5 6 7l6 1Z" />
      <path d="M12 8c0-2.5 2-5 4.5-5S20.5 4.5 18 7l-6 1Z" />
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
 * Luxury Heart Icon (علاقه‌مندی‌ها و لیست منتخب)
 */
export function HeartLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

/**
 * Category Tag Luxury Icon (برچسب و دسته‌بندی)
 */
export function CategoryTagIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.4 2.4 0 0 0 3.394 0l6.308-6.308a2.4 2.4 0 0 0 0-3.394l-8.406-8.406Z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Info Circle Luxury Icon (راهنما و اطلاعات)
 */
export function InfoCircleLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth={2} />
    </svg>
  );
}

/**
 * Warning Alert Luxury Icon (هشدار و توجه)
 */
export function WarningAlertLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={2} />
    </svg>
  );
}

/**
 * Admin Gear Luxury Icon (تنظیمات و پنل مدیریت)
 */
export function AdminGearLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * Fleur-de-lis Royal Heritage Luxury Icon (نشان اشرافی و نماد زرگری)
 */
export function FleurDeLisLuxuryIcon({ className = "w-5 h-5", ...props }: IconProps) {
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
      <path d="M12 2c-.5 3-2 5.5-4 6.5C6 9.5 4 8 4 6c0 5 4 7 7 8v5H9v2h6v-2h-2v-5c3-1 7-3 7-8 0 2-2 3.5-4 2.5-2-1-3.5-3.5-4-6.5Z" />
      <path d="M8 15h8" />
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
