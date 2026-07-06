import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { bookings, openingHours, services, workingHours } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { computeEndTime, generateTimeSlots, slotsOverlap } from "@/lib/booking-utils";
import {
  FALLBACK_OPENING_HOURS,
  getDayOfWeekFromDate,
  intersectOpeningHours,
  isTimeWithinHours,
} from "@/lib/opening-hours";
import { isBookingDateInRange } from "@/lib/schedule-utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json([]);
  }

  try {
    const rows = await db.select().from(bookings);
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceId,
      stylistId,
      bookingDate,
      startTime,
      clientName,
      clientEmail,
      clientPhone,
      notes,
    } = body;

    if (
      !serviceId ||
      !stylistId ||
      !bookingDate ||
      !startTime ||
      !clientName ||
      !clientEmail ||
      !clientPhone
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    if (!isBookingDateInRange(bookingDate)) {
      return NextResponse.json(
        { error: "Booking date must be within the next 2 weeks" },
        { status: 400 }
      );
    }

    const dayOfWeek = getDayOfWeekFromDate(bookingDate);
    const [salonRow] = await db
      .select()
      .from(openingHours)
      .where(eq(openingHours.dayOfWeek, dayOfWeek))
      .limit(1);

    const salon =
      salonRow ?? FALLBACK_OPENING_HOURS.find((row) => row.dayOfWeek === dayOfWeek);

    const [stylistHours] = await db
      .select()
      .from(workingHours)
      .where(and(eq(workingHours.stylistId, stylistId), eq(workingHours.dayOfWeek, dayOfWeek)))
      .limit(1);

    const effective = intersectOpeningHours(salon, stylistHours ?? null);
    if (!effective) {
      return NextResponse.json({ error: "Salon is closed on this date" }, { status: 400 });
    }

    const normalizedStart = startTime.length === 5 ? `${startTime}:00` : startTime;
    const endTime = computeEndTime(normalizedStart, service.durationMinutes);

    if (!isTimeWithinHours(effective.startTime, effective.endTime, normalizedStart, endTime)) {
      return NextResponse.json({ error: "Selected time is outside opening hours" }, { status: 400 });
    }

    const existingBookings = await db
      .select({ startTime: bookings.startTime, endTime: bookings.endTime })
      .from(bookings)
      .where(
        and(
          eq(bookings.stylistId, stylistId),
          eq(bookings.bookingDate, bookingDate),
          ne(bookings.status, "cancelled")
        )
      );

    const validSlots = generateTimeSlots(
      effective.startTime,
      effective.endTime,
      service.durationMinutes
    );

    if (!validSlots.includes(normalizedStart)) {
      return NextResponse.json({ error: "Invalid booking time slot" }, { status: 400 });
    }

    if (
      existingBookings.some((b) =>
        slotsOverlap(normalizedStart, endTime, b.startTime, b.endTime)
      )
    ) {
      return NextResponse.json({ error: "This time slot is no longer available" }, { status: 409 });
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        serviceId,
        stylistId,
        bookingDate,
        startTime: normalizedStart,
        endTime,
        clientName,
        clientEmail,
        clientPhone,
        notes: notes || null,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
