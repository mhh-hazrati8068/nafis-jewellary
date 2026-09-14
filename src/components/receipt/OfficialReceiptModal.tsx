"use client";

import React, { useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Invoice } from "@/lib/api";
import { numberToPersianWords, toPersianDigits } from "@/lib/numberToPersianWords";
import BrandLogo from "@/components/layout/BrandLogo";

interface Props {
  invoice?: Invoice | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function OfficialReceiptModal({ invoice: propInvoice, isOpen: propIsOpen, onClose: propOnClose }: Props) {
  const { 
    activeReceiptInvoice, 
    setActiveReceiptInvoice, 
    user, 
    silverPricePerGramToman 
  } = useAppStore();

  const [viewMode, setViewMode] = useState<"vector" | "template">("vector");
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const invoice = propInvoice !== undefined ? propInvoice : activeReceiptInvoice;
  const isOpen = propIsOpen !== undefined ? propIsOpen : Boolean(activeReceiptInvoice);

  const handleClose = () => {
    if (propOnClose) propOnClose();
    else setActiveReceiptInvoice(null);
  };

  if (!isOpen || !invoice) return null;

  // Format Shamsi / Persian Date
  const getFormattedDate = (dateStr?: string) => {
    try {
      const d = dateStr ? new Date(dateStr) : new Date();
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
    } catch {
      return new Date().toLocaleDateString("fa-IR");
    }
  };

  // Customer Name
  const customerName = 
    invoice.user?.firstName || invoice.user?.lastName
      ? `${invoice.user.firstName || ""} ${invoice.user.lastName || ""}`.trim()
      : user?.firstName || user?.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : invoice.user?.phoneNumber || user?.phoneNumber || "مشتری گرامی";

  // Invoice Number
  const invoiceNumber = invoice.id 
    ? `NE-${invoice.id.toString().padStart(5, "0")}`
    : "NE-00101";

  // Items (pad up to 8 rows like the physical receipt)
  const items = invoice.items || [];
  const maxRows = 8;
  const rows = Array.from({ length: maxRows }, (_, idx) => items[idx] || null);

  const totalAmount = invoice.finalTotalToman || invoice.subTotalToman || 0;
  const totalWords = numberToPersianWords(totalAmount);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const text = `فاکتور رسمی زیورآلات نفیسه عبادی\nشماره: ${invoiceNumber}\nمشتری: ${customerName}\nمبلغ: ${Number(totalAmount).toLocaleString()} تومان\nhttps://nafiseebadijewellery.com`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* Print Specific CSS to make output 100% full-page & razor sharp */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #official-receipt-print-area, #official-receipt-print-area * {
            visibility: visible !important;
          }
          #official-receipt-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>

