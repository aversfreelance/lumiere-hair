"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SalonImage } from "@/components/ui/SalonImage";

type Stylist = {
  id: number;
  name: string;
  title: string;
  imageUrl: string;
};

const FALLBACK_STYLISTS: Stylist[] = [
  {
    id: 1,
    name: "Isabella Chen",
    title: "Creative Director",
    imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80",
  },
  {
    id: 2,
    name: "Marcus Webb",
    title: "Senior Stylist",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    id: 3,
    name: "Sofia Laurent",
    title: "Colour Specialist",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
  },
  {
    id: 4,
    name: "James Okonkwo",
    title: "Styling Expert",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
  },
];

export function YoungStylistsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [stylists, setStylists] = useState<Stylist[]>(FALLBACK_STYLISTS);

  useEffect(() => {
    fetch("/api/stylists")
      .then((r) => r.json())
      .then((data: Stylist[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setStylists(data);
        }
      })
      .catch(() => {});
  }, []);

  function scroll(dir: number) {
    trackRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  }

  return (
    <section className="ss-container ss-stylists-section">
      <div className="ss-scroll-header">
        <h2 className="ss-scroll-title">Our Stylists</h2>
        <div className="ss-stylists-header-actions">
          <Link href="/stylists" className="ss-stylists-view-all">
            View all
          </Link>
          <div className="ss-scroll-nav">
            <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left">
              ‹
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Scroll right">
              ›
            </button>
          </div>
        </div>
      </div>
      <div className="ss-stylists-track" ref={trackRef}>
        {stylists.map((stylist) => (
          <Link
            key={stylist.id}
            href={`/booking?stylist=${stylist.id}`}
            className="ss-stylist-scroll-card"
          >
            <div className="ss-stylist-scroll-photo">
              <SalonImage
                src={stylist.imageUrl}
                alt={stylist.name}
                variant="portrait"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="ss-stylist-scroll-name">{stylist.name.split(" ")[0]}</p>
            <p className="ss-stylist-scroll-role">{stylist.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
