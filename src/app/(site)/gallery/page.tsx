import type { Metadata } from "next";
import { withDb } from "@/lib/db";
import { galleryImages } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { ThemePageSwitch } from "@/components/theme/ThemePageSwitch";
import { YoungGalleryPage } from "@/components/young/YoungGalleryPage";
import { StyleGalleryPage } from "@/components/style/StyleGalleryPage";
import { GalleryPhoto } from "@/components/ui/MediaPlaceholders";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our portfolio of stunning hair transformations.",
};

const fallbackGallery = [
  { id: 1, title: "Sunset Balayage", imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80", category: "Color" },
  { id: 2, title: "Precision Bob", imageUrl: "https://images.unsplash.com/photo-1595476108010-b334798e5352?w=600&q=80", category: "Cut" },
  { id: 3, title: "Bridal Elegance", imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80", category: "Styling" },
  { id: 4, title: "Platinum Blonde", imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d544d?w=600&q=80", category: "Color" },
  { id: 5, title: "Textured Layers", imageUrl: "https://images.unsplash.com/photo-1634449577050-15f83c093568?w=600&q=80", category: "Cut" },
  { id: 6, title: "Evening Glam", imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51fb15?w=600&q=80", category: "Styling" },
  { id: 7, title: "Copper Tones", imageUrl: "https://images.unsplash.com/photo-1605497788041-5f32be35f269?w=600&q=80", category: "Color" },
  { id: 8, title: "Sleek Straight", imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80", category: "Treatment" },
];

export default async function GalleryPage() {
  return (
    <ThemePageSwitch elegant={<ElegantGalleryPage />} young={<YoungGalleryPage />} style={<StyleGalleryPage />} />
  );
}

async function ElegantGalleryPage() {
  const images = await withDb(
    async (db) =>
      db
        .select()
        .from(galleryImages)
        .where(eq(galleryImages.isActive, true))
        .orderBy(asc(galleryImages.sortOrder)),
    fallbackGallery
  );

  const displayImages = images.length > 0 ? images : fallbackGallery;
  const categories = ["All", ...new Set(displayImages.map((i) => i.category))];

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
            {displayImages.map((image, i) => (
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
