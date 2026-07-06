"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { isSameDay, startOfToday } from "date-fns";
import {
  SCHEDULE_DAY_CONFIG,
  formatBookingDate,
  formatDayDateLabel,
  formatHourRange,
  generateHourlySlots,
  getDateForDayIndex,
  getDefaultDayIndex,
  isSlotPast,
  scheduleSlotKey,
  SCHEDULE_FALLBACK_SERVICES,
  type ScheduleServiceOption,
} from "@/lib/schedule-utils";
import { sortServicesByPrice } from "@/lib/services-data";

export function StyleScheduleCarousel() {
  const [index, setIndex] = useState(getDefaultDayIndex);
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

  const day = SCHEDULE_DAY_CONFIG[index];
  const slots = useMemo(
    () => generateHourlySlots(day.startHour, day.endHour),
    [day.startHour, day.endHour],
  );
  const bookingDateObj = getDateForDayIndex(index);
  const bookingDate = formatBookingDate(bookingDateObj);
  const dayDateLabel = formatDayDateLabel(bookingDateObj);
  const isSelectedToday = isSameDay(bookingDateObj, startOfToday());

  function handleServiceChange(time: string, serviceId: string) {
    setSelections((prev) => ({
      ...prev,
      [scheduleSlotKey(index, time)]: serviceId,
    }));
  }

  return (
    <section className="st-schedule-section">
      <div className="st-schedule-wrap">
        <div className="st-schedule-slide">
          <div className="st-schedule-figure-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/style/booking-figure.png"
              alt=""
              className="st-schedule-figure-left"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/style/booking-figure-deco.png"
              alt=""
              className="st-schedule-figure-deco"
            />
          </div>

          <div className="st-schedule-content">
            <div className="st-schedule-head">
              <div className="st-schedule-day-row">
                <button
                  type="button"
                  className="st-swiper-btn st-swiper-prev"
                  onClick={() => setIndex((i) => (i === 0 ? 6 : i - 1))}
                  aria-label="Previous day"
                >
                  ‹
                </button>
                <div className="st-schedule-day-title">
                  <h2 className="st-day-name">
                    <span className="st-day-name-text">{day.name}</span>
                    <span className="st-day-date">{dayDateLabel}</span>
                  </h2>
                  <p className="st-day-slots-label">1-hour booking slots</p>
                </div>
                <button
                  type="button"
                  className="st-swiper-btn st-swiper-next"
                  onClick={() => setIndex((i) => (i === 6 ? 0 : i + 1))}
                  aria-label="Next day"
                >
                  ›
                </button>
              </div>
            </div>

            <ul className="st-schedule-slots">
              {slots.map((time) => {
                const key = scheduleSlotKey(index, time);
                const selectedServiceId = selections[key] || "";
                const slotPast = isSelectedToday && isSlotPast(bookingDateObj, time);

                return (
                  <li key={time}>
                    <div className={`st-schedule-slot${slotPast ? " st-schedule-slot-past" : ""}`}>
                      <span className="st-schedule-slot-range">{formatHourRange(time)}</span>
                      <select
                        className="st-schedule-slot-select"
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
                        <span className="st-schedule-slot-book st-schedule-slot-book-disabled">Past</span>
                      ) : selectedServiceId ? (
                        <Link
                          href={`/booking?service=${selectedServiceId}&date=${bookingDate}&time=${time}`}
                          className="st-schedule-slot-book"
                        >
                          Book
                        </Link>
                      ) : (
                        <span className="st-schedule-slot-book st-schedule-slot-book-disabled">Book</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <Image src="/images/style/wave-divider.svg" alt="" width={1920} height={249} className="st-schedule-wave" />
    </section>
  );
}
