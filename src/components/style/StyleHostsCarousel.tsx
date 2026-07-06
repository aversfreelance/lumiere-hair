"use client";

import Link from "next/link";
import { StyleStylistPortrait } from "@/components/style/StyleStylistPortrait";

const hosts = [
  { id: 1, name: "Isabelle Laurent", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80" },
  { id: 2, name: "Marcus Chen", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { id: 3, name: "Sophie Williams", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { id: 4, name: "James Okonkwo", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
];

export function StyleHostsCarousel() {
  return (
    <section className="st-hosts-section">
      <div className="st-container">
        <h2 className="st-section-title">Stylists</h2>

        <div className="st-hosts-track">
          {hosts.map((host, i) => (
            <Link key={host.id} href={`/booking?stylist=${host.id}`} className="st-host-slide">
              <StyleStylistPortrait src={host.image} alt={host.name} index={i} />
              <h3 className="st-host-slide-name">{host.name.split(" ")[0]}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
