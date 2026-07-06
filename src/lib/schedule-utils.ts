import { addDays, format, isSameDay, startOfToday } from "date-fns";
import { FALLBACK_SERVICES, sortServicesByPrice } from "@/lib/services-data";

export type ScheduleServiceOption = {
  id: number;
  name: string;
  priceCents: number;
};

export const SCHEDULE_FALLBACK_SERVICES: ScheduleServiceOption[] = sortServicesByPrice(
  FALLBACK_SERVICES.map(({ id, name, priceCents }) => ({ id, name, priceCents })),
);

export const SCHEDULE_DAY_CONFIG = [
  { name: "Monday", startHour: 9, endHour: 20 },
  { name: "Tuesday", startHour: 9, endHour: 20 },
  { name: "Wednesday", startHour: 9, endHour: 20 },
  { name: "Thursday", startHour: 9, endHour: 20 },
  { name: "Friday", startHour: 9, endHour: 20 },
  { name: "Saturday", startHour: 9, endHour: 20 },
  { name: "Sunday", startHour: 10, endHour: 20 },
] as const;

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

export function getDateForDayIndex(dayIndex: number) {
  const jsDay = dayIndex === 6 ? 0 : dayIndex + 1;
  const today = startOfToday();
  let diff = jsDay - today.getDay();
  if (diff < 0) diff += 7;
  return addDays(today, diff);
}

export function isSlotPast(bookingDate: Date, time: string) {
  const today = startOfToday();
  if (!isSameDay(bookingDate, today)) return false;

  const hour = Number(time.split(":")[0]);
  const slotStart = new Date(today);
  slotStart.setHours(hour, 0, 0, 0);
  return Date.now() >= slotStart.getTime();
}

export function scheduleSlotKey(dayIndex: number, time: string) {
  return `${dayIndex}-${time}`;
}

export function getDefaultDayIndex() {
  const today = new Date().getDay();
  return today === 0 ? 6 : today - 1;
}

export function formatBookingDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatDayDateLabel(date: Date) {
  return format(date, "MMMM d");
}
