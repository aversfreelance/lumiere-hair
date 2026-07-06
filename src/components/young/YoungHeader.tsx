"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/stylists", label: "Stylists" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/booking", label: "Book Now" },
];

export function YoungHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="ss-header">
        <div className="ss-header-left">
          <Link href="/" className="ss-logo">
            <div className="ss-logo-sun">☀</div>
            <div>
              <div className="ss-logo-text">LUMIÈRE</div>
              <div className="ss-logo-sub">Hair Atelier</div>
            </div>
          </Link>
          <div className="ss-header-buttons">
            <Link href="/services" className="ss-header-btn">
              <span className="ss-header-btn-icon">✂</span>
              Our Services
            </Link>
            <Link href="/booking" className="ss-header-btn">
              <span className="ss-header-btn-icon">📅</span>
              Book Again
            </Link>
          </div>
        </div>

        <div className="ss-header-right">
          <a href="tel:+442071234567" className="ss-header-contact">
            <span className="ss-header-btn-icon">📞</span>
            <div>
              <div className="ss-contact-top">Call Us Today</div>
              <div className="ss-contact-bottom">+44 20 7123 4567</div>
            </div>
          </a>
          <Link href="/booking" className="ss-book-online">
            <span>✦</span>
            <span>
              Book your visit <strong>ONLINE</strong>
            </span>
          </Link>
          <div className="ss-theme-switch">
            <ThemeSwitcher />
          </div>
          <button
            type="button"
            className="ss-menu-btn"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`ss-mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      <nav className={`ss-mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="ss-mobile-menu-title">
          Menu
          <button
            type="button"
            className="ss-mobile-menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="ss-mobile-menu-link"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
