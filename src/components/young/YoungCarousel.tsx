"use client";

import { useEffect, useState } from "react";
import { PlaceholderContent } from "@/components/ui/placeholders";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80",
    alt: "Salon interior",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&q=80",
    alt: "Hair styling",
  },
  {
    src: "https://images.unsplash.com/photo-1634449577050-15f83c093568?w=1600&q=80",
    alt: "Premium cut",
  },
];

export function YoungCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="ss-carousel">
      <div
        className="ss-carousel-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.src} className="ss-carousel-slide">
            <SlideImage src={slide.src} alt={slide.alt} />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="ss-carousel-nav ss-carousel-prev"
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="ss-carousel-nav ss-carousel-next"
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        aria-label="Next slide"
      >
        ›
      </button>
      <div className="ss-carousel-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`ss-carousel-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function SlideImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <PlaceholderContent variant="carousel" label={alt} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={() => setFailed(true)} />
  );
}
