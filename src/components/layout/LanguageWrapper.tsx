"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { direction, language } = useAppStore();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  return <>{children}</>;
}
