"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme/ThemeProvider";
import { YoungHeader } from "@/components/young/YoungHeader";
import { YoungFooter } from "@/components/young/YoungFooter";
import { YoungContactSection } from "@/components/young/YoungContactSection";
import { YoungNewsletterSection } from "@/components/young/YoungNewsletterSection";
import { StyleHeader } from "@/components/style/StyleHeader";
import { StyleFooter } from "@/components/style/StyleFooter";
import { StyleSitePaintBg } from "@/components/style/StyleSitePaintBg";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function ThemedSiteLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (theme === "style") {
    return (
      <div className="style-site">
        <StyleSitePaintBg />
        <StyleHeader />
        <main className="st-main">{children}</main>
        <StyleFooter />
      </div>
    );
  }

  if (theme === "young") {
    return (
      <div className="sunshine-site">
        <YoungHeader />
        <main className="ss-main">{children}</main>
        {isHome && (
          <>
            <YoungContactSection />
            <YoungNewsletterSection />
          </>
        )}
        <YoungFooter />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col pt-20">{children}</main>
      <Footer />
    </>
  );
}
