import { Suspense } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { StylePageHero } from "@/components/style/StylePageHero";

export function StyleBookingPage() {
  return (
    <>
      <StylePageHero title="Book" subtitle="reserve your visit" />
      <div className="st-container st-page">
        <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
          <BookingForm />
        </Suspense>
      </div>
    </>
  );
}
