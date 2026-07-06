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
  { href: "/booking", label: "Book" },
];

export function StyleHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="st-player-fixed">
        <div className="st-volume-dock" aria-label="Call us">
          <a href="tel:+442071234567" className="st-vol-icon" aria-label="Phone">
            <svg width="46" height="46" viewBox="0 0 93 93" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 46.3C0.2 20.3 21-0.2 47 0C72.4 0.2 93 21.3 92.8 46.8C92.6 72.5 71.6 93 45.9 92.8C20.5 92.6-0.2 71.6 0 46.3Z" fill="white"/>
              <path d="M47.7 46.4V67.9C47.7 68.7 47.4 69.8 46.9 70.2C46 70.8 45.2 69.9 44.5 69.3C40.1 65.4 35.7 61.6 31.2 57.7C30.8 57.4 30.2 57.2 29.7 57.1C27.4 57.1 25.1 57.1 22.8 57.1C20.7 57.1 19.5 55.9 19.5 53.8C19.5 48.9 19.5 44 19.5 39.1C19.5 36.9 20.7 35.7 22.9 35.7C25.2 35.7 27.4 35.7 29.7 35.7C30.2 35.7 30.8 35.4 31.2 35.1C35.6 31.3 39.9 27.5 44.3 23.8C44.7 23.4 45.2 23 45.7 22.7C46.7 22.1 47.4 22.5 47.6 23.6C47.7 24.1 47.7 24.7 47.7 25.2V46.4Z" fill="white"/>
            </svg>
          </a>
        </div>

        <div className="st-top-utils">
          <div className="st-theme-switch">
            <ThemeSwitcher />
          </div>
          <button type="button" className="st-menu-btn" aria-label="Menu" onClick={() => setMenuOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`st-mobile-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} aria-hidden />
      <nav className={`st-mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="st-mobile-menu-head">
          <span>Menu</span>
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close">×</button>
        </div>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="st-mobile-link" onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
