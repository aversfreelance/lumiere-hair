import Link from "next/link";

export function YoungContactSection() {
  return (
    <section className="ss-container ss-contact-section">
      <h2 className="ss-contact-title">
        Get in <strong>touch!</strong>
      </h2>
      <div className="ss-contact-blocks">
        <a href="tel:+442071234567" className="ss-contact-block">
          <div className="ss-contact-block-icon">📞</div>
          <div>
            <div className="ss-contact-block-top">Phone</div>
            <div className="ss-contact-block-bottom">+44 20 7123 4567</div>
          </div>
        </a>
        <a href="mailto:hello@lumiere-hair.com" className="ss-contact-block">
          <div className="ss-contact-block-icon">✉</div>
          <div>
            <div className="ss-contact-block-top">Email Us</div>
            <div className="ss-contact-block-bottom">hello@lumiere-hair.com</div>
          </div>
        </a>
        <Link href="/contact" className="ss-contact-block">
          <div className="ss-contact-block-icon">📍</div>
          <div>
            <div className="ss-contact-block-top">Visit Us</div>
            <div className="ss-contact-block-bottom">Mayfair, London</div>
          </div>
        </Link>
      </div>
    </section>
  );
}
