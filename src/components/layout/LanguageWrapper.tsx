"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function LanguageWrapper({ children }: { children: React.ReactNode }) {
  const { direction, language, theme } = useAppStore();

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [direction, language, theme]);

  return <>{children}</>;
}
