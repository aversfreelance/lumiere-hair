"use client";

export function YoungNewsletterSection() {
  return (
    <section className="ss-newsletter" id="newsletter">
      <div className="ss-container">
        <div className="ss-newsletter-inner">
          <div className="ss-subs-title">
            Love your
            <br />
            new look?
          </div>
          <div className="ss-subs-text">
            Join our
            <br />
            newsletter!
          </div>
          <form
            className="ss-subs-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="email"
              className="ss-subs-input"
              placeholder="Enter your email address"
              required
            />
            <button type="submit" className="ss-subs-btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
