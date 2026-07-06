import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sortServicesByPrice } from "@/lib/services-data";

const fallback = [
  { id: 1, name: "Signature Cut & Style", durationMinutes: 60, priceCents: 6500 },
  { id: 2, name: "Men's Grooming", durationMinutes: 45, priceCents: 4500 },
  { id: 3, name: "Full Balayage", durationMinutes: 180, priceCents: 16500 },
  { id: 4, name: "Root Touch-Up", durationMinutes: 90, priceCents: 8000 },
  { id: 5, name: "Keratin Smoothing", durationMinutes: 150, priceCents: 20000 },
  { id: 6, name: "Deep Conditioning", durationMinutes: 45, priceCents: 4000 },
  { id: 7, name: "Bridal Styling", durationMinutes: 90, priceCents: 12000 },
  { id: 8, name: "Evening Updo", durationMinutes: 75, priceCents: 7500 },
  { id: 9, name: "Simple Cut", durationMinutes: 30, priceCents: 3000 },
  { id: 10, name: "Simple Shave", durationMinutes: 30, priceCents: 2500 },
];

export async function GET() {
  const rows = await withDb(
    async (db) =>
      db
        .select({
          id: services.id,
          name: services.name,
          durationMinutes: services.durationMinutes,
          priceCents: services.priceCents,
        })
        .from(services)
        .where(eq(services.isActive, true)),
    fallback
  );

  return NextResponse.json(sortServicesByPrice(rows.length ? rows : fallback));
}
