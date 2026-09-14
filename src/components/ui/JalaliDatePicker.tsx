"use client";

import React, { useState, useEffect } from "react";
import { 
  PERSIAN_MONTHS, 
  jalaliToIsoString, 
  gregorianToJalali, 
  JalaliDate 
} from "@/lib/jalali";

interface JalaliDatePickerProps {
  value?: string | null; // ISO Date String (e.g. "1996-07-02") or null
  onChange: (isoString: string, jalaliString: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function JalaliDatePicker({
  value,
  onChange,
  label = "تاریخ تولد (شمسی)",
  className = "",
  disabled = false,
}: JalaliDatePickerProps) {
  // Years range from 1320 to 1403
  const currentJalaliYear = 1403;
  const years = Array.from({ length: currentJalaliYear - 1320 + 1 }, (_, i) => currentJalaliYear - i);

  // Initialize from value if provided
  const getInitialJalali = (): JalaliDate => {
    if (value) {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          return gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
        }
      } catch {}
    }
    return { year: 1375, month: 1, day: 1 };
  };

  const [selectedYear, setSelectedYear] = useState<number>(() => getInitialJalali().year);
  const [selectedMonth, setSelectedMonth] = useState<number>(() => getInitialJalali().month);
  const [selectedDay, setSelectedDay] = useState<number>(() => getInitialJalali().day);
  const [hasInteracted, setHasInteracted] = useState(Boolean(value));

  useEffect(() => {
    if (value) {
      try {
        const d = new Date(value);
        if (!isNaN(d.getTime())) {
          const j = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
          setSelectedYear(j.year);
          setSelectedMonth(j.month);
          setSelectedDay(j.day);
          setHasInteracted(true);
        }
      } catch {}
    }
  }, [value]);

  // Calculate days count in selected month
  const maxDays = selectedMonth <= 6 ? 31 : selectedMonth <= 11 ? 30 : 29;
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  // Auto adjust day if month changed to 30 or 29
  useEffect(() => {
    if (selectedDay > maxDays) {
      setSelectedDay(maxDays);
    }
  }, [selectedMonth, maxDays, selectedDay]);

  const handleDateChange = (y: number, m: number, d: number) => {
    setSelectedYear(y);
    setSelectedMonth(m);
    setSelectedDay(d);
    setHasInteracted(true);

    const iso = jalaliToIsoString(y, m, d);
    const jalaliFormatted = `${y}/${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
    onChange(iso, jalaliFormatted);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
          {hasInteracted && (
            <span className="text-[11px] font-mono text-[#C4852B] font-bold">
              {selectedYear}/{String(selectedMonth).padStart(2, "0")}/{String(selectedDay).padStart(2, "0")}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {/* Day Select */}
        <div>
          <select
            value={selectedDay}
            disabled={disabled}
            onChange={(e) => handleDateChange(selectedYear, selectedMonth, Number(e.target.value))}
            className="w-full px-2.5 py-2 bg-white dark:bg-[#FAF9F5] border border-zinc-300 dark:border-zinc-300 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#C4852B]/30 focus:border-[#C4852B] text-zinc-900 cursor-pointer disabled:opacity-50"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Month Select */}
        <div>
          <select
            value={selectedMonth}
            disabled={disabled}
            onChange={(e) => handleDateChange(selectedYear, Number(e.target.value), selectedDay)}
            className="w-full px-2.5 py-2 bg-white dark:bg-[#FAF9F5] border border-zinc-300 dark:border-zinc-300 rounded-xl text-xs font-sans font-medium focus:outline-none focus:ring-2 focus:ring-[#C4852B]/30 focus:border-[#C4852B] text-zinc-900 cursor-pointer disabled:opacity-50"
          >
            {PERSIAN_MONTHS.map((mName, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {mName}
              </option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div>
          <select
            value={selectedYear}
            disabled={disabled}
            onChange={(e) => handleDateChange(Number(e.target.value), selectedMonth, selectedDay)}
            className="w-full px-2.5 py-2 bg-white dark:bg-[#FAF9F5] border border-zinc-300 dark:border-zinc-300 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#C4852B]/30 focus:border-[#C4852B] text-zinc-900 cursor-pointer disabled:opacity-50"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
