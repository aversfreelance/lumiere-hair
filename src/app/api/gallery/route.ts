import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { withDb } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";
import { FALLBACK_GALLERY, sortGalleryImages } from "@/lib/gallery-data";

export async function GET() {
  const rows = await withDb(
    (db) =>
      db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.isActive, true))
        .orderBy(asc(galleryImages.sortOrder)),
    FALLBACK_GALLERY
  );

  const active = rows.filter((row) => row.isActive !== false);
  return NextResponse.json(sortGalleryImages(active.length ? active : FALLBACK_GALLERY));
}
