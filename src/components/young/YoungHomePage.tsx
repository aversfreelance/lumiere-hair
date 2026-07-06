import { YoungCarousel } from "@/components/young/YoungCarousel";
import { YoungStylistsSection } from "@/components/young/YoungStylistsSection";
import { YoungScheduleSection } from "@/components/young/YoungScheduleSection";
import { YoungPriceList } from "@/components/young/YoungPriceList";

export function YoungHomePage() {
  return (
    <>
      <YoungCarousel />
      <YoungStylistsSection />
      <YoungScheduleSection />
      <YoungPriceList />
    </>
  );
}
