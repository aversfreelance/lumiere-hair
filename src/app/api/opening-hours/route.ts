import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { openingHours } from "@/lib/db/schema";
import { FALLBACK_OPENING_HOURS } from "@/lib/opening-hours";

export async function GET() {
  const rows = await withDb(
    (db) => db.select().from(openingHours).orderBy(asc(openingHours.dayOfWeek)),
    FALLBACK_OPENING_HOURS
  );

  return NextResponse.json(rows.length ? rows : FALLBACK_OPENING_HOURS);
}
