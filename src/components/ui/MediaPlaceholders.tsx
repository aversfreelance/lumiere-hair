"use client";

import { useEffect, useRef, useState } from "react";
import { SalonBackground } from "@/components/ui/SalonImage";

type HeroBackgroundProps = {
  src?: string | null;
  alt: string;
  className?: string;
  parallax?: boolean;
  children?: React.ReactNode;
};

export function HeroBackground({
  src,
  alt,
  className = "",
  parallax = false,
  children,
}: HeroBackgroundProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src?.trim() || failed;

  useEffect(() => {
    if (!parallax || showPlaceholder) return;

    const layer = layerRef.current;
    if (!layer) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;

    function update() {
      const currentLayer = layerRef.current;
      if (!currentLayer) return;
      const section = currentLayer.closest(".hero-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const y = -rect.top * 0.38;
      currentLayer.style.transform = `translate3d(0, ${y}px, 0)`;
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [parallax, showPlaceholder]);

  if (parallax) {
    if (showPlaceholder) {
      return (
        <SalonBackground
          src={null}
          alt={alt}
          variant="hero"
          className={className || "hero-bg"}
          placeholderLabel="Lumière Hair Atelier"
        >
          {children}
        </SalonBackground>
      );
    }

    return (
      <div className={`hero-bg hero-bg-parallax ${className}`.trim()} aria-hidden={alt === ""}>
        <div ref={layerRef} className="hero-bg-parallax-layer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src as string}
            alt={alt}
            className="hero-bg-parallax-img"
            onError={() => setFailed(true)}
            loading="eager"
            decoding="async"
          />
        </div>
        {children}
      </div>
    );
  }

  return (
    <SalonBackground
      src={src}
      alt={alt}
      variant="hero"
      className={className || "hero-bg"}
      placeholderLabel="Lumière Hair Atelier"
    >
      {children}
    </SalonBackground>
  );
}

export function StylistPhoto({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <SalonBackground
      src={src}
      alt={alt}
      variant="portrait"
      className={className}
      placeholderLabel={alt}
    />
  );
}

export function GalleryPhoto({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  return (
    <SalonBackground
      src={src}
      alt={alt}
      variant="square"
      className={className}
      placeholderLabel={alt}
    />
  );
}