      {/* Modal Card Wrapper */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#FAF9F5] rounded-3xl shadow-2xl border border-[#C4852B]/40 flex flex-col max-h-[94vh] overflow-hidden my-auto print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Top Action Bar (hidden when printing) */}
        <div className="no-print p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-300 flex items-center justify-between bg-[#F4F1EA] text-zinc-900">
          <div className="flex items-center gap-3">
            <span className="text-xl">🧾</span>
            <div>
              <h3 className="text-sm font-bold font-sans text-zinc-950">
                رسید رسمی سازمان زیورآلات نفیسه عبادی
              </h3>
              <p className="text-[11px] text-[#626667] font-mono">
                {invoiceNumber} • {getFormattedDate(invoice.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center bg-white border border-zinc-300 rounded-lg p-0.5 text-[11px] font-semibold">
              <button
                onClick={() => setViewMode("vector")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === "vector" ? "bg-[#660000] text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                چاپ باکیفیت (Vector)
              </button>
              <button
                onClick={() => setViewMode("template")}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  viewMode === "template" ? "bg-[#660000] text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                قالب تصویری (Template)
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C4852B] hover:bg-[#A76E1F] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="چاپ یا ذخیره PDF"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">چاپ / PDF</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-white border border-zinc-300 hover:border-[#C4852B] text-zinc-800 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="اشتراک‌گذاری فاکتور"
            >
              <span>{copied ? "✓ کپی شد" : "🔗"}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="p-2 text-zinc-400 hover:text-[#660000] text-sm font-bold transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* RECEIPT VIEWPORT AREA */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 flex justify-center bg-zinc-100 dark:bg-[#1A1816]/30 print:p-0 print:bg-white">
          
          {/* ============================================================ */}
          {/* 1. VECTOR RECREATION MODE (Sharpest for screen & print)     */}
          {/* ============================================================ */}
          {viewMode === "vector" && (
            <div 
              ref={printRef}
              id="official-receipt-print-area"
              className="w-full max-w-[580px] bg-[#E5B558] p-3.5 sm:p-5 rounded-2xl shadow-xl border-2 border-[#C4852B] text-zinc-950 font-sans relative overflow-hidden"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 16px), repeating-linear-gradient(-45deg, rgba(196,133,43,0.3) 0px, rgba(196,133,43,0.3) 2px, transparent 2px, transparent 16px)`,
                backgroundColor: "#D9A441",
              }}
            >
              {/* Outer Golden Border Glow */}
              <div className="border border-white/60 rounded-xl p-2.5 sm:p-3.5 bg-transparent space-y-2.5 sm:space-y-3">
                
                {/* ---------------------------------------------------- */}
                {/* TOP HEADER BOX: Customer Name, Date, Number         */}
                {/* ---------------------------------------------------- */}
                <div className="bg-white rounded-xl p-3 sm:p-3.5 shadow-xs border border-[#C4852B]/40 flex items-center justify-between text-xs sm:text-sm">
                  {/* Customer Name */}
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                    <span className="text-[#660000] font-extrabold whitespace-nowrap">نام خریدار:</span>
                    <span className="text-zinc-950 pr-1 text-sm sm:text-base border-b border-dotted border-zinc-400 min-w-[120px] sm:min-w-[160px]">
                      {customerName}
                    </span>
                  </div>

                  {/* Date & Invoice No */}
                  <div className="flex flex-col items-end gap-1 text-[11px] sm:text-xs text-zinc-800 font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#660000] font-sans">تاریخ:</span>
                      <span className="font-semibold text-zinc-950">{toPersianDigits(getFormattedDate(invoice.createdAt))}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#660000] font-sans">شماره:</span>
                      <span className="font-bold text-[#C4852B] tracking-wider">{toPersianDigits(invoice.id)}</span>
                    </div>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* MAIN TABLE (ردیف, شرح کالا, عیار, وزن, سنگ, قیمت)   */}
                {/* ---------------------------------------------------- */}
                <div className="bg-white rounded-xl overflow-hidden shadow-xs border border-[#C4852B]/40">
                  <table className="w-full text-right border-collapse text-[11px] sm:text-xs">
                    <thead>
                      <tr className="border-b-2 border-[#C4852B]/50 bg-[#FDFBF7] text-[#660000] font-extrabold text-center">
                        <th className="py-2 px-1 w-[8%] border-l border-[#C4852B]/30">ردیف</th>
                        <th className="py-2 px-2 w-[36%] border-l border-[#C4852B]/30 text-right pr-3">شرح کالا</th>
                        <th className="py-2 px-1 w-[11%] border-l border-[#C4852B]/30">عیار</th>
                        <th className="py-2 px-1 w-[12%] border-l border-[#C4852B]/30">وزن</th>
                        <th className="py-2 px-1 w-[15%] border-l border-[#C4852B]/30">سنگ</th>
                        <th className="py-2 px-2 w-[18%] text-left pl-3">قیمت (تومان)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((item, idx) => {
                        const rowNum = toPersianDigits(idx + 1);
                        const productName = item?.product?.name || "";
                        const purity = item ? "۹۲۵" : "";
                        const weight = item?.product?.weight ? `${toPersianDigits(item.product.weight)} گرم` : (item ? "۴.۲ گرم" : "");
                        const stone = item?.product?.stoneName || (item ? "طبیعی" : "");
                        const price = item ? toPersianDigits(Number(item.calculatedPriceToman).toLocaleString()) : "";

                        return (
                          <tr 
                            key={idx} 
                            className="border-b border-[#C4852B]/20 text-zinc-900 h-7 sm:h-8 hover:bg-amber-50/30 transition-colors"
                          >
                            <td className="text-center font-mono font-bold text-zinc-500 border-l border-[#C4852B]/30">
                              {rowNum}
                            </td>
                            <td className="pr-2.5 font-bold text-zinc-950 truncate max-w-[140px] sm:max-w-[190px] border-l border-[#C4852B]/30">
                              {productName && (
                                <span title={productName}>
                                  {productName}
                                  {item && item.quantity > 1 ? ` (${toPersianDigits(item.quantity)} عدد)` : ""}
                                </span>
                              )}
                            </td>
                            <td className="text-center font-mono text-zinc-800 border-l border-[#C4852B]/30 font-semibold">
                              {purity}
                            </td>
                            <td className="text-center font-mono text-zinc-800 border-l border-[#C4852B]/30">
                              {weight}
                            </td>
                            <td className="text-center text-[10px] sm:text-[11px] text-[#660000] font-semibold border-l border-[#C4852B]/30 truncate max-w-[70px]">
                              {stone}
                            </td>
                            <td className="text-left pl-2.5 font-mono font-bold text-[#C4852B]">
                              {price}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* ---------------------------------------------------- */}
                {/* SUMMARY ROW: Total in Words & Daily Silver Rate      */}
                {/* ---------------------------------------------------- */}
                <div className="bg-white rounded-xl p-2.5 sm:p-3 shadow-xs border border-[#C4852B]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  {/* Total in numbers and words */}
                  <div className="flex items-start sm:items-center gap-1.5 flex-1">
                    <span className="font-extrabold text-[#660000] whitespace-nowrap">
                      جمع کل به عدد و حروف:
                    </span>
                    <span className="font-bold text-zinc-950 text-[11px] sm:text-xs leading-relaxed">
                      {toPersianDigits(Number(totalAmount).toLocaleString())} تومان ({totalWords})
                    </span>
                  </div>

                  {/* Daily Precious Metal Rate */}
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-700 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-[#C4852B]/30 whitespace-nowrap self-end sm:self-auto">
                    <span className="font-bold font-sans text-[#660000]">نرخ نقره ۹۲۵:</span>
                    <span className="font-bold text-[#C4852B]">{toPersianDigits(Number(silverPricePerGramToman).toLocaleString())}</span>
                    <span className="text-[10px] text-zinc-500">تومان</span>
                  </div>
                </div>

                {/* ---------------------------------------------------- */}
                {/* FOOTER BOX: Brand Logo & Store Contact Details       */}
                {/* ---------------------------------------------------- */}
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-xs border border-[#C4852B]/40 flex items-center justify-between gap-4">
                  {/* Left: Official Brand Logo & Monogram */}
                  <div className="flex items-center gap-2 pr-1">
                    <BrandLogo variant="gold" size="md" showSubline={false} />
                  </div>

                  {/* Right: Atelier Address & Official Contact */}
                  <div className="flex flex-col items-end text-left rtl:text-right text-[10px] sm:text-[11px] text-zinc-700 leading-snug space-y-0.5">
                    <span 
                      className="font-bold font-brand-en text-xs sm:text-sm text-zinc-950 tracking-wider"
                      style={{ fontFamily: "var(--font-clash), sans-serif" }}
                    >
                      Nafise Ebadi Jewellery
                    </span>
                    <span className="font-mono text-zinc-600 text-[10px]">
                      nafisebadi60@gmail.com
                    </span>
                    <span className="font-mono text-zinc-900 font-bold text-[10px] sm:text-[11px]">
                      02146020254 | 09993231311
                    </span>
                    <p className="text-[9px] sm:text-[10px] text-zinc-500 text-right leading-tight max-w-[280px] sm:max-w-[340px] pt-0.5">
                      شهرک راه آهن، بلوار شهیدان زینعلی، بلوار امیرکبیر، پاساژ تجاری مالمون، همکف، پلاک 46
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. AUTHENTIC PHYSICAL TEMPLATE OVERLAY MODE                 */}
          {/* ============================================================ */}
          {viewMode === "template" && (
            <div 
              ref={printRef}
              id="official-receipt-print-area"
              className="relative w-full max-w-[560px] aspect-[1/1.414] shadow-2xl rounded-2xl overflow-hidden border-2 border-[#C4852B]"
            >
              {/* Official Template Image Background */}
              <img 
                src="/images/receipt-template.png" 
                alt="قالب رسمی فاکتور نفیسه عبادی"
                className="w-full h-full object-contain absolute inset-0 select-none pointer-events-none" 
              />

              {/* OVERLAY: Customer Name */}
              <div 
                className="absolute font-bold text-zinc-950 text-xs sm:text-sm font-sans flex items-center pr-2"
                style={{ top: "6.8%", right: "26%", left: "40%", height: "4%" }}
              >
                {customerName}
              </div>

              {/* OVERLAY: Date */}
              <div 
                className="absolute font-mono text-[10px] sm:text-xs font-semibold text-zinc-900 text-left"
                style={{ top: "5.4%", left: "10%", width: "20%", height: "2.5%" }}
              >
                {toPersianDigits(getFormattedDate(invoice.createdAt))}
              </div>

              {/* OVERLAY: Invoice Number */}
              <div 
                className="absolute font-mono text-[10px] sm:text-xs font-bold text-[#C4852B] text-left"
                style={{ top: "7.8%", left: "10%", width: "20%", height: "2.5%" }}
              >
                {toPersianDigits(invoice.id)}
              </div>

              {/* OVERLAY: Table Rows (8 Rows) */}
              <div 
                className="absolute"
                style={{ top: "16.8%", left: "6.5%", right: "6.5%", height: "54.5%" }}
              >
                {rows.map((item, idx) => {
                  if (!item) return null;
                  const rowTopPercent = (idx * 12.5); // 8 rows = 12.5% each
                  return (
                    <div 
                      key={idx} 
                      className="absolute w-full flex items-center text-[10px] sm:text-xs text-zinc-950"
                      style={{ top: `${rowTopPercent}%`, height: "12.5%" }}
                    >
                      {/* Price (Leftmost) */}
                      <span className="w-[24%] pl-2 font-mono font-bold text-[#C4852B] text-left">
                        {toPersianDigits(Number(item.calculatedPriceToman).toLocaleString())}
                      </span>
                      {/* Stone */}
                      <span className="w-[9%] text-center text-[9px] sm:text-[10px] font-semibold text-[#660000] truncate">
                        {item.product?.stoneName || "طبیعی"}
                      </span>
                      {/* Weight */}
                      <span className="w-[12%] text-center font-mono">
                        {item.product?.weight ? `${toPersianDigits(item.product.weight)}g` : "۴.۲g"}
                      </span>
                      {/* Purity */}
                      <span className="w-[9%] text-center font-mono font-bold">
                        ۹۲۵
                      </span>
                      {/* Description */}
                      <span className="w-[38%] pr-2 font-bold truncate text-right">
                        {item.product?.name}
                      </span>
                      {/* Row No (Rightmost) */}
                      <span className="w-[8%] text-center font-mono text-zinc-500 font-bold">
                        {toPersianDigits(idx + 1)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* OVERLAY: Total in Numbers and Words */}
              <div 
                className="absolute text-[9px] sm:text-[11px] font-bold text-zinc-950 flex items-center pr-2"
                style={{ top: "73.2%", right: "28%", left: "28%", height: "4%" }}
              >
                {toPersianDigits(Number(totalAmount).toLocaleString())} تومان ({totalWords})
              </div>

              {/* OVERLAY: Daily Silver Rate */}
              <div 
                className="absolute font-mono text-[9px] sm:text-[10px] font-bold text-[#C4852B] text-left flex items-center pl-2"
                style={{ top: "73.2%", left: "6%", width: "20%", height: "4%" }}
              >
                {toPersianDigits(Number(silverPricePerGramToman).toLocaleString())} تومان
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="no-print p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-300 bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#626667] text-[11px]">
            <span>✨</span>
            <span>این فاکتور با مهر و امضای رسمی سازمانی زیورآلات نفیسه عبادی صادر گردیده است.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#660000] hover:bg-[#7D0000] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-center"
            >
              🖨️ چاپ و صدور PDF رسمی
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold rounded-xl transition-all cursor-pointer"
            >
              بستن
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
