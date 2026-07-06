export type Service = {
  id: number;
  name: string;
  description: string;
  category: string;
  durationMinutes: number;
  priceCents: number;
};

export const FALLBACK_SERVICES: Service[] = [
  {
    id: 1,
    name: "Signature Cut & Style",
    description: "Precision cut tailored to your face shape, finished with a bespoke blowout.",
    category: "Cut & Style",
    durationMinutes: 60,
    priceCents: 6500,
  },
  {
    id: 2,
    name: "Men's Grooming",
    description: "Classic or contemporary cuts with hot towel finish and styling.",
    category: "Cut & Style",
    durationMinutes: 45,
    priceCents: 4500,
  },
  {
    id: 3,
    name: "Full Balayage",
    description: "Hand-painted highlights for a sun-kissed, natural dimension.",
    category: "Color",
    durationMinutes: 180,
    priceCents: 16500,
  },
  {
    id: 4,
    name: "Root Touch-Up",
    description: "Seamless colour refresh at the roots with gloss treatment.",
    category: "Color",
    durationMinutes: 90,
    priceCents: 8000,
  },
  {
    id: 5,
    name: "Keratin Smoothing",
    description: "Long-lasting frizz control and silky smooth results.",
    category: "Treatment",
    durationMinutes: 150,
    priceCents: 20000,
  },
  {
    id: 6,
    name: "Deep Conditioning",
    description: "Intensive moisture therapy for damaged or dry hair.",
    category: "Treatment",
    durationMinutes: 45,
    priceCents: 4000,
  },
  {
    id: 7,
    name: "Bridal Styling",
    description: "Trial and day-of styling for your special occasion.",
    category: "Special Occasion",
    durationMinutes: 90,
    priceCents: 12000,
  },
  {
    id: 8,
    name: "Evening Updo",
    description: "Elegant updos and formal styling for events.",
    category: "Special Occasion",
    durationMinutes: 75,
    priceCents: 7500,
  },
  {
    id: 9,
    name: "Simple Cut",
    description: "A quick, clean haircut with minimal styling — perfect for a fresh everyday look.",
    category: "Cut & Style",
    durationMinutes: 30,
    priceCents: 3000,
  },
  {
    id: 10,
    name: "Simple Shave",
    description: "A classic straight-razor shave with hot towel prep and soothing finish.",
    category: "Cut & Style",
    durationMinutes: 30,
    priceCents: 2500,
  },
];

export function sortServicesByPrice<T extends { priceCents: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.priceCents - b.priceCents);
}

export function getFallbackServiceById(id: number): Service | undefined {
  return FALLBACK_SERVICES.find((service) => service.id === id);
}
