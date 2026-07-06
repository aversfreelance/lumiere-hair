import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getDb, withDb } from "@/lib/db";
import { openingHours } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import {
  DAY_LABELS,
  FALLBACK_OPENING_HOURS,
  formatTimeInput,
  type OpeningHourRow,
} from "@/lib/opening-hours";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await withDb(
    (db) => db.select().from(openingHours).orderBy(asc(openingHours.dayOfWeek)),
    FALLBACK_OPENING_HOURS
  );

  return NextResponse.json(rows.length ? rows : FALLBACK_OPENING_HOURS);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = (await request.json()) as OpeningHourRow[];
  if (!Array.isArray(body) || body.length !== 7) {
    return NextResponse.json({ error: "Expected 7 days of opening hours" }, { status: 400 });
  }

  for (const row of body) {
    if (row.dayOfWeek < 0 || row.dayOfWeek > 6) {
      return NextResponse.json({ error: "Invalid day of week" }, { status: 400 });
    }
    if (row.isOpen) {
      const start = formatTimeInput(row.startTime);
      const end = formatTimeInput(row.endTime);
      if (start >= end) {
        return NextResponse.json(
          { error: `${DAY_LABELS[row.dayOfWeek]}: closing time must be after opening time` },
          { status: 400 }
        );
      }
    }
  }

  await db.delete(openingHours);

  const inserted = await db
    .insert(openingHours)
    .values(
      body.map((row) => ({
        dayOfWeek: row.dayOfWeek,
        isOpen: row.isOpen,
        startTime: formatTimeInput(row.startTime),
        endTime: formatTimeInput(row.endTime),
      }))
    )
    .returning();

  return NextResponse.json(inserted.sort((a, b) => a.dayOfWeek - b.dayOfWeek));
}
