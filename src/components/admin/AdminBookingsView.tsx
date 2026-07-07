"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  AdminBookingsScheduleGrid,
  useAdminBookingsDayState,
} from "@/components/admin/AdminBookingsScheduleGrid";
import {
  AdminBookingsTable,
  type AdminBooking,
} from "@/components/admin/AdminBookingsTable";

type StylistColumn = {
  id: number;
  name: string;
};

export function AdminBookingsView() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [stylists, setStylists] = useState<StylistColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const dayState = useAdminBookingsDayState();

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/bookings").then((r) => {
        if (r.status === 401) router.push("/admin");
        return r.json();
      }),
      fetch("/api/stylists").then((r) => r.json()),
    ])
      .then(([bookingRows, stylistRows]) => {
        if (Array.isArray(bookingRows)) setBookings(bookingRows);
        if (Array.isArray(stylistRows)) {
          setStylists(
            stylistRows.map((stylist: StylistColumn) => ({
              id: stylist.id,
              name: stylist.name,
            })),
          );
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const stylistColumns = useMemo(() => {
    if (stylists.length > 0) return stylists;
    const fromBookings = new Map<number, string>();
    for (const booking of bookings) {
      if (!fromBookings.has(booking.stylistId)) {
        fromBookings.set(
          booking.stylistId,
          booking.stylistName ?? `Stylist #${booking.stylistId}`,
        );
      }
    }
    return [...fromBookings.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [stylists, bookings]);

  if (loading) return <p className="text-muted">Loading bookings...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl">Bookings</h2>
          <p className="mt-2 text-sm text-muted">
            Daily schedule by stylist — switch days to view appointments
          </p>
        </div>
        <Link href="/admin/services">
          <Button variant="secondary">Services & Pricing</Button>
        </Link>
      </div>

      <AdminBookingsScheduleGrid
        bookings={bookings}
        stylists={stylistColumns}
        selectedDate={dayState.selectedDate}
        dayLabel={dayState.dayLabel}
        dayName={dayState.dayName}
        isClosed={dayState.isClosed}
        hours={dayState.hours}
        onPreviousDay={dayState.goToPreviousDay}
        onNextDay={dayState.goToNextDay}
        canGoPrevious={dayState.canGoPrevious}
        canGoNext={dayState.canGoNext}
      />

      <AdminBookingsTable
        bookings={bookings}
        filterDate={dayState.selectedDate}
        showServicesLink={false}
        showHeader={false}
        onBookingsChange={setBookings}
      />
    </div>
  );
}
