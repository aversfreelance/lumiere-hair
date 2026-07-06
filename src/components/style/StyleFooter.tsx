import Link from "next/link";
import Image from "next/image";

export function StyleFooter() {
  return (
    <footer className="st-footer">
      <div className="st-container st-footer-inner">
        <Image src="/images/style/tagline.svg" alt="Tuned to your style" width={280} height={130} className="st-footer-tagline" />
        <a href="mailto:hello@lumiere-hair.com" className="st-footer-email">
          hello@lumiere-hair.com
        </a>
        <div className="st-footer-links">
          <Link href="/services">Services</Link>
          <span>|</span>
          <Link href="/stylists">Stylists</Link>
          <span>|</span>
          <Link href="/booking">Book Now</Link>
          <span>|</span>
          <Link href="/contact">Contact</Link>
        </div>
        <p className="st-footer-copy">
          © {new Date().getFullYear()} Lumière Hair Atelier · Mayfair, London
        </p>
      </div>
    </footer>
  );
}
