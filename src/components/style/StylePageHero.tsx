import Image from "next/image";
import Link from "next/link";
import { StyleTextLogo } from "@/components/style/StyleTextLogo";

export function StylePageHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="st-page-hero">
      <Image src="/images/style/wave-top.svg" alt="" width={1024} height={161} className="st-page-hero-wave" />
      <Link href="/" className="st-hero-logo-link st-page-logo-link" aria-label="Lumière Hair Atelier">
        <StyleTextLogo />
      </Link>
      <div className="st-container st-page-hero-inner">
        <h1 className="st-page-hero-title">{title}</h1>
        <p className="st-page-hero-sub">{subtitle}</p>
      </div>
    </section>
  );
}
