import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/stylists", label: "Stylists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="site-header fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 flex-col">
          <span className="logo-main font-serif text-xl tracking-[var(--logo-tracking)] text-foreground transition-colors group-hover:text-gold sm:text-2xl">
            LUMIÈRE
          </span>
          <span className="logo-sub text-[10px] uppercase tracking-[0.35em] text-muted">
            Hair Atelier
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-sm uppercase tracking-widest text-muted transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher />
          <Link
            href="/booking"
            className="gradient-gold hidden px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-90 sm:inline-block sm:px-6 sm:text-xs"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
