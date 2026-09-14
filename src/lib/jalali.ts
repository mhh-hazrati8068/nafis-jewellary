/**
 * Lightweight, zero-dependency Jalali (Shamsi) <-> Gregorian Date Converter
 * Based on the precise astronomical algorithm (Kazimierz M. Borkowski)
 */

export interface JalaliDate {
  year: number;
  month: number;
  day: number;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const PERSIAN_MONTHS_EN = [
  "Farvardin",
  "Ordibehesht",
  "Khordad",
  "Tir",
  "Mordad",
  "Shahrivar",
  "Mehr",
  "Aban",
  "Azar",
  "Dey",
  "Bahman",
  "Esfand",
];

/**
 * Converts a Jalali (Shamsi) date to Gregorian date
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): GregorianDate {
  jy = Number(jy);
  jm = Number(jm);
  jd = Number(jd);

  const gy = jy <= 979 ? 621 : 1600;
  jy -= jy <= 979 ? 0 : 979;

  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  let gYear = gy + 400 * Math.floor(days / 146097);
  days %= 146097;

  let leap = true;
  if (days >= 36525) {
    days--;
    gYear += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) {
      days++;
    } else {
      leap = false;
    }
  }

  gYear += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days >= 366) {
    leap = false;
    days--;
    gYear += Math.floor(days / 365);
    days %= 365;
  }

  const salA = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gMonth = 0;
  while (gMonth < 12 && days >= salA[gMonth + 1]) {
    days -= salA[gMonth + 1];
    gMonth++;
  }

  return {
    year: gYear,
    month: gMonth + 1,
    day: days + 1,
  };
}

/**
 * Converts a Gregorian date to Jalali (Shamsi) date
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  gy = Number(gy);
  gm = Number(gm);
  gd = Number(gd);

  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    (365 * gy) +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDaysInMonth[gm - 1];

  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;

  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

  return {
    year: jy,
    month: jm,
    day: jd,
  };
}

/**
 * Converts Jalali year, month, day to an ISO string (YYYY-MM-DD)
 */
export function jalaliToIsoString(jy: number, jm: number, jd: number): string {
  const { year, month, day } = jalaliToGregorian(jy, jm, jd);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/**
 * Converts an ISO string or Date to a Jalali formatted string (YYYY/MM/DD)
 */
export function isoToJalaliString(isoDate?: string | Date | null): string {
  if (!isoDate) return "";
  const d = typeof isoDate === "string" ? new Date(isoDate) : isoDate;
  if (isNaN(d.getTime())) return "";

  const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const mm = String(j.month).padStart(2, "0");
  const dd = String(j.day).padStart(2, "0");
  return `${j.year}/${mm}/${dd}`;
}
