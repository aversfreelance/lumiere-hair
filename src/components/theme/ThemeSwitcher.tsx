"use client";

import { useTheme } from "./ThemeProvider";
import { THEMES, ThemeId } from "@/lib/theme";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="theme-switcher flex items-center gap-1 rounded-full border border-border/60 bg-surface-elevated/80 p-1 backdrop-blur-sm"
      role="group"
      aria-label="Choose theme"
    >
      {THEMES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTheme(id as ThemeId)}
          aria-pressed={theme === id}
          className={`theme-switcher-btn rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-all sm:px-4 sm:text-xs ${
            theme === id ? "theme-switcher-btn-active" : "text-muted hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
