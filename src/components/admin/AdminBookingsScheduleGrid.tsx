"use client";

import { useMemo, useState } from "react";
import { addDays, format, isSameDay, startOfToday } from "date-fns";
import { useScheduleDayConfig } from "@/hooks/useScheduleDayConfig";
import { timeToMinutes } from "@/lib/booking-utils";
import {
  formatDayDateLabel,
  generateHourlySlots,
  getDayConfigForDate,
} from "@/lib/schedule-utils";
import type { AdminBooking } from "@/components/admin/AdminBookingsTable";

type StylistColumn = {
  id: number;
  name: string;
};

const STATUS_CLASS: Record<string, string> = {
  pending: "admin-schedule-booking-pending",
  confirmed: "admin-schedule-booking-confirmed",
  completed: "admin-schedule-booking-completed",
  cancelled: "admin-schedule-booking-cancelled",
};

function bookingStartsInHour(booking: AdminBooking, hour: number) {
  const startHour = Math.floor(timeToMinutes(booking.startTime.slice(0, 5)) / 60);
  return startHour === hour;
}

export function AdminBookingsScheduleGrid({
  bookings,
  stylists,
  selectedDate,
  dayLabel,
  dayName,
  isClosed,
  hours,
  onPreviousDay,
  onNextDay,
  canGoPrevious,
  canGoNext,
}: {
  bookings: AdminBooking[];
  stylists: StylistColumn[];
  selectedDate: string;
  dayLabel: string;
  dayName: string;
  isClosed: boolean;
  hours: string[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}) {
  const dayBookings = useMemo(
    () => bookings.filter((b) => b.bookingDate === selectedDate),
    [bookings, selectedDate],
  );

  return (
    <section className="admin-schedule-section">
      <div className="admin-schedule-day-row">
        <button
          type="button"
          className="admin-schedule-nav"
          onClick={onPreviousDay}
          disabled={!canGoPrevious}
          aria-label="Previous day"
        >
          ‹
        </button>
        <div className="admin-schedule-day-title">
          <h3 className="admin-schedule-day-name">{dayName}</h3>
          <p className="admin-schedule-day-date">{dayLabel}</p>
        </div>
        <button
          type="button"
          className="admin-schedule-nav"
          onClick={onNextDay}
          disabled={!canGoNext}
          aria-label="Next day"
        >
          ›
        </button>
      </div>

      {isClosed ? (
        <p className="admin-schedule-closed">Salon closed on this day.</p>
      ) : stylists.length === 0 ? (
        <p className="admin-schedule-closed">No stylists configured.</p>
      ) : (
        <div className="admin-schedule-scroll">
          <table className="admin-schedule-grid">
            <thead>
              <tr>
                <th className="admin-schedule-time-col">Time</th>
                {stylists.map((stylist) => (
                  <th key={stylist.id} className="admin-schedule-stylist-col">
                    {stylist.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((slot) => {
                const hour = Number(slot.split(":")[0]);
                return (
                  <tr key={slot}>
                    <th className="admin-schedule-time-col">{slot.slice(0, 5)}</th>
                    {stylists.map((stylist) => {
                      const cellBookings = dayBookings.filter(
                        (b) =>
                          b.stylistId === stylist.id &&
                          bookingStartsInHour(b, hour),
                      );

                      return (
                        <td key={stylist.id} className="admin-schedule-cell">
                          {cellBookings.map((booking) => (
                            <article
                              key={booking.id}
                              className={`admin-schedule-booking ${STATUS_CLASS[booking.status] ?? ""}`}
                              title={`${booking.clientName} — ${booking.serviceName ?? "Service"}`}
                            >
                              <p className="admin-schedule-booking-time">
                                {booking.startTime.slice(0, 5)} – {booking.endTime.slice(0, 5)}
                              </p>
                              <p className="admin-schedule-booking-client">{booking.clientName}</p>
                              <p className="admin-schedule-booking-service">
                                {booking.serviceName ?? `Service #${booking.serviceId}`}
                              </p>
                              <p className="admin-schedule-booking-status">{booking.status}</p>
                            </article>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function useAdminBookingsDayState() {
  const [offset, setOffset] = useState(0);
  const weeklyConfig = useScheduleDayConfig();
  const bookingDateObj = addDays(startOfToday(), offset);
  const day = getDayConfigForDate(weeklyConfig, bookingDateObj);
  const hours = useMemo(
    () => (day.isOpen ? generateHourlySlots(day.startHour, day.endHour) : []),
    [day.isOpen, day.startHour, day.endHour],
  );

  return {
    selectedDate: format(bookingDateObj, "yyyy-MM-dd"),
    dayLabel: formatDayDateLabel(bookingDateObj),
    dayName: day.name,
    isClosed: !day.isOpen,
    hours,
    isToday: isSameDay(bookingDateObj, startOfToday()),
    canGoPrevious: offset > -365,
    canGoNext: offset < 365,
    goToPreviousDay: () => setOffset((current) => current - 1),
    goToNextDay: () => setOffset((current) => current + 1),
  };
}
