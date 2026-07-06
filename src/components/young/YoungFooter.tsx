import Link from "next/link";

export function YoungFooter() {
  return (
    <footer className="ss-footer">
      <div className="ss-container ss-footer-inner">
        <Link href="/" className="ss-footer-logo">
          <div className="ss-logo-sun">☀</div>
          <div>
            <div className="ss-logo-text">LUMIÈRE</div>
            <div className="ss-logo-sub">Hair Atelier</div>
          </div>
        </Link>

        <div className="ss-footer-info">
          <div className="ss-footer-title">Lumière Hair Atelier Ltd.</div>
          <p className="ss-footer-text">© {new Date().getFullYear()} All rights reserved.</p>
          <p className="ss-footer-text">
            <Link href="/contact">Contact Us</Link>
          </p>
          <p className="ss-footer-text">
            42 Brook Street, Mayfair, London W1K 5DB
          </p>
        </div>

        <div>
          <div className="ss-footer-menu-title">Menu</div>
          <Link href="/services" className="ss-footer-link">Services</Link>
          <Link href="/stylists" className="ss-footer-link">Stylists</Link>
          <Link href="/gallery" className="ss-footer-link">Gallery</Link>
          <Link href="/booking" className="ss-footer-link">Book Appointment</Link>
          <Link href="/contact" className="ss-footer-link">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
