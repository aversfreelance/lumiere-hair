export type GalleryImage = {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  isActive?: boolean;
};

export const GALLERY_CATEGORIES = ["Color", "Cut", "Styling", "Treatment"] as const;

export const FALLBACK_GALLERY: GalleryImage[] = [
  {
    id: 1,
    title: "Sunset Balayage",
    imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80",
    category: "Color",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    title: "Precision Bob",
    imageUrl: "https://images.unsplash.com/photo-1595476108010-b334798e5352?w=600&q=80",
    category: "Cut",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    title: "Bridal Elegance",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
    category: "Styling",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    title: "Platinum Blonde",
    imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d544d?w=600&q=80",
    category: "Color",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 5,
    title: "Textured Layers",
    imageUrl: "https://images.unsplash.com/photo-1634449577050-15f83c093568?w=600&q=80",
    category: "Cut",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 6,
    title: "Evening Glam",
    imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51fb15?w=600&q=80",
    category: "Styling",
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 7,
    title: "Copper Tones",
    imageUrl: "https://images.unsplash.com/photo-1605497788041-5f32be35f269?w=600&q=80",
    category: "Color",
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 8,
    title: "Sleek Straight",
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
    category: "Treatment",
    sortOrder: 8,
    isActive: true,
  },
];

export function sortGalleryImages(images: GalleryImage[]) {
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}
