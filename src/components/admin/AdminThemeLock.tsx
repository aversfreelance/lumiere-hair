"use client";

import { useEffect } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, isThemeId } from "@/lib/theme";

export function AdminThemeLock() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "young");
    root.classList.remove("theme-elegant", "theme-young", "theme-style");
    root.classList.add("theme-young");

    return () => {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        const theme = stored && isThemeId(stored) ? stored : DEFAULT_THEME;
        root.setAttribute("data-theme", theme);
        root.classList.remove("theme-elegant", "theme-young", "theme-style");
        root.classList.add(`theme-${theme}`);
      } catch {
        root.setAttribute("data-theme", DEFAULT_THEME);
      }
    };
  }, []);

  return null;
}
