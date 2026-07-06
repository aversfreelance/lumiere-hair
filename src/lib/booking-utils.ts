import { addMinutes, format, parse } from "date-fns";

export function formatPrice(pence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
}

export function generateTimeSlots(
  startTime: string,
  endTime: string,
  durationMinutes: number,
  intervalMinutes = 30
) {
  const slots: string[] = [];
  const start = timeToMinutes(startTime.slice(0, 5));
  const end = timeToMinutes(endTime.slice(0, 5));

  for (let t = start; t + durationMinutes <= end; t += intervalMinutes) {
    slots.push(minutesToTime(t));
  }

  return slots;
}

export function slotsOverlap(
  slotStart: string,
  slotEnd: string,
  bookingStart: string,
  bookingEnd: string
) {
  const s1 = timeToMinutes(slotStart.slice(0, 5));
  const e1 = timeToMinutes(slotEnd.slice(0, 5));
  const s2 = timeToMinutes(bookingStart.slice(0, 5));
  const e2 = timeToMinutes(bookingEnd.slice(0, 5));
  return s1 < e2 && e1 > s2;
}

export function computeEndTime(startTime: string, durationMinutes: number) {
  const parsed = parse(startTime.slice(0, 5), "HH:mm", new Date());
  return format(addMinutes(parsed, durationMinutes), "HH:mm:ss");
}

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
