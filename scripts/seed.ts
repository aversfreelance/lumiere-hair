import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/auth";
import { FALLBACK_OPENING_HOURS } from "../src/lib/opening-hours";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Seeding database...");

  await db.delete(schema.bookings);
  await db.delete(schema.workingHours);
  await db.delete(schema.openingHours);
  await db.delete(schema.stylistServices);
  await db.delete(schema.galleryImages);
  await db.delete(schema.stylists);
  await db.delete(schema.services);
  await db.delete(schema.adminUsers);

  const [admin] = await db
    .insert(schema.adminUsers)
    .values({
      email: "admin@lumiere-hair.com",
      passwordHash: await hashPassword("admin123"),
      name: "Salon Admin",
    })
    .returning();

  await db.insert(schema.openingHours).values(FALLBACK_OPENING_HOURS);

  const insertedServices = await db
    .insert(schema.services)
    .values([
      { name: "Signature Cut & Style", description: "Precision cut tailored to your face shape, finished with a bespoke blowout.", category: "Cut & Style", durationMinutes: 60, priceCents: 6500 },
      { name: "Men's Grooming", description: "Classic or contemporary cuts with hot towel finish and styling.", category: "Cut & Style", durationMinutes: 45, priceCents: 4500 },
      { name: "Full Balayage", description: "Hand-painted highlights for a sun-kissed, natural dimension.", category: "Color", durationMinutes: 180, priceCents: 16500 },
      { name: "Root Touch-Up", description: "Seamless colour refresh at the roots with gloss treatment.", category: "Color", durationMinutes: 90, priceCents: 8000 },
      { name: "Keratin Smoothing", description: "Long-lasting frizz control and silky smooth results.", category: "Treatment", durationMinutes: 150, priceCents: 20000 },
      { name: "Deep Conditioning", description: "Intensive moisture therapy for damaged or dry hair.", category: "Treatment", durationMinutes: 45, priceCents: 4000 },
      { name: "Bridal Styling", description: "Trial and day-of styling for your special occasion.", category: "Special Occasion", durationMinutes: 90, priceCents: 12000 },
      { name: "Evening Updo", description: "Elegant updos and formal styling for events.", category: "Special Occasion", durationMinutes: 75, priceCents: 7500 },
      { name: "Simple Cut", description: "A quick, clean haircut with minimal styling — perfect for a fresh everyday look.", category: "Cut & Style", durationMinutes: 30, priceCents: 3000 },
      { name: "Simple Shave", description: "A classic straight-razor shave with hot towel prep and soothing finish.", category: "Cut & Style", durationMinutes: 30, priceCents: 2500 },
    ])
    .returning();

  const insertedStylists = await db
    .insert(schema.stylists)
    .values([
      { name: "Isabella Chen", title: "Creative Director", bio: "With 15 years of experience in haute coiffure, Isabella brings visionary color work and editorial precision to every client.", imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80", specialties: ["Balayage", "Editorial Styling", "Color Correction"] },
      { name: "Marcus Webb", title: "Senior Stylist", bio: "Marcus specializes in precision cuts and modern men's grooming, blending classic techniques with contemporary trends.", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", specialties: ["Precision Cuts", "Men's Grooming", "Textured Styles"] },
      { name: "Sofia Laurent", title: "Color Specialist", bio: "Sofia's passion for color science ensures flawless, vibrant results while maintaining hair health and integrity.", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80", specialties: ["Vivid Color", "Balayage", "Toning"] },
      { name: "James Okonkwo", title: "Styling Expert", bio: "From red carpet updos to effortless everyday looks, James creates styles that enhance your natural beauty.", imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80", specialties: ["Bridal", "Updos", "Event Styling"] },
    ])
    .returning();

  for (const stylist of insertedStylists) {
    for (const service of insertedServices) {
      await db.insert(schema.stylistServices).values({
        stylistId: stylist.id,
        serviceId: service.id,
      });
    }

    for (let day = 1; day <= 6; day++) {
      await db.insert(schema.workingHours).values({
        stylistId: stylist.id,
        dayOfWeek: day,
        startTime: "09:00:00",
        endTime: day === 6 ? "18:00:00" : "19:00:00",
      });
    }
  }

  await db.insert(schema.galleryImages).values([
    { title: "Sunset Balayage", imageUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80", category: "Color", sortOrder: 1 },
    { title: "Precision Bob", imageUrl: "https://images.unsplash.com/photo-1595476108010-b334798e5352?w=600&q=80", category: "Cut", sortOrder: 2 },
    { title: "Bridal Elegance", imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80", category: "Styling", sortOrder: 3 },
    { title: "Platinum Blonde", imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d544d?w=600&q=80", category: "Color", sortOrder: 4 },
    { title: "Textured Layers", imageUrl: "https://images.unsplash.com/photo-1634449577050-15f83c093568?w=600&q=80", category: "Cut", sortOrder: 5 },
    { title: "Evening Glam", imageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51fb15?w=600&q=80", category: "Styling", sortOrder: 6 },
    { title: "Copper Tones", imageUrl: "https://images.unsplash.com/photo-1605497788041-5f32be35f269?w=600&q=80", category: "Color", sortOrder: 7 },
    { title: "Sleek Straight", imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80", category: "Treatment", sortOrder: 8 },
  ]);

  console.log("Seed complete!");
  console.log(`Admin login: ${admin.email} / admin123`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
