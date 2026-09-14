"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

interface LanguageOption {
  code: "fa" | "en" | "ar";
  label: string;
  nativeLabel: string;
  countryCode: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    code: "fa",
    label: "Persian",
    nativeLabel: "فارسی",
    countryCode: "IR",
    flag: "🇮🇷",
  },
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    countryCode: "EN",
    flag: "🇬🇧",
  },
  {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    countryCode: "AR",
    flag: "🇸🇦",
  },
];

export default function LanguageDropdown() {
  const { language, setLanguage } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (code: "fa" | "en" | "ar") => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Shopify-Style Compact Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C4852B]/35 bg-white/90 dark:bg-[#FAF9F5] hover:bg-[#C4852B]/10 hover:border-[#C4852B] transition-all duration-200 text-xs font-semibold text-zinc-800 shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C4852B]/30"
      >
        {/* Minimalist Globe Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-3.5 h-3.5 text-[#C4852B] shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
          />
        </svg>

        {/* Selected Language Name */}
        <span className="font-bold text-zinc-900 tracking-normal text-[11px] leading-none pt-0.5">
          {currentLang.nativeLabel}
        </span>

        {/* Subtle Chevron Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-3 h-3 text-zinc-500 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Floating Shopify-Style Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute mt-2 end-0 z-50 min-w-[170px] bg-white/98 dark:bg-[#FAF9F5]/98 backdrop-blur-md rounded-2xl p-1.5 border border-[#C4852B]/30 shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-200 animate-in fade-in zoom-in-95"
        >
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-100 tracking-wider">
            Language / زبان
          </div>
          <div className="py-1 space-y-0.5">
            {LANGUAGES.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors text-start cursor-pointer ${
                    isSelected
                      ? "bg-[#C4852B]/15 text-zinc-950 font-bold border border-[#C4852B]/30"
                      : "text-zinc-700 hover:bg-zinc-100 dark:hover:bg-[#F4F1EA] hover:text-[#C4852B]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{item.flag}</span>
                    <div className="flex flex-col text-start">
                      <span className="font-bold text-xs leading-tight">{item.nativeLabel}</span>
                      <span className="text-[9px] text-zinc-400 font-mono">{item.countryCode}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-3.5 h-3.5 text-[#C4852B] shrink-0"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
