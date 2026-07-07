"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/booking-utils";

export type AdminBooking = {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string | null;
  serviceId: number;
  stylistId: number;
  serviceName: string | null;
  servicePriceCents: number | null;
  stylistName: string | null;
};

const statuses = ["pending", "confirmed", "completed", "cancelled"];

type AdminBookingsTableProps = {
  showServicesLink?: boolean;
  showHeader?: boolean;
  compact?: boolean;
  bookings?: AdminBooking[];
  filterDate?: string;
  onBookingsChange?: (bookings: AdminBooking[]) => void;
};

export function AdminBookingsTable({
  showServicesLink = true,
  showHeader = true,
  compact = false,
  bookings: bookingsProp,
  filterDate,
  onBookingsChange,
}: AdminBookingsTableProps) {
  const router = useRouter();
  const [bookingsState, setBookingsState] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(!bookingsProp);

  const bookings = bookingsProp ?? bookingsState;
  const setBookings = onBookingsChange ?? setBookingsState;

  useEffect(() => {
    if (bookingsProp) return;

    fetch("/api/admin/bookings")
      .then((r) => {
        if (r.status === 401) router.push("/admin");
        return r.json();
      })
      .then((rows) => {
        if (onBookingsChange) onBookingsChange(rows);
        else setBookingsState(rows);
      })
      .finally(() => setLoading(false));
  }, [bookingsProp, onBookingsChange, router]);

  async function updateStatus(id: number, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  async function deleteBooking(id: number) {
    if (!confirm("Delete this booking?")) return;
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    setBookings(bookings.filter((b) => b.id !== id));
  }

  const filteredBookings = useMemo(() => {
    const rows = filterDate
      ? bookings.filter((b) => b.bookingDate === filterDate)
      : bookings;
    return compact ? rows.slice(0, 8) : rows;
  }, [bookings, compact, filterDate]);

  if (loading) return <p className="text-muted">Loading bookings...</p>;

  return (
    <div className={showHeader || filterDate ? "mt-12" : undefined}>
      {showHeader && (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className={compact ? "font-serif text-xl" : "font-serif text-3xl"}>
              {compact ? "Recent Bookings" : "Bookings"}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {compact
                ? "Latest appointments across all themes"
                : "Manage all client appointments across all themes"}
            </p>
          </div>
          {showServicesLink && (
            <Link href="/admin/services">
              <Button variant="secondary">Services & Pricing</Button>
            </Link>
          )}
        </div>
      )}

      {!showHeader && filterDate && (
        <h3 className="font-serif text-xl">
          Appointments for {format(new Date(`${filterDate}T12:00:00`), "EEEE, MMMM d")}
        </h3>
      )}

      {filteredBookings.length === 0 ? (
        <p className="mt-8 text-muted">
          {filterDate ? "No bookings on this day." : "No bookings found."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[880px] border border-border text-sm">
            <thead className="bg-surface-elevated text-left text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Service</th>
                <th className="p-4">Stylist</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="bg-surface-elevated/30">
                  <td className="p-4">
                    <div className="font-medium">{b.clientName}</div>
                    <div className="mt-1 text-xs text-muted">{b.clientEmail}</div>
                    <div className="text-xs text-muted">{b.clientPhone}</div>
                  </td>
                  <td className="p-4">
                    <div>{b.serviceName ?? `Service #${b.serviceId}`}</div>
                    {b.servicePriceCents != null && (
                      <div className="mt-1 text-xs text-gold">{formatPrice(b.servicePriceCents)}</div>
                    )}
                  </td>
                  <td className="p-4 text-muted">{b.stylistName ?? `#${b.stylistId}`}</td>
                  <td className="p-4">{format(new Date(`${b.bookingDate}T12:00:00`), "MMM d, yyyy")}</td>
                  <td className="p-4">
                    {b.startTime.slice(0, 5)} – {b.endTime.slice(0, 5)}
                  </td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className="border border-border bg-surface px-2 py-1 text-xs uppercase"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <Button variant="danger" onClick={() => deleteBooking(b.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {compact && !filterDate && bookings.length > 8 && (
        <div className="mt-6">
          <Link href="/admin/bookings" className="text-xs uppercase tracking-widest text-gold hover:text-gold-light">
            View all bookings →
          </Link>
        </div>
      )}
    </div>
  );
}
