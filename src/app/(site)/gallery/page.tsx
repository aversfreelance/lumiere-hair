import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { withDb } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";
import { ThemePageSwitch } from "@/components/theme/ThemePageSwitch";
import { YoungGalleryPage } from "@/components/young/YoungGalleryPage";
import { StyleGalleryPage } from "@/components/style/StyleGalleryPage";
import { GalleryPhoto } from "@/components/ui/MediaPlaceholders";
import { FALLBACK_GALLERY, sortGalleryImages, type GalleryImage } from "@/lib/gallery-data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our portfolio of stunning hair transformations.",
};

async function loadGalleryImages(): Promise<GalleryImage[]> {
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
  return sortGalleryImages(active.length ? active : FALLBACK_GALLERY);
}

export default async function GalleryPage() {
  const images = await loadGalleryImages();

  return (
    <ThemePageSwitch
      elegant={<ElegantGalleryPage images={images} />}
      young={<YoungGalleryPage images={images} />}
      style={<StyleGalleryPage images={images} />}
    />
  );
}

function ElegantGalleryPage({ images }: { images: GalleryImage[] }) {
  const categories = ["All", ...new Set(images.map((i) => i.category))];

  return (
    <div>
      <section className="border-b border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Portfolio</p>
          <h1 className="font-serif mt-4 text-5xl md:text-6xl">Gallery</h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted">
            A curated collection of our finest work — from subtle refinements to
            bold transformations.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <span
                key={cat}
                className="border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {images.map((image, i) => (
              <figure
                key={image.id}
                className={`group relative overflow-hidden ${i === 0 || i === 5 ? "lg:col-span-2 lg:row-span-2" : ""}`}
              >
                <GalleryPhoto
                  src={image.imageUrl}
                  alt={image.title}
                  className={`transition-transform duration-700 group-hover:scale-105 ${i === 0 || i === 5 ? "aspect-[4/5]" : "aspect-square"}`}
                />
                <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background/90 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-xs uppercase tracking-widest text-gold">{image.category}</p>
                  <p className="font-serif text-lg">{image.title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
