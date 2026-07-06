import { NextRequest, NextResponse } from "next/server";
import { getDb, withDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { FALLBACK_SERVICES, sortServicesByPrice } from "@/lib/services-data";

const FALLBACK_ADMIN_SERVICES = FALLBACK_SERVICES.map((s) => ({
  ...s,
  isActive: true,
}));

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await withDb((db) => db.select().from(services), FALLBACK_ADMIN_SERVICES);
  return NextResponse.json(sortServicesByPrice(rows));
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const [created] = await db.insert(services).values(body).returning();
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { id, ...data } = await request.json();
  const [updated] = await db
    .update(services)
    .set(data)
    .where(eq(services.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const id = Number(request.nextUrl.searchParams.get("id"));
  await db.delete(services).where(eq(services.id, id));
  return NextResponse.json({ success: true });
}
