import { SalonImage } from "@/components/ui/SalonImage";

const images = [
  { id: 1, title: "Sunset Balayage", imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80" },
  { id: 2, title: "Precision Bob", imageUrl: "https://images.unsplash.com/photo-1595476108010-b334798e5352?w=600&q=80" },
  { id: 3, title: "Bridal Elegance", imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80" },
  { id: 4, title: "Platinum Blonde", imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d544d?w=600&q=80" },
  { id: 5, title: "Textured Layers", imageUrl: "https://images.unsplash.com/photo-1634449577050-15f83c093568?w=600&q=80" },
  { id: 6, title: "Evening Glam", imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51fb15?w=600&q=80" },
  { id: 7, title: "Copper Tones", imageUrl: "https://images.unsplash.com/photo-1605497788041-5f32be35f269?w=600&q=80" },
  { id: 8, title: "Sleek Straight", imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80" },
];

export function YoungGalleryPage() {
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
