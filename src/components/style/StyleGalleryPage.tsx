import { StylePageHero } from "@/components/style/StylePageHero";
import { SalonImage } from "@/components/ui/SalonImage";
import type { GalleryImage } from "@/lib/gallery-data";

export function StyleGalleryPage({ images }: { images: GalleryImage[] }) {
  return (
    <>
      <StylePageHero title="Gallery" subtitle="our work" />
      <div className="st-container st-page">
        <div className="st-gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="st-gallery-item">
              <SalonImage
                src={image.imageUrl}
                alt={image.title}
                variant="square"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
