import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { ThemePageSwitch } from "@/components/theme/ThemePageSwitch";
import { YoungBookingPage } from "@/components/young/YoungBookingPage";
import { StyleBookingPage } from "@/components/style/StyleBookingPage";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Schedule your visit at Lumière Hair Atelier.",
};

export default function BookingPage() {
  return (
    <ThemePageSwitch elegant={<ElegantBookingPage />} young={<YoungBookingPage />} style={<StyleBookingPage />} />
  );
}

function ElegantBookingPage() {
  return (
    <div>
      <section className="border-b border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Reservations</p>
          <h1 className="font-serif mt-4 text-5xl md:text-6xl">Book Your Visit</h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted">
            Select your service, choose your stylist, and pick a time that works for you.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Suspense fallback={<p className="text-center text-muted">Loading booking form...</p>}>
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
