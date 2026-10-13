"use client";

import React, { useRef, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Invoice, InvoiceItem } from "@/lib/api";
import { numberToPersianWords, toPersianDigits } from "@/lib/numberToPersianWords";
import BrandLogo from "@/components/layout/BrandLogo";
import { OfficialReceiptIcon, PrinterIcon, SparkleStarIcon } from "@/components/icons/JewelryIcons";

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

  // Resolve Items:
  // 1. From invoice.items
  // 2. From localStorage 'nafis_saved_invoices'
  const resolvedItems: InvoiceItem[] = (() => {
    if (invoice.items && invoice.items.length > 0) {
      return invoice.items;
    }
    if (typeof window !== "undefined") {
      try {
        const savedMap = JSON.parse(localStorage.getItem("nafis_saved_invoices") || "{}");
        const cached = savedMap[invoice.id];
        if (cached?.invoice?.items?.length) return cached.invoice.items;
        if (cached?.detailedItems?.length) {
          return cached.detailedItems.map((it: any) => ({
            id: it.id,
            quantity: it.quantity,
            calculatedPriceToman: it.price * it.quantity,
            product: {
              id: it.id,
              name: it.name,
              livePriceToman: it.price,
              weight: 4.5,
              stoneName: it.name?.includes("دُرّ") ? "دُرّ نجف" : it.name?.includes("عقیق") ? "عقیق طبیعی" : "نگین اصیل معدنی",
            }
          }));
        }
      } catch {}
    }
    return [];
  })();

  const maxRows = 8;
  const rows = Array.from({ length: maxRows }, (_, idx) => resolvedItems[idx] || null);

  const computedItemsSum = resolvedItems.reduce(
    (sum, it) => sum + (Number(it.calculatedPriceToman) || 0),
    0
  );
  const totalAmount = invoice.finalTotalToman || invoice.subTotalToman || (computedItemsSum > 0 ? Math.round(computedItemsSum * 1.10) : 0);
  const totalWords = numberToPersianWords(totalAmount);

  // Reliable Printing using isolated iframe (never produces blank page)
  const handlePrint = () => {
    if (typeof window === "undefined") return;
    const printArea = document.getElementById("official-receipt-print-area");
    if (!printArea) {
      window.print();
      return;
    }

    try {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      const styleTags = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
        .map((el) => el.outerHTML)
        .join("\n");

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
          <meta charset="utf-8">
          <title>رسید رسمی سازمانی - ${invoiceNumber}</title>
          ${styleTags}
          <style>
            @page { size: A4 portrait; margin: 8mm; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
            body { 
              background: white !important; 
              margin: 0 !important; 
              padding: 0 !important; 
              display: flex !important; 
              justify-content: center !important; 
              align-items: flex-start !important;
              direction: rtl !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Vazirmatn", Tahoma, sans-serif !important;
            }
            #official-receipt-print-area {
              box-shadow: none !important;
              margin: 0 auto !important;
              width: 100% !important;
              max-width: 620px !important;
            }
          </style>
        </head>
        <body>
          ${printArea.outerHTML}
        </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1500);
      }, 400);
    } catch {
      window.print();
    }
  };

  // Rich sharing with full invoice details
  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const itemsSummary = resolvedItems
      .filter(Boolean)
      .map((it, i) => `${i + 1}. ${it?.product?.name || "محصول نقره"} (${toPersianDigits(it?.quantity || 1)} عدد) - ${toPersianDigits(Number(it?.calculatedPriceToman || 0).toLocaleString())} تومان`)
      .join("\n");

    const shareText = `📜 فاکتور رسمی زیورآلات نفیسه عبادی
شماره فاکتور: ${invoiceNumber}
تاریخ: ${toPersianDigits(getFormattedDate(invoice.createdAt))}
نام خریدار: ${customerName}
${itemsSummary ? `\nاقلام سفارش:\n${itemsSummary}\n` : ""}
مبلغ کل قابل پرداخت: ${toPersianDigits(Number(totalAmount).toLocaleString())} تومان (${totalWords})
نرخ نقره روز: ${toPersianDigits(Number(silverPricePerGramToman).toLocaleString())} تومان

📞 تلفن: ۰۲۱۴۶۰۲۰۲۵۴ | ۰۹۹۹۳۲۳۱۳۱۱
📍 نشانی: شهرک راه آهن، بلوار امیرکبیر، پاساژ مالمون، پلاک ۴۶
https://nafiseebadijewellery.com`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `رسید رسمی سازمان - ${invoiceNumber}`,
          text: shareText,
          url: window.location.origin,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("امکان کپی متن فاکتور فراهم نشد.");
    }
  };

  return (
    <div 
      id="official-receipt-modal-container"
      className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static print:inset-auto"
    >
      
      {/* Fallback Native Print CSS */}
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
            padding: 10px !important;
            box-shadow: none !important;
            border: 2px solid #C4852B !important;
            background: #D9A441 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
            <span className="w-8 h-8 rounded-xl bg-[#660000]/10 flex items-center justify-center text-[#660000]">
              <OfficialReceiptIcon className="w-5 h-5" />
            </span>
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
            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C4852B] hover:bg-[#A76E1F] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="چاپ یا ذخیره PDF"
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              <span>چاپ / PDF</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-white border border-zinc-300 hover:border-[#C4852B] text-zinc-800 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
              title="اشتراک‌گذاری فاکتور"
            >
              <span>{copied ? "✓ کپی شد" : "🔗 اشتراک"}</span>
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
          {/* HIGH PRECISION VECTOR RECEIPT                                */}
          {/* ============================================================ */}
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
                            {productName ? (
                              <span title={productName}>
                                {productName}
                                {item && item.quantity > 1 ? ` (${toPersianDigits(item.quantity)} عدد)` : ""}
                              </span>
                            ) : null}
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

        </div>

        {/* Modal Footer Controls */}
        <div className="no-print p-4 sm:p-5 border-t border-zinc-200 dark:border-zinc-300 bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#626667] text-[11px]">
            <SparkleStarIcon className="w-4 h-4 text-[#C4852B] shrink-0" />
            <span>این فاکتور با مهر و امضای رسمی سازمانی زیورآلات نفیسه عبادی صادر گردیده است.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#660000] hover:bg-[#7D0000] text-white font-bold rounded-xl transition-all shadow-md cursor-pointer text-center"
            >
              <PrinterIcon className="w-4 h-4" />
              <span>چاپ و صدور PDF رسمی</span>
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
