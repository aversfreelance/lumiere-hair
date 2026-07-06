import Script from "next/script";
import { THEME_STORAGE_KEY, DEFAULT_THEME } from "@/lib/theme";

export function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
        var theme = stored === "young" || stored === "elegant" || stored === "style" ? stored : "${DEFAULT_THEME}";
        var root = document.documentElement;
        root.setAttribute("data-theme", theme);
        root.classList.remove("theme-elegant", "theme-young", "theme-style");
        root.classList.add("theme-" + theme);
      } catch (e) {
        document.documentElement.setAttribute("data-theme", "${DEFAULT_THEME}");
      }
    })();
  `;

  return <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: script }} />;
}
