"use client";

import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * ایتا (Eitaa) Vector Icon
 */
export function EitaaIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 14.5c-.8.5-1.9.7-3.1.7-2.6 0-4.4-1.4-4.4-3.7 0-2.4 2-4 4.8-4 1.2 0 2.2.3 2.7.7l-.6 1.5c-.5-.3-1.2-.5-2.1-.5-1.7 0-2.8 1-2.8 2.3 0 1.3 1 2.2 2.6 2.2.7 0 1.4-.1 1.9-.4l.6 1.4zm.2-4.5h-3.2v-1.5H16v1.5z" />
    </svg>
  );
}

/**
 * بله (Bale) Vector Icon
 */
export function BaleIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 2.237.733 4.305 1.97 5.98L3 21l3.155-.953C7.8 21.285 9.82 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-2h2v2zm1.8-6.4l-.8.9c-.6.6-1 1-1 2h-2v-.5c0-1.1.4-2.1 1.2-2.8l1.2-1.2c.4-.4.6-.9.6-1.5 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.2 1.8-4 4-4s4 1.8 4 4c0 .9-.4 1.7-1.2 2.1z" />
    </svg>
  );
}

/**
 * روبیکا (Rubika) Vector Icon
 */
export function RubikaIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.8l6.5 3.6-2.8 1.6L12 8.2 8.3 10 5.5 8.4 12 4.8zm-7 4.9l6 3.3v6.7l-6-3.3V9.7zm8 10V13l6-3.3v6.7l-6 3.3z" />
    </svg>
  );
}

/**
 * سروش (Soroush Plus) Vector Icon
 */
export function SoroushIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.2L2.3 21l4-1.1C7.8 21.1 9.8 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm-1 14h-2v-4h2v4zm0-6h-2V8h2v2zm4 6h-2V8h2v8z" />
    </svg>
  );
}

/**
 * اینستاگرام (Instagram) Vector Icon
 */
export function InstagramIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * تلگرام (Telegram) Vector Icon
 */
export function TelegramIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.6 7.5c-.12.54-.44.67-.89.42l-2.46-1.81-1.19 1.15c-.13.13-.24.24-.49.24l.18-2.5 4.54-4.1c.2-.18-.04-.27-.31-.1l-5.61 3.53-2.42-.76c-.53-.16-.54-.53.11-.78l9.46-3.65c.44-.16.82.1.68.86z" />
    </svg>
  );
}

/**
 * واتساپ (WhatsApp) Vector Icon
 */
export function WhatsAppIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29z" />
    </svg>
  );
}

/**
 * اینماد (eNamad Trust Emblem)
 */
export function EnamadBadge({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#C4852B]/40 shadow-md group hover:border-[#C4852B] transition-all duration-300 ${className}`}>
      {/* Official Enamad 5-Point Star & E emblem */}
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 text-[#003B73] group-hover:scale-105 transition-transform">
        <circle cx="32" cy="32" r="30" stroke="#C4852B" strokeWidth="2" fill="#FAF9F5" />
        <path d="M32 10L37.5 23H52L40.5 32L45 46L32 37.5L19 46L23.5 32L12 23H26.5L32 10Z" fill="#C4852B" fillOpacity="0.25" stroke="#C4852B" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="14" fill="#003B73" />
        <text x="32" y="38" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif">e</text>
        {/* 2 Trust Stars */}
        <circle cx="26" cy="52" r="2.5" fill="#C4852B" />
        <circle cx="38" cy="52" r="2.5" fill="#C4852B" />
      </svg>
      <span className="text-[9px] font-bold text-zinc-800 mt-1 whitespace-nowrap font-mono tracking-tighter">
        نماد اعتماد الکترونیکی
      </span>
      <span className="text-[7px] text-[#A06314] font-semibold">
        دو ستاره رسمی
      </span>
    </div>
  );
}
