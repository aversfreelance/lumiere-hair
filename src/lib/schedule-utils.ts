import { addDays, differenceInCalendarDays, format, isSameDay, startOfToday } from "date-fns";
import {
  FALLBACK_SCHEDULE_DAY_CONFIG,
  type ScheduleDayConfig,
} from "@/lib/opening-hours";

/** Number of calendar days bookable from today (today = day 0). */
export const SCHEDULE_BOOKING_DAYS = 14;
import { FALLBACK_SERVICES, sortServicesByPrice } from "@/lib/services-data";

export type ScheduleServiceOption = {
  id: number;
  name: string;
  priceCents: number;
};

export const SCHEDULE_FALLBACK_SERVICES: ScheduleServiceOption[] = sortServicesByPrice(
  FALLBACK_SERVICES.map(({ id, name, priceCents }) => ({ id, name, priceCents })),
);

/** @deprecated Use useScheduleDayConfig() for live opening hours */
export const SCHEDULE_DAY_CONFIG = FALLBACK_SCHEDULE_DAY_CONFIG;

export function generateHourlySlots(startHour: number, endHour: number) {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
}

export function formatHourRange(start: string) {
  const hour = Number(start.split(":")[0]);
  const end = `${String(hour + 1).padStart(2, "0")}:00`;
  return `${start} – ${end}`;
}

export function getDateForScheduleIndex(index: number) {
  const clamped = Math.min(Math.max(index, 0), SCHEDULE_BOOKING_DAYS - 1);
  return addDays(startOfToday(), clamped);
}

/** @deprecated Use getDateForScheduleIndex */
export function getDateForDayIndex(dayIndex: number) {
  return getDateForScheduleIndex(dayIndex);
}

export function getDayConfigForDate(
  weeklyConfig: ScheduleDayConfig[],
  date: Date
): ScheduleDayConfig {
  const dayOfWeek = date.getDay();
  return (
    weeklyConfig.find((day) => day.dayOfWeek === dayOfWeek) ??
    FALLBACK_SCHEDULE_DAY_CONFIG.find((day) => day.dayOfWeek === dayOfWeek) ??
    weeklyConfig[0]
  );
}

export function isBookingDateInRange(date: string | Date) {
  const bookingDay = typeof date === "string" ? new Date(`${date}T12:00:00`) : date;
  const daysAhead = differenceInCalendarDays(bookingDay, startOfToday());
  return daysAhead >= 0 && daysAhead < SCHEDULE_BOOKING_DAYS;
}

export function getMaxBookingDate() {
  return addDays(startOfToday(), SCHEDULE_BOOKING_DAYS - 1);
}

export function isSlotPast(bookingDate: Date, time: string) {
  const today = startOfToday();
  if (!isSameDay(bookingDate, today)) return false;

  const hour = Number(time.split(":")[0]);
  const slotStart = new Date(today);
  slotStart.setHours(hour, 0, 0, 0);
  return Date.now() >= slotStart.getTime();
}

export function scheduleSlotKey(date: Date, time: string) {
  return `${formatBookingDate(date)}-${time}`;
}

export function getDefaultScheduleIndex() {
  return 0;
}

/** @deprecated Use getDefaultScheduleIndex */
export function getDefaultDayIndex() {
  return getDefaultScheduleIndex();
}

export function formatBookingDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatDayDateLabel(date: Date) {
  return format(date, "MMMM d");
}
