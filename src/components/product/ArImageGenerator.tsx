"use client";

import React, { useState, useEffect, useCallback } from "react";
import { generateProductArImage, fetchProductArStatus, ArGenerationApiResponse } from "@/lib/api";
import { SparkleStarIcon } from "@/components/icons/JewelryIcons";
import { useAppStore } from "@/store/useAppStore";

interface ArImageGeneratorProps {
  productId: number | string;
  sourceImageUrl: string;
  productName: string;
  initialArImageUrl?: string | null;
  initialStatus?: "pending" | "processing" | "completed" | "failed";
}

export default function ArImageGenerator({
  productId,
  sourceImageUrl,
  productName,
  initialArImageUrl,
  initialStatus = "pending",
}: ArImageGeneratorProps) {
  const { language } = useAppStore();

  const [status, setStatus] = useState<"pending" | "processing" | "completed" | "failed">(
    initialArImageUrl ? "completed" : initialStatus
  );
  const [arImageUrl, setArImageUrl] = useState<string | null>(initialArImageUrl || null);
  const [activeTab, setActiveTab] = useState<"original" | "ar">(
    initialArImageUrl ? "ar" : "original"
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Poll status on mount if not yet loaded
  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      try {
        const res = await fetchProductArStatus(productId);
        if (!isMounted) return;
        if (res.status === "completed" && res.arImageUrl) {
          setArImageUrl(res.arImageUrl);
          setStatus("completed");
          setActiveTab("ar");
        } else if (res.status === "processing") {
          setStatus("processing");
          setIsGenerating(true);
        }
      } catch {
        // Fallback to initial
      }
    }
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Polling loop if processing
  useEffect(() => {
    if (status !== "processing") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetchProductArStatus(productId);
        if (res.status === "completed" && res.arImageUrl) {
          setArImageUrl(res.arImageUrl);
          setStatus("completed");
          setIsGenerating(false);
          setActiveTab("ar");
          clearInterval(interval);
        } else if (res.status === "failed") {
          setStatus("failed");
          setErrorMsg(res.error || "خطا در تولید تصویر توسط هوش مصنوعی");
          setIsGenerating(false);
          clearInterval(interval);
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [status, productId]);

  const handleGenerate = useCallback(
    async (force = false) => {
      setIsGenerating(true);
      setStatus("processing");
      setErrorMsg(null);

      try {
        const res = await generateProductArImage(productId, sourceImageUrl, force);
        if (res.status === "completed" && res.arImageUrl) {
          setArImageUrl(res.arImageUrl);
          setStatus("completed");
          setActiveTab("ar");
          setIsGenerating(false);
        } else if (res.status === "processing") {
          setStatus("processing");
        }
      } catch (err: unknown) {
        setStatus("failed");
        setErrorMsg(err instanceof Error ? err.message : "خطا در ارتباط با سرور");
        setIsGenerating(false);
      }
    },
    [productId, sourceImageUrl]
  );

  const t = {
    fa: {
      arBadge: "ارائه اختصاصی AR هوش مصنوعی",
      originalTab: "عکس اصلی محصول",
      arTab: "نمایش سه‌بعدی / AR هوش مصنوعی",
      generateBtn: "تولید تصویر AR با هوش مصنوعی (Gemini Nano Banana)",
      generating: "هوش مصنوعی در حال فضاسازی واقعیت‌افزوده...",
      regenerateBtn: "بازتولید مجدد با تنظیمات جدید",
      retryBtn: "تلاش مجدد",
      downloadBtn: "دانلود تصویر باکیفیت AR",
      disclaimer: "تصویر AR با حفظ ۱۰۰٪ ساختار، نقره و نگین اصلی در محیط سه‌بعدی لوکس بازآفرینی می‌شود.",
    },
    ar: {
      arBadge: "عرض الواقع المعزز بالذكاء الاصطناعي",
      originalTab: "الصورة الأصلية للمنتج",
      arTab: "عرض ثلاثي الأبعاد / AR بالذكاء الاصطناعي",
      generateBtn: "توليد صورة الواقع المعزز (Gemini Nano Banana)",
      generating: "الذكاء الاصطناعي يقوم بإنشاء العرض الفاخر...",
      regenerateBtn: "إعادة التوليد",
      retryBtn: "إعادة المحاولة",
      downloadBtn: "تحميل صورة AR",
      disclaimer: "يتم الاحتفاظ بجميع تفاصيل الفضة والأحجار الأصلية في بيئة ثلاثية الأبعاد.",
    },
    en: {
      arBadge: "AI Augmented Reality Presentation",
      originalTab: "Original Photo",
      arTab: "AI 3D / AR Showcase",
      generateBtn: "Generate AR Image with AI (Gemini Nano Banana)",
      generating: "AI generating spatial AR presentation...",
      regenerateBtn: "Regenerate AR Image",
      retryBtn: "Retry Generation",
      downloadBtn: "Download AR Image",
      disclaimer: "Preserves exact product geometry, 925 silver, and gemstones in a luxury 3D scene.",
    },
  }[language] || {
    arBadge: "AI Augmented Reality Presentation",
    originalTab: "Original Photo",
    arTab: "AI 3D / AR Showcase",
    generateBtn: "Generate AR Image with AI",
    generating: "Generating AR image...",
    regenerateBtn: "Regenerate",
    retryBtn: "Retry",
    downloadBtn: "Download",
    disclaimer: "Preserves exact geometry and details.",
  };

  return (
    <div className="w-full bg-[#121214] border border-amber-900/30 rounded-2xl p-4 md:p-6 shadow-2xl text-stone-100 my-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <SparkleStarIcon className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-stone-100 flex items-center gap-2">
              <span>{t.arBadge}</span>
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                AI ENGINE
              </span>
            </h3>
            <p className="text-[11px] text-stone-400 hidden sm:block">{t.disclaimer}</p>
          </div>
        </div>

        {/* View Switcher Tabs (Original vs AR) */}
        {arImageUrl && (
          <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab("original")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === "original"
                  ? "bg-stone-800 text-amber-300 shadow-sm"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {t.originalTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "ar"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/30"
                  : "text-amber-400/80 hover:text-amber-300"
              }`}
            >
              <SparkleStarIcon className="w-3 h-3 text-amber-200" />
              {t.arTab}
            </button>
          </div>
        )}
      </div>

      {/* Main Image Display Box */}
      <div className="relative aspect-square sm:aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#18181b] to-[#09090b] border border-white/5 flex items-center justify-center">
        {/* Active Image */}
        {activeTab === "ar" && arImageUrl ? (
          <img
            src={arImageUrl}
            alt={`${productName} AR Presentation`}
            className="w-full h-full object-contain transition-all duration-700 hover:scale-105"
          />
        ) : (
          <img
            src={sourceImageUrl}
            alt={productName}
            className="w-full h-full object-contain transition-all duration-700"
          />
        )}

        {/* Loading Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-t-amber-400 border-r-transparent border-b-amber-600 border-l-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-amber-400">
                <SparkleStarIcon className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-bold text-amber-300 mb-1">{t.generating}</p>
            <p className="text-xs text-stone-400 max-w-xs">{t.disclaimer}</p>
          </div>
        )}

        {/* Watermark Tag */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] text-stone-300 font-mono tracking-wider flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{activeTab === "ar" && arImageUrl ? "AR AI RENDER" : "SOURCE PHOTOGRAPH"}</span>
        </div>
      </div>

      {/* Error Message Box */}
      {status === "failed" && errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center justify-between gap-3">
          <span>{errorMsg}</span>
          <button
            onClick={() => handleGenerate(true)}
            className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold cursor-pointer shrink-0"
          >
            {t.retryBtn}
          </button>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
        {!arImageUrl ? (
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate(false)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs md:text-sm shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SparkleStarIcon className="w-4 h-4 text-stone-950" />
            <span>{isGenerating ? t.generating : t.generateBtn}</span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => handleGenerate(true)}
              className="px-4 py-2 rounded-xl bg-stone-800/90 hover:bg-stone-700 border border-white/10 text-stone-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <SparkleStarIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.regenerateBtn}</span>
            </button>

            <a
              href={arImageUrl}
              download={`${productName}-AR.png`}
              className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{t.downloadBtn}</span>
            </a>
          </div>
        )}

        <div className="text-[11px] text-stone-400 font-mono flex items-center gap-1.5 ml-auto">
          <span>MODEL:</span>
          <span className="text-amber-400/90 font-bold">gemini-3.1-flash-image</span>
        </div>
      </div>
    </div>
  );
}
