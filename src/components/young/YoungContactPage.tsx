import { YoungContactSection } from "@/components/young/YoungContactSection";
import { YoungNewsletterSection } from "@/components/young/YoungNewsletterSection";

export function YoungContactPage() {
  return (
    <>
      <div className="ss-page-box">
        <h1 className="ss-page-title">
          Contact <span>Us</span>
        </h1>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <p className="ss-news-lead" style={{ textAlign: "center", marginBottom: 30 }}>
            42 Brook Street, Mayfair, London W1K 5DB
          </p>
          <form className="ss-subs-form" style={{ flexDirection: "column" }}>
            <input className="ss-subs-input" placeholder="Your name" required style={{ width: "100%" }} />
            <input className="ss-subs-input" type="email" placeholder="Email address" required style={{ width: "100%" }} />
            <input className="ss-subs-input" placeholder="Subject" style={{ width: "100%" }} />
            <textarea
              className="ss-subs-input"
              placeholder="Your message..."
              required
              rows={5}
              style={{ width: "100%", height: "auto", paddingTop: 12 }}
            />
            <button type="submit" className="ss-subs-btn" style={{ width: "100%" }}>
              Send Message
            </button>
          </form>
        </div>
      </div>
      <YoungContactSection />
      <YoungNewsletterSection />
    </>
  );
}
