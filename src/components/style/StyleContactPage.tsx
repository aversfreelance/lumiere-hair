import Link from "next/link";
import { StylePageHero } from "@/components/style/StylePageHero";

export function StyleContactPage() {
  return (
    <>
      <StylePageHero title="Contact" subtitle="get in touch" />
      <div className="st-container st-page">
        <div className="st-contact-grid">
          <div className="st-contact-card">
            <h3>Visit Us</h3>
            <p>Lumière Hair Atelier</p>
            <p>42 Brook Street</p>
            <p>Mayfair, London W1K 5DB</p>
            <p className="st-contact-phone">
              <a href="tel:+442071234567">+44 20 7123 4567</a>
            </p>
          </div>
          <div className="st-contact-card">
            <h3>Opening Hours</h3>
            <p>Monday – Friday: 9:00 – 20:00</p>
            <p>Saturday: 9:00 – 18:00</p>
            <p>Sunday: By appointment</p>
            <p className="st-contact-phone">
              <a href="mailto:hello@lumiere-hair.com">hello@lumiere-hair.com</a>
            </p>
          </div>
        </div>
        <div className="st-page-cta">
          <Link href="/booking" className="st-btn st-btn-teal">Book an appointment →</Link>
        </div>
      </div>
    </>
  );
}
