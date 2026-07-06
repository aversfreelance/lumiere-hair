import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="footer-logo font-serif text-2xl tracking-[var(--logo-tracking)]">LUMIÈRE</span>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              A premium hair atelier where artistry meets precision. Experience
              bespoke styling in an atmosphere of refined luxury.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li><Link href="/services" className="hover:text-gold">Services</Link></li>
              <li><Link href="/stylists" className="hover:text-gold">Our Stylists</Link></li>
              <li><Link href="/gallery" className="hover:text-gold">Gallery</Link></li>
              <li><Link href="/booking" className="hover:text-gold">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold">
              Visit Us
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>42 Brook Street</li>
              <li>Mayfair, London W1K 5DB</li>
              <li className="pt-2">+44 20 7123 4567</li>
              <li>hello@lumiere-hair.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Lumière Hair Atelier. All rights reserved.
          </p>
          <Link href="/admin" className="text-xs text-muted/50 hover:text-muted">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
