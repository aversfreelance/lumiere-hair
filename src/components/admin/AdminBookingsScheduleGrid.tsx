"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
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

const ROW_HEIGHT_PX = 100;

const STATUS_CLASS: Record<string, string> = {
  pending: "admin-schedule-booking-pending",
  confirmed: "admin-schedule-booking-confirmed",
  completed: "admin-schedule-booking-completed",
  cancelled: "admin-schedule-booking-cancelled",
};

type ScheduleCell =
  | { type: "skip" }
  | { type: "empty" }
  | {
      type: "booking";
      booking: AdminBooking;
      rowSpan: number;
      blockStyle: CSSProperties;
    };

function getBookingTimeRange(booking: AdminBooking) {
  const startMin = timeToMinutes(booking.startTime.slice(0, 5));
  const endMin = timeToMinutes(booking.endTime.slice(0, 5));
  return {
    startMin,
    endMin,
    durationMinutes: Math.max(endMin - startMin, 15),
  };
}

function bookingStartsInHour(booking: AdminBooking, hour: number) {
  const { startMin } = getBookingTimeRange(booking);
  return Math.floor(startMin / 60) === hour;
}

function getBookingRowSpan(booking: AdminBooking, hours: string[]) {
  const { startMin, endMin } = getBookingTimeRange(booking);
  const startHour = Math.floor(startMin / 60);
  const endHour = Math.floor((endMin - 1) / 60);
  const startIndex = hours.findIndex((slot) => Number(slot.split(":")[0]) === startHour);
  const endIndex = hours.findIndex((slot) => Number(slot.split(":")[0]) === endHour);

  if (startIndex < 0 || endIndex < 0) return 1;
  return Math.max(1, endIndex - startIndex + 1);
}

function getBookingBlockStyle(booking: AdminBooking): CSSProperties {
  const { startMin, durationMinutes } = getBookingTimeRange(booking);
  const topPx = ((startMin % 60) / 60) * ROW_HEIGHT_PX;
  const heightPx = (durationMinutes / 60) * ROW_HEIGHT_PX;

  return {
    top: `${topPx}px`,
    height: `${heightPx}px`,
  };
}

function buildStylistCells(stylistId: number, hours: string[], dayBookings: AdminBooking[]) {
  const cells: ScheduleCell[] = hours.map(() => ({ type: "empty" }));
  const stylistBookings = dayBookings.filter((booking) => booking.stylistId === stylistId);

  for (let index = 0; index < hours.length; index += 1) {
    if (cells[index].type === "skip") continue;

    const hour = Number(hours[index].split(":")[0]);
    const booking = stylistBookings.find((item) => bookingStartsInHour(item, hour));
    if (!booking) continue;

    const rowSpan = getBookingRowSpan(booking, hours);
    cells[index] = {
      type: "booking",
      booking,
      rowSpan,
      blockStyle: getBookingBlockStyle(booking),
    };

    for (let covered = index + 1; covered < index + rowSpan; covered += 1) {
      cells[covered] = { type: "skip" };
    }
  }

  return cells;
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

  const stylistCells = useMemo(
    () =>
      Object.fromEntries(
        stylists.map((stylist) => [
          stylist.id,
          buildStylistCells(stylist.id, hours, dayBookings),
        ]),
      ),
    [stylists, hours, dayBookings],
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
              {hours.map((slot, hourIndex) => (
                <tr key={slot}>
                  <th className="admin-schedule-time-col">{slot.slice(0, 5)}</th>
                  {stylists.map((stylist) => {
                    const cell = stylistCells[stylist.id]?.[hourIndex] ?? { type: "empty" as const };

                    if (cell.type === "skip") return null;

                    if (cell.type === "booking") {
                      const { durationMinutes } = getBookingTimeRange(cell.booking);
                      const isCompact = durationMinutes <= 45;

                      return (
                        <td
                          key={stylist.id}
                          rowSpan={cell.rowSpan}
                          className="admin-schedule-cell admin-schedule-cell-span"
                        >
                          <article
                            className={`admin-schedule-booking admin-schedule-booking-span ${isCompact ? "admin-schedule-booking-compact" : ""} ${STATUS_CLASS[cell.booking.status] ?? ""}`}
                            style={cell.blockStyle}
                            title={`${cell.booking.clientName} — ${cell.booking.serviceName ?? "Service"} (${cell.booking.status})`}
                          >
                            <div className="admin-schedule-booking-meta">
                              <span className="admin-schedule-booking-time">
                                {cell.booking.startTime.slice(0, 5)} – {cell.booking.endTime.slice(0, 5)}
                              </span>
                              <span className="admin-schedule-booking-service">
                                {cell.booking.serviceName ?? `Service #${cell.booking.serviceId}`}
                              </span>
                            </div>
                            <div className="admin-schedule-booking-client-row">
                              <span className="admin-schedule-booking-client">{cell.booking.clientName}</span>
                              <span className="admin-schedule-booking-status">{cell.booking.status}</span>
                            </div>
                          </article>
                        </td>
                      );
                    }

                    return <td key={stylist.id} className="admin-schedule-cell" />;
                  })}
                </tr>
              ))}
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
