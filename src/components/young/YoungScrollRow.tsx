"use client";

import { useRef } from "react";
import Link from "next/link";
import { SalonImage } from "@/components/ui/SalonImage";

type ScrollItem = {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
};

export function YoungScrollRow({
  title,
  items,
}: {
  title: string;
  items: ScrollItem[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  }

  return (
    <section className="ss-container ss-scroll-section">
      <div className="ss-scroll-header">
        <h2 className="ss-scroll-title">{title}</h2>
        <div className="ss-scroll-nav">
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left">
            ‹
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll right">
            ›
          </button>
        </div>
      </div>
      <div className="ss-scroll-track" ref={trackRef}>
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="ss-scroll-card">
            <div className="ss-scroll-card-img">
              <SalonImage
                src={item.imageUrl}
                alt={item.title}
                variant="thumb"
                placeholderLabel={item.title}
                className="h-full min-h-[130px] w-full object-cover"
              />
              <div className="ss-scroll-card-overlay">▶</div>
            </div>
            <div className="ss-scroll-card-title">
              <strong>{item.subtitle}</strong> — {item.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
