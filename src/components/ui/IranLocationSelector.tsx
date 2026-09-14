"use client";

import React, { useState, useEffect } from "react";
import { IRAN_PROVINCES, getCitiesByProvince } from "@/data/iranLocations";

interface IranLocationSelectorProps {
  selectedProvince?: string;
  selectedCity?: string;
  onChange: (location: { province: string; city: string }) => void;
  className?: string;
  disabled?: boolean;
}

export default function IranLocationSelector({
  selectedProvince = "",
  selectedCity = "",
  onChange,
  className = "",
  disabled = false,
}: IranLocationSelectorProps) {
  const [province, setProvince] = useState(selectedProvince);
  const [city, setCity] = useState(selectedCity);

  useEffect(() => {
    if (selectedProvince !== province) {
      setProvince(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedCity !== city) {
      setCity(selectedCity);
    }
  }, [selectedCity]);

  const cities = province ? getCitiesByProvince(province) : [];

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvince = e.target.value;
    setProvince(newProvince);

    const availableCities = getCitiesByProvince(newProvince);
    const newCity = availableCities.length > 0 ? availableCities[0] : "";
    setCity(newCity);

    onChange({
      province: newProvince,
      city: newCity,
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCity = e.target.value;
    setCity(newCity);

    onChange({
      province,
      city: newCity,
    });
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {/* Province Select */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          استان
        </label>
        <select
          value={province}
          disabled={disabled}
          onChange={handleProvinceChange}
          className="w-full px-3 py-2 bg-white dark:bg-[#FAF9F5] border border-zinc-300 dark:border-zinc-300 rounded-xl text-xs font-sans font-medium focus:outline-none focus:ring-2 focus:ring-[#C4852B]/30 focus:border-[#C4852B] text-zinc-900 cursor-pointer disabled:opacity-50"
        >
          <option value="">انتخاب استان...</option>
          {IRAN_PROVINCES.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* City Select (Client-side filtered instantly) */}
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
          شهر
        </label>
        <select
          value={city}
          disabled={disabled || !province}
          onChange={handleCityChange}
          className="w-full px-3 py-2 bg-white dark:bg-[#FAF9F5] border border-zinc-300 dark:border-zinc-300 rounded-xl text-xs font-sans font-medium focus:outline-none focus:ring-2 focus:ring-[#C4852B]/30 focus:border-[#C4852B] text-zinc-900 cursor-pointer disabled:opacity-50"
        >
          <option value="">
            {province ? "انتخاب شهر..." : "ابتدا استان را انتخاب کنید"}
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
