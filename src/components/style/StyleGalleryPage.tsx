import { StylePageHero } from "@/components/style/StylePageHero";
import { SalonImage } from "@/components/ui/SalonImage";

const images = [
  { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80", alt: "Salon interior" },
  { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80", alt: "Styling session" },
  { src: "https://images.unsplash.com/photo-1595476108010-b334798e5352?w=400&q=80", alt: "Hair colour" },
  { src: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80", alt: "Balayage result" },
  { src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&q=80", alt: "Treatment" },
  { src: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=400&q=80", alt: "Bridal styling" },
  { src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80", alt: "Men's cut" },
  { src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80", alt: "Updo styling" },
];

export function StyleGalleryPage() {
  return (
    <>
      <StylePageHero title="Gallery" subtitle="our work" />
      <div className="st-container st-page">
        <div className="st-gallery-grid">
          {images.map((img) => (
            <div key={img.src} className="st-gallery-item">
              <SalonImage src={img.src} alt={img.alt} variant="square" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
