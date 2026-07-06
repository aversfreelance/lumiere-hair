import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { stylists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const fallback = [
  { id: 1, name: "Isabella Chen", title: "Creative Director" },
  { id: 2, name: "Marcus Webb", title: "Senior Stylist" },
  { id: 3, name: "Sofia Laurent", title: "Color Specialist" },
  { id: 4, name: "James Okonkwo", title: "Styling Expert" },
];

export async function GET() {
  const rows = await withDb(
    async (db) =>
      db
        .select({
          id: stylists.id,
          name: stylists.name,
          title: stylists.title,
        })
        .from(stylists)
        .where(eq(stylists.isActive, true)),
    fallback
  );

  return NextResponse.json(rows.length ? rows : fallback);
}
