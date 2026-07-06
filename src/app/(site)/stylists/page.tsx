import type { Metadata } from "next";
import Link from "next/link";
import { withDb } from "@/lib/db";
import { stylists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ThemePageSwitch } from "@/components/theme/ThemePageSwitch";
import { YoungStylistsPage } from "@/components/young/YoungStylistsPage";
import { StyleStylistsPage } from "@/components/style/StyleStylistsPage";
import { StylistPhoto } from "@/components/ui/MediaPlaceholders";

export const metadata: Metadata = {
  title: "Stylists",
  description: "Meet our team of master hair stylists.",
};

const fallbackStylists = [
  {
    id: 1,
    name: "Isabella Chen",
    title: "Creative Director",
    bio: "With 15 years of experience in haute coiffure, Isabella brings visionary color work and editorial precision to every client.",
    imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80",
    specialties: ["Balayage", "Editorial Styling", "Color Correction"],
  },
  {
    id: 2,
    name: "Marcus Webb",
    title: "Senior Stylist",
    bio: "Marcus specializes in precision cuts and modern men's grooming, blending classic techniques with contemporary trends.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    specialties: ["Precision Cuts", "Men's Grooming", "Textured Styles"],
  },
  {
    id: 3,
    name: "Sofia Laurent",
    title: "Color Specialist",
    bio: "Sofia's passion for color science ensures flawless, vibrant results while maintaining hair health and integrity.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    specialties: ["Vivid Color", "Balayage", "Toning"],
  },
  {
    id: 4,
    name: "James Okonkwo",
    title: "Styling Expert",
    bio: "From red carpet updos to effortless everyday looks, James creates styles that enhance your natural beauty.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
    specialties: ["Bridal", "Updos", "Event Styling"],
  },
];

export default async function StylistsPage() {
  return (
    <ThemePageSwitch elegant={<ElegantStylistsPage />} young={<YoungStylistsPage />} style={<StyleStylistsPage />} />
  );
}

async function ElegantStylistsPage() {
  const team = await withDb(
    async (db) => db.select().from(stylists).where(eq(stylists.isActive, true)),
    fallbackStylists
  );

  const displayTeam = team.length > 0 ? team : fallbackStylists;

  return (
    <div>
      <section className="border-b border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">The Team</p>
          <h1 className="font-serif mt-4 text-5xl md:text-6xl">Master Stylists</h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted">
            Our artists are trained in the latest techniques and committed to
            delivering an exceptional experience.
          </p>
        </div>
      </section>

      <section className="el-stylists-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="el-stylists-grid">
            {displayTeam.map((stylist) => (
              <article key={stylist.id} className="el-stylist-card">
                <div className="el-stylist-card-photo">
                  <StylistPhoto src={stylist.imageUrl} alt={stylist.name} className="h-full w-full" />
                </div>
                <div className="el-stylist-card-body">
                  <p className="el-stylist-card-title">{stylist.title}</p>
                  <h2 className="el-stylist-card-name">{stylist.name}</h2>
                  <p className="el-stylist-card-bio">{stylist.bio}</p>
                  <div className="el-stylist-card-tags">
                    {stylist.specialties.map((spec) => (
                      <span key={spec} className="el-stylist-card-tag">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <Link href={`/booking?stylist=${stylist.id}`} className="el-stylist-card-link">
                    Book with {stylist.name.split(" ")[0]} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
