"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  formatHourRange,
  isSlotPast,
  scheduleSlotKey,
  SCHEDULE_FALLBACK_SERVICES,
  type ScheduleServiceOption,
} from "@/lib/schedule-utils";
import { sortServicesByPrice } from "@/lib/services-data";
import { useScheduleDayState } from "@/components/schedule/useScheduleDayState";

export function ElegantScheduleSection() {
  const {
    day,
    slots,
    bookingDate,
    bookingDateObj,
    dayDateLabel,
    isSelectedToday,
    canGoPrevious,
    canGoNext,
    goToPreviousDay,
    goToNextDay,
  } = useScheduleDayState();
  const [services, setServices] = useState<ScheduleServiceOption[]>(SCHEDULE_FALLBACK_SERVICES);
  const [selections, setSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data: ScheduleServiceOption[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(sortServicesByPrice(data));
        }
      })
      .catch(() => {});
  }, []);

  function handleServiceChange(time: string, serviceId: string) {
    setSelections((prev) => ({
      ...prev,
      [scheduleSlotKey(bookingDateObj, time)]: serviceId,
    }));
  }

  return (
    <section className="el-schedule-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="el-schedule-header">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Reservations</p>
          <h2 className="font-serif mt-3 text-4xl md:text-5xl">Book Your Visit</h2>
        </div>

        <div className="el-schedule-panel">
          <div className="el-schedule-day-row">
            <button
              type="button"
              className="el-schedule-nav"
              onClick={goToPreviousDay}
              disabled={!canGoPrevious}
              aria-label="Previous day"
            >
              ‹
            </button>
            <div className="el-schedule-day-title">
              <h3 className="font-serif text-2xl md:text-3xl">{day.name}</h3>
              <p className="mt-1 text-sm text-gold-light">{dayDateLabel}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted">1-hour booking slots</p>
            </div>
            <button
              type="button"
              className="el-schedule-nav"
              onClick={goToNextDay}
              disabled={!canGoNext}
              aria-label="Next day"
            >
              ›
            </button>
          </div>

          {!day.isOpen ? (
            <p className="el-schedule-closed">Closed — please choose another day.</p>
          ) : (
            <ul className="el-schedule-slots">
              {slots.map((time) => {
                const key = scheduleSlotKey(bookingDateObj, time);
                const selectedServiceId = selections[key] || "";
                const slotPast = isSelectedToday && isSlotPast(bookingDateObj, time);

                return (
                  <li key={time}>
                    <div className={`el-schedule-slot${slotPast ? " el-schedule-slot-past" : ""}`}>
                      <span className="el-schedule-slot-range">{formatHourRange(time)}</span>
                      <select
                        className="el-schedule-slot-select"
                        value={selectedServiceId}
                        onChange={(e) => handleServiceChange(time, e.target.value)}
                        aria-label={`Select service for ${formatHourRange(time)}`}
                        disabled={slotPast}
                      >
                        <option value="">Select service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                      {slotPast ? (
                        <span className="el-schedule-slot-book el-schedule-slot-book-disabled">Past</span>
                      ) : selectedServiceId ? (
                        <Link
                          href={`/booking?service=${selectedServiceId}&date=${bookingDate}&time=${time}`}
                          className="el-schedule-slot-book"
                        >
                          Book
                        </Link>
                      ) : (
                        <span className="el-schedule-slot-book el-schedule-slot-book-disabled">Book</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
