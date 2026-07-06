export type ThemeId = "elegant" | "young" | "style";

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: "elegant", label: "Elegant" },
  { id: "young", label: "Young" },
  { id: "style", label: "Style" },
];

export const THEME_STORAGE_KEY = "lumiere-theme";
export const DEFAULT_THEME: ThemeId = "elegant";

export function isThemeId(value: string): value is ThemeId {
  return value === "elegant" || value === "young" || value === "style";
}
