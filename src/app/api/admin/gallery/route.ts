import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb, withDb } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { FALLBACK_GALLERY, sortGalleryImages } from "@/lib/gallery-data";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await withDb(
    (db) => db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder)),
    FALLBACK_GALLERY
  );

  return NextResponse.json(sortGalleryImages(rows));
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
  const [created] = await db.insert(galleryImages).values(body).returning();
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
    .update(galleryImages)
    .set(data)
    .where(eq(galleryImages.id, id))
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
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  return NextResponse.json({ success: true });
}
