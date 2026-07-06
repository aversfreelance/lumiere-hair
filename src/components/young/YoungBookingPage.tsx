import { Suspense } from "react";
import { BookingForm } from "@/components/booking/BookingForm";

export function YoungBookingPage() {
  return (
    <div className="ss-container ss-page-dark">
      <h1 className="ss-page-title">
        Book Your <span>Visit</span>
      </h1>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
