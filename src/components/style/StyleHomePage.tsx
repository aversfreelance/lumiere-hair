import Image from "next/image";
import { StyleHeroBand } from "@/components/style/StyleHeroBand";
import { StyleScheduleCarousel } from "@/components/style/StyleScheduleCarousel";
import { StyleChartSection } from "@/components/style/StyleChartSection";
import { StyleHostsCarousel } from "@/components/style/StyleHostsCarousel";
import { StyleToolsSection } from "@/components/style/StyleToolsSection";

export function StyleHomePage() {
  return (
    <>
      <StyleHeroBand />
      <StyleScheduleCarousel />
      <StyleChartSection />
      <StyleHostsCarousel />

      <StyleToolsSection />

      <section className="st-tagline-section">
        <Image src="/images/style/tagline.svg" alt="Tuned to your style" width={432} height={200} className="st-tagline-img" />
      </section>
    </>
  );
}
