import { NextResponse } from "next/server";
import { withDb } from "@/lib/db";
import { stylists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const fallback = [
  {
    id: 1,
    name: "Isabella Chen",
    title: "Creative Director",
    imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80",
  },
  {
    id: 2,
    name: "Marcus Webb",
    title: "Senior Stylist",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    id: 3,
    name: "Sofia Laurent",
    title: "Color Specialist",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
  },
  {
    id: 4,
    name: "James Okonkwo",
    title: "Styling Expert",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
];

export async function GET() {
  const rows = await withDb(
    async (db) =>
      db
        .select({
          id: stylists.id,
          name: stylists.name,
          title: stylists.title,
          imageUrl: stylists.imageUrl,
        })
        .from(stylists)
        .where(eq(stylists.isActive, true)),
    fallback
  );

  return NextResponse.json(rows.length ? rows : fallback);
}
