import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb, withDb } from "@/lib/db";
import { bookings, services, stylists } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await withDb(
    (db) =>
      db
        .select({
          id: bookings.id,
          clientName: bookings.clientName,
          clientEmail: bookings.clientEmail,
          clientPhone: bookings.clientPhone,
          bookingDate: bookings.bookingDate,
          startTime: bookings.startTime,
          endTime: bookings.endTime,
          status: bookings.status,
          notes: bookings.notes,
          serviceId: bookings.serviceId,
          stylistId: bookings.stylistId,
          serviceName: services.name,
          servicePriceCents: services.priceCents,
          stylistName: stylists.name,
        })
        .from(bookings)
        .leftJoin(services, eq(bookings.serviceId, services.id))
        .leftJoin(stylists, eq(bookings.stylistId, stylists.id))
        .orderBy(desc(bookings.bookingDate), desc(bookings.startTime)),
    []
  );

  return NextResponse.json(rows);
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await request.json();
  if (!id || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const [updated] = await db
    .update(bookings)
    .set({ status })
    .where(eq(bookings.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const id = Number(searchParams.get("id"));
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  await db.delete(bookings).where(eq(bookings.id, id));
  return NextResponse.json({ success: true });
}
