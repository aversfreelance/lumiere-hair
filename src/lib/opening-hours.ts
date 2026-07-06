import { timeToMinutes } from "@/lib/booking-utils";

export type OpeningHourRow = {
  dayOfWeek: number;
  isOpen: boolean;
  startTime: string;
  endTime: string;
};

export type ScheduleDayConfig = {
  name: string;
  dayOfWeek: number;
  isOpen: boolean;
  startHour: number;
  endHour: number;
};

export const DAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/** Carousel order: Monday → Sunday */
export const SCHEDULE_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export const FALLBACK_OPENING_HOURS: OpeningHourRow[] = [
  { dayOfWeek: 0, isOpen: false, startTime: "10:00:00", endTime: "16:00:00" },
  { dayOfWeek: 1, isOpen: true, startTime: "09:00:00", endTime: "19:00:00" },
  { dayOfWeek: 2, isOpen: true, startTime: "09:00:00", endTime: "19:00:00" },
  { dayOfWeek: 3, isOpen: true, startTime: "09:00:00", endTime: "19:00:00" },
  { dayOfWeek: 4, isOpen: true, startTime: "09:00:00", endTime: "19:00:00" },
  { dayOfWeek: 5, isOpen: true, startTime: "09:00:00", endTime: "19:00:00" },
  { dayOfWeek: 6, isOpen: true, startTime: "09:00:00", endTime: "18:00:00" },
];

function parseTimeHour(time: string) {
  return Number(time.slice(0, 2));
}

function normalizeTime(time: string) {
  const parts = time.slice(0, 5).split(":");
  return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:00`;
}

export function buildScheduleDayConfig(hours: OpeningHourRow[]): ScheduleDayConfig[] {
  const byDay = new Map(hours.map((row) => [row.dayOfWeek, row]));

  return SCHEDULE_DAY_ORDER.map((dayOfWeek) => {
    const row = byDay.get(dayOfWeek) ?? FALLBACK_OPENING_HOURS.find((h) => h.dayOfWeek === dayOfWeek)!;
    const startHour = parseTimeHour(row.startTime);
    const endHour = parseTimeHour(row.endTime);

    return {
      name: DAY_LABELS[dayOfWeek],
      dayOfWeek,
      isOpen: row.isOpen,
      startHour: row.isOpen ? startHour : 0,
      endHour: row.isOpen ? endHour : 0,
    };
  });
}

export const FALLBACK_SCHEDULE_DAY_CONFIG = buildScheduleDayConfig(FALLBACK_OPENING_HOURS);

export function getDayOfWeekFromDate(date: string) {
  return new Date(`${date}T12:00:00`).getDay();
}

export function getOpeningHoursForDate(hours: OpeningHourRow[], date: string) {
  const dayOfWeek = getDayOfWeekFromDate(date);
  return hours.find((row) => row.dayOfWeek === dayOfWeek);
}

export function intersectOpeningHours(
  salon: OpeningHourRow | undefined,
  stylist?: { startTime: string; endTime: string } | null
): { startTime: string; endTime: string } | null {
  if (!salon?.isOpen) return null;

  let start = normalizeTime(salon.startTime);
  let end = normalizeTime(salon.endTime);

  if (stylist) {
    const stylistStart = normalizeTime(stylist.startTime);
    const stylistEnd = normalizeTime(stylist.endTime);
    if (timeToMinutes(stylistStart.slice(0, 5)) > timeToMinutes(start.slice(0, 5))) {
      start = stylistStart;
    }
    if (timeToMinutes(stylistEnd.slice(0, 5)) < timeToMinutes(end.slice(0, 5))) {
      end = stylistEnd;
    }
  }

  if (timeToMinutes(start.slice(0, 5)) >= timeToMinutes(end.slice(0, 5))) {
    return null;
  }

  return { startTime: start, endTime: end };
}

export function isTimeWithinHours(startTime: string, endTime: string, slotStart: string, slotEnd: string) {
  const slotStartMin = timeToMinutes(slotStart.slice(0, 5));
  const slotEndMin = timeToMinutes(slotEnd.slice(0, 5));
  const openMin = timeToMinutes(startTime.slice(0, 5));
  const closeMin = timeToMinutes(endTime.slice(0, 5));
  return slotStartMin >= openMin && slotEndMin <= closeMin;
}

export function formatTimeInput(value: string) {
  return normalizeTime(value.length === 5 ? `${value}:00` : value);
}

export function toTimeInputValue(time: string) {
  return time.slice(0, 5);
}
