"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { StyleTextLogo } from "@/components/style/StyleTextLogo";
import { HeroVideoOnce } from "@/components/ui/HeroVideoOnce";

const HERO_VIDEO = "/videos/fej-animacio.mp4";
const HERO_POSTER = "/images/style/hero-bg.png";

const heroBands = [
  {
    id: "morning",
    titleSvg: "/images/style/hero-morning.svg",
    accent: "#5AEBDA",
  },
  {
    id: "daytime",
    titleSvg: "/images/style/hero-daytime.svg",
    accent: "#8E33EA",
  },
  {
    id: "evening",
    titleSvg: "/images/style/hero-evening.svg",
    accent: "#17F51E",
  },
  {
    id: "night",
    titleSvg: "/images/style/hero-night.svg",
    accent: "#0085FF",
  },
];

function getActiveBandIndex(hour: number) {
  if (hour >= 6 && hour < 11) return 0;
  if (hour >= 11 && hour < 17) return 1;
  if (hour >= 17 && hour < 22) return 2;
  return 3;
}

export function StyleHeroBand() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    function update() {
      setActive(getActiveBandIndex(new Date().getHours()));
    }
    update();
    const t = setInterval(update, 60 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="st-hero-band">
      <div className="st-hero-bg" aria-hidden="true">
        <HeroVideoOnce
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          className="st-hero-bg-img st-hero-bg-video"
        />
      </div>

      <Link href="/" className="st-hero-logo-link" aria-label="Lumière Hair Atelier">
        <StyleTextLogo />
      </Link>

      {heroBands.map((band, i) => (
        <div
          key={band.id}
          className={`st-hero-panel ${i === active ? "st-hero-panel-visible" : "st-hero-panel-hidden"}`}
          style={{ "--st-hero-accent": band.accent } as CSSProperties}
        >
          <div className="st-hero-panel-inner">
            <div className="st-hero-graphic">
              <Image
                src={band.titleSvg}
                alt=""
                width={1024}
                height={366}
                className="st-hero-title-img st-desktop-only"
                priority={i === active}
              />
              <Image
                src={band.titleSvg}
                alt=""
                width={1024}
                height={263}
                className="st-hero-title-img st-mobile-only"
                priority={i === active}
              />
            </div>
          </div>
        </div>
      ))}

    </section>
  );
}
