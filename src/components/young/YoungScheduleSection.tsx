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

export function YoungScheduleSection() {
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
    <section className="ss-container ss-schedule-section">
      <div className="ss-schedule-header">
        <h2 className="ss-schedule-title">
          Book your visit <strong>ONLINE</strong>
        </h2>
        <p className="ss-schedule-sub">Pick a day, choose a service, reserve your slot</p>
      </div>

      <div className="ss-schedule-panel">
        <div className="ss-schedule-day-row">
          <button
            type="button"
            className="ss-schedule-nav"
            onClick={goToPreviousDay}
            disabled={!canGoPrevious}
            aria-label="Previous day"
          >
            ‹
          </button>
          <div className="ss-schedule-day-title">
            <h3 className="ss-schedule-day-name">{day.name}</h3>
            <p className="ss-schedule-day-date">{dayDateLabel}</p>
            <p className="ss-schedule-day-slots">1-hour booking slots</p>
          </div>
          <button
            type="button"
            className="ss-schedule-nav"
            onClick={goToNextDay}
            disabled={!canGoNext}
            aria-label="Next day"
          >
            ›
          </button>
        </div>

        {!day.isOpen ? (
          <p className="ss-schedule-closed">Closed — please choose another day.</p>
        ) : (
          <ul className="ss-schedule-slots">
            {slots.map((time) => {
              const key = scheduleSlotKey(bookingDateObj, time);
              const selectedServiceId = selections[key] || "";
              const slotPast = isSelectedToday && isSlotPast(bookingDateObj, time);

              return (
                <li key={time}>
                  <div className={`ss-schedule-slot${slotPast ? " ss-schedule-slot-past" : ""}`}>
                    <span className="ss-schedule-slot-range">{formatHourRange(time)}</span>
                    <select
                      className="ss-schedule-slot-select"
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
                      <span className="ss-schedule-slot-book ss-schedule-slot-book-disabled">Past</span>
                    ) : selectedServiceId ? (
                      <Link
                        href={`/booking?service=${selectedServiceId}&date=${bookingDate}&time=${time}`}
                        className="ss-schedule-slot-book"
                      >
                        Book
                      </Link>
                    ) : (
                      <span className="ss-schedule-slot-book ss-schedule-slot-book-disabled">Book</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
