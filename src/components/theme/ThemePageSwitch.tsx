"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemePageSwitch({
  elegant,
  young,
  style,
}: {
  elegant: React.ReactNode;
  young: React.ReactNode;
  style: React.ReactNode;
}) {
  const { theme } = useTheme();
  if (theme === "young") return young;
  if (theme === "style") return style;
  return elegant;
}
