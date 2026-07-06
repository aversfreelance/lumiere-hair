import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings, services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { computeEndTime } from "@/lib/booking-utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const endTime = computeEndTime(startTime, service.durationMinutes);

    const [booking] = await db
      .insert(bookings)
      .values({
        serviceId,
        stylistId,
        bookingDate,
        startTime,
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
