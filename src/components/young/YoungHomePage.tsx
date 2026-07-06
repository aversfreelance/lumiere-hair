import { YoungCarousel } from "@/components/young/YoungCarousel";
import { YoungScheduleSection } from "@/components/young/YoungScheduleSection";
import { YoungPriceList } from "@/components/young/YoungPriceList";

export function YoungHomePage() {
  return (
    <>
      <YoungCarousel />
      <YoungScheduleSection />
      <YoungPriceList />
    </>
  );
}
