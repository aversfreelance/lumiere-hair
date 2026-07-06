import { NextRequest, NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { bookings, services, workingHours } from "@/lib/db/schema";
import { and, eq, ne } from "drizzle-orm";
import {
  computeEndTime,
  generateTimeSlots,
  slotsOverlap,
} from "@/lib/booking-utils";

const defaultSlots = [
  "09:00:00", "09:30:00", "10:00:00", "10:30:00", "11:00:00",
  "11:30:00", "13:00:00", "13:30:00", "14:00:00", "14:30:00",
  "15:00:00", "15:30:00", "16:00:00", "16:30:00", "17:00:00",
];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const stylistId = Number(searchParams.get("stylistId"));
  const serviceId = Number(searchParams.get("serviceId"));
  const date = searchParams.get("date");

  if (!stylistId || !serviceId || !date) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const slots = await withDb(async (db) => {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!service) return [];

    const dayOfWeek = new Date(date + "T12:00:00").getDay();
    const [hours] = await db
      .select()
      .from(workingHours)
      .where(
        and(
          eq(workingHours.stylistId, stylistId),
          eq(workingHours.dayOfWeek, dayOfWeek)
        )
      )
      .limit(1);

    if (!hours) return [];

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
      hours.startTime,
      hours.endTime,
      service.durationMinutes
    );

    return allSlots.filter((slot) => {
      const slotEnd = computeEndTime(slot, service.durationMinutes);
      return !existingBookings.some((b) =>
        slotsOverlap(slot, slotEnd, b.startTime, b.endTime)
      );
    });
  }, defaultSlots);

  return NextResponse.json({ slots: slots.length ? slots : defaultSlots });
}
