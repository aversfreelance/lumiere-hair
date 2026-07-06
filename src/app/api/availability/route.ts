import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { withDb } from "@/lib/db";
import { bookings, openingHours, services, workingHours } from "@/lib/db/schema";
import {
  computeEndTime,
  generateTimeSlots,
  slotsOverlap,
} from "@/lib/booking-utils";
import {
  FALLBACK_OPENING_HOURS,
  getDayOfWeekFromDate,
  intersectOpeningHours,
} from "@/lib/opening-hours";
import { FALLBACK_SERVICES } from "@/lib/services-data";
import { isBookingDateInRange } from "@/lib/schedule-utils";

async function computeAvailableSlots(
  stylistId: number,
  serviceId: number,
  date: string,
  db: Parameters<Parameters<typeof withDb>[0]>[0]
) {
  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);

  if (!service) return [];

  const dayOfWeek = getDayOfWeekFromDate(date);
  const salonHours = await db
    .select()
    .from(openingHours)
    .where(eq(openingHours.dayOfWeek, dayOfWeek))
    .limit(1);

  const salonRow = salonHours[0];
  const fallbackSalon = FALLBACK_OPENING_HOURS.find((row) => row.dayOfWeek === dayOfWeek);
  const salon = salonRow ?? fallbackSalon;

  const [stylistHours] = await db
    .select()
    .from(workingHours)
    .where(and(eq(workingHours.stylistId, stylistId), eq(workingHours.dayOfWeek, dayOfWeek)))
    .limit(1);

  const effective = intersectOpeningHours(salon, stylistHours ?? null);
  if (!effective) return [];

  const existingBookings = await db
    .select({
      startTime: bookings.startTime,
      endTime: bookings.endTime,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.stylistId, stylistId),
        eq(bookings.bookingDate, date),
        ne(bookings.status, "cancelled")
      )
    );

  const allSlots = generateTimeSlots(
    effective.startTime,
    effective.endTime,
    service.durationMinutes
  );

  return allSlots.filter((slot) => {
    const slotEnd = computeEndTime(slot, service.durationMinutes);
    return !existingBookings.some((b) => slotsOverlap(slot, slotEnd, b.startTime, b.endTime));
  });
}

function computeFallbackSlots(stylistId: number, serviceId: number, date: string) {
  void stylistId;
  const service = FALLBACK_SERVICES.find((s) => s.id === serviceId);
  if (!service) return [];

  const dayOfWeek = getDayOfWeekFromDate(date);
  const salon = FALLBACK_OPENING_HOURS.find((row) => row.dayOfWeek === dayOfWeek);
  const effective = intersectOpeningHours(salon, null);
  if (!effective) return [];

  return generateTimeSlots(effective.startTime, effective.endTime, service.durationMinutes);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const stylistId = Number(searchParams.get("stylistId"));
  const serviceId = Number(searchParams.get("serviceId"));
  const date = searchParams.get("date");

  if (!stylistId || !serviceId || !date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  if (!isBookingDateInRange(date)) {
    return NextResponse.json({ slots: [] });
  }

  const slots = await withDb(
    (db) => computeAvailableSlots(stylistId, serviceId, date, db),
    computeFallbackSlots(stylistId, serviceId, date)
  );

  return NextResponse.json({ slots });
}
