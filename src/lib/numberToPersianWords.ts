/**
 * Converts numbers into Persian words (تبدیل اعداد به حروف فارسی)
 * e.g. 4350000 => "چهار میلیون و سیصد و پنجاه هزار تومان"
 */

const ONES = [
  "",
  "یک",
  "دو",
  "سه",
  "چهار",
  "پنج",
  "شش",
  "هفت",
  "هشت",
  "نه",
];

const TEENS = [
  "ده",
  "یازده",
  "دوازده",
  "سیزده",
  "چهارده",
  "پانزده",
  "شانزده",
  "هفده",
  "هجده",
  "نوزده",
];

const TENS = [
  "",
  "",
  "بیست",
  "سی",
  "چهل",
  "پنجاه",
  "شصت",
  "هفتاد",
  "هشتاد",
  "نود",
];

const HUNDREDS = [
  "",
  "یکصد",
  "دویست",
  "سیصد",
  "چهارصد",
  "پانصد",
  "ششصد",
  "هفتصد",
  "هشتصد",
  "نهصد",
];

const SCALES = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

function chunkToWords(num: number): string {
  if (num === 0) return "";
  const parts: string[] = [];

  const h = Math.floor(num / 100);
  const remainder = num % 100;

  if (h > 0) {
    parts.push(HUNDREDS[h]);
  }

  if (remainder >= 10 && remainder < 20) {
    parts.push(TEENS[remainder - 10]);
  } else {
    const t = Math.floor(remainder / 10);
    const o = remainder % 10;
    if (t > 0) parts.push(TENS[t]);
    if (o > 0) parts.push(ONES[o]);
  }

  return parts.join(" و ");
}

export function numberToPersianWords(amount: number): string {
  if (amount === 0) return "صفر تومان";
  if (isNaN(amount) || amount < 0) return "";

  const absAmount = Math.floor(Math.abs(amount));
  if (absAmount === 0) return "صفر تومان";

  const chunks: number[] = [];
  let temp = absAmount;

  while (temp > 0) {
    chunks.push(temp % 1000);
    temp = Math.floor(temp / 1000);
  }

  const wordParts: string[] = [];

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunkVal = chunks[i];
    if (chunkVal > 0) {
      const chunkText = chunkToWords(chunkVal);
      const scaleText = SCALES[i];
      if (scaleText) {
        wordParts.push(`${chunkText} ${scaleText}`);
      } else {
        wordParts.push(chunkText);
      }
    }
  }

  const result = wordParts.join(" و ");
  return `${result} تومان`;
}

export function toPersianDigits(input: string | number): string {
  const str = String(input);
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}
