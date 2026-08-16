"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import BrandLogo from "@/components/layout/BrandLogo";
import { MotionFadeIn } from "@/components/ui/MotionWrappers";

export default function LogoGridInspector() {
  const { language } = useAppStore();
  const [activeMode, setActiveMode] = useState<"construction" | "clearspace" | "misuse">("construction");

  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-[#F4F1EA] border border-[#C4852B]/30 shadow-md">
      
      {/* Title & Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-200">
        <div>
          <span className="text-[10px] text-[#C4852B] font-mono tracking-widest uppercase mb-1 block font-bold">
            {language === 'fa' ? 'راهنمای مهندسی لوگو (صفحات ۱۰ تا ۱۳)' : 'LOGO ANATOMY & CLEAR SPACE (PAGES 10-13)'}
          </span>
          <h3 className="text-2xl font-bold uppercase text-zinc-950">
            {language === 'fa' ? 'ساختار هندسی و حریم امن نشان' : 'Geometric Grid & Clear Space Matrix'}
          </h3>
        </div>

        <div className="flex gap-2">
          {[
            { id: "construction", nameFa: "هندسه و گرید", nameEn: "Grid Anatomy" },
            { id: "clearspace", nameFa: "حریم امن (X)", nameEn: "Clear Space (X)" },
            { id: "misuse", nameFa: "موارد منع استفاده", nameEn: "Prohibited Misuse" }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeMode === mode.id
                  ? "bg-[#660000] text-white shadow-md"
                  : "bg-white/80 text-zinc-700 hover:border-[#C4852B] border border-zinc-300"
              }`}
            >
              {language === 'fa' ? mode.nameFa : mode.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Mode 1: Construction & Grid Anatomy */}
      {activeMode === "construction" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-square rounded-2xl bg-white border border-[#C4852B]/40 flex items-center justify-center p-8 overflow-hidden shadow-sm">
            {/* Engineering Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(196,133,43,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(196,133,43,0.1)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
            
            {/* Guide Circles */}
            <div className="absolute w-44 h-44 rounded-full border border-dashed border-[#C4852B]/40 pointer-events-none animate-pulse"></div>
            <div className="absolute w-24 h-24 rounded-full border border-[#660000]/40 pointer-events-none"></div>

            <div className="relative z-10 scale-125">
              <BrandLogo variant="gold" size="lg" showSubline={true} />
            </div>

            {/* Spec Angle Labels */}
            <span className="absolute top-4 left-4 font-mono text-[9px] text-[#C4852B] bg-[#C4852B]/10 px-2 py-1 rounded font-bold">
              PATTERN ANGLE: 45°
            </span>
            <span className="absolute bottom-4 right-4 font-mono text-[9px] text-[#660000] bg-[#660000]/10 px-2 py-1 rounded font-bold">
              RATIO: 1:1.618 GOLDEN
            </span>
          </div>

          <div className="space-y-4 text-xs text-[#626667]">
            <h4 className="font-bold text-sm text-zinc-950 uppercase font-brand-en">
              {language === 'fa' ? 'تناسبات طلایی مونوگرام ne' : 'Golden Ratio & Monogram Curvature'}
            </h4>
            <p className="leading-relaxed">
              {language === 'fa' 
                ? 'مونوگرام ne از ترکیب حروف پیوسته با قوس‌های نرم دایره‌ای و خطوط مستقیم با زاویه ۴۵ درجه شکل گرفته است. بافت هاشور داخلی نماد تاروپود طلا و درخشش فلزات گرانبهاست.'
                : 'The ne monogram blends flowing circular arcs with 45-degree linear crosshatching. The inner texture symbolizes gold thread weaves and diamond brilliance.'}
            </p>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 space-y-2">
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-[#C4852B] font-bold">HACHURE SPACING:</span>
                <span>3px Line / 4.5px Step</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-[#660000] font-bold">GEMSTONE DROPLET:</span>
                <span>Natural Red Agate (#660000)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Clear Space (X) */}
      {activeMode === "clearspace" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-square rounded-2xl bg-white border-2 border-dashed border-[#C4852B] flex items-center justify-center p-8 shadow-sm">
            {/* Margin X Indicators */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-xs font-bold text-[#660000]">X</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-xs font-bold text-[#660000]">X</span>
            <span className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-[#660000]">X</span>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-[#660000]">X</span>

            <div className="p-6 rounded-xl border border-[#C4852B]/30 bg-[#FAF9F5]">
              <BrandLogo variant="gold" size="lg" showSubline={true} />
            </div>
          </div>

          <div className="space-y-4 text-xs text-[#626667]">
            <h4 className="font-bold text-sm text-zinc-950 uppercase">
              {language === 'fa' ? 'حریم ایمن نشان (Clear Space)' : 'Mandatory Clear Space (X Standard)'}
            </h4>
            <p className="leading-relaxed">
              {language === 'fa' 
                ? 'برای تضمین ووضوح و خوانایی نشان در تمامی رسانه‌های چاپی و دیجیتال، رعایت فاصله امن بر اساس ارتفاع قطره عقیق (X) الزامی است. هیچ عنصر متنی، آیکون یا حاشیه‌ای نباید وارد این حریم گردد.'
                : 'To maintain brand prestige and legibility across all physical and digital collateral, a minimum clear space equivalent to the height of the agate gemstone droplet (X) must surround the mark.'}
            </p>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 font-mono text-[11px] text-[#660000] font-bold">
              ✓ Minimum Digital Margin: 24px | Minimum Print Margin: 8mm
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Prohibited Misuses */}
      {activeMode === "misuse" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              titleFa: "عدم تغییر تناسبات",
              titleEn: "Do Not Stretch",
              descFa: "تغییر عرض یا ارتفاع نشان اکیداً ممنوع است.",
              descEn: "Never compress or stretch aspect ratio.",
              style: "scale-x-125 scale-y-75"
            },
            {
              titleFa: "عدم چرخش نشان",
              titleEn: "Do Not Rotate",
              descFa: "چرخش مونوگرام خارج از زاویه صفر مجاز نیست.",
              descEn: "Never tilt or rotate off 0° baseline.",
              style: "rotate-45"
            },
            {
              titleFa: "عدم تغییر رنگ‌ها",
              titleEn: "No Unofficial Colors",
              descFa: "استفاده از رنگ‌های نئونی یا گرادیانت غیراصلی ممنوع است.",
              descEn: "Never apply unapproved neon or rainbow hues.",
              style: "hue-rotate-180"
            },
            {
              titleFa: "عدم حذف قطره عقیق",
              titleEn: "Do Not Alter Droplet",
              descFa: "جداسازی گوهر عقیق از نشان نقض هویت برند است.",
              descEn: "Never detach the signature red gemstone.",
              style: "opacity-40"
            }
          ].map((misuse, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl bg-white border border-red-500/30 flex flex-col items-center text-center relative overflow-hidden shadow-sm"
            >
              <span className="absolute top-2 right-2 text-xs text-red-500 font-bold">✕</span>
              
              <div className={`my-4 ${misuse.style}`}>
                <BrandLogo variant="gold" size="sm" showSubline={false} />
              </div>

              <h5 className="font-bold text-xs text-red-600 mb-1">
                {language === 'fa' ? misuse.titleFa : misuse.titleEn}
              </h5>
              <p className="text-[10px] text-[#626667]">
                {language === 'fa' ? misuse.descFa : misuse.descEn}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
