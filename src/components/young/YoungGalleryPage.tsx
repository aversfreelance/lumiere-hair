import { SalonImage } from "@/components/ui/SalonImage";
import type { GalleryImage } from "@/lib/gallery-data";

export function YoungGalleryPage({ images }: { images: GalleryImage[] }) {
  return (
    <div className="ss-page-box">
      <h1 className="ss-page-title">
        Our <span>Gallery</span>
      </h1>
      <div className="ss-gallery-grid">
        {images.map((image) => (
          <figure key={image.id}>
            <SalonImage
              src={image.imageUrl}
              alt={image.title}
              variant="square"
              className="aspect-square w-full rounded-[25px] object-cover"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
