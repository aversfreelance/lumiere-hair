import Link from "next/link";
import { ThemePageSwitch } from "@/components/theme/ThemePageSwitch";
import { YoungHomePage } from "@/components/young/YoungHomePage";
import { StyleHomePage } from "@/components/style/StyleHomePage";
import { HeroBackground } from "@/components/ui/MediaPlaceholders";
import { ElegantScheduleSection } from "@/components/elegant/ElegantScheduleSection";
import { ElegantPriceList } from "@/components/elegant/ElegantPriceList";

export default async function HomePage() {
  return (
    <ThemePageSwitch elegant={<ElegantHomePage />} young={<YoungHomePage />} style={<StyleHomePage />} />
  );
}

async function ElegantHomePage() {
  return (
    <>
      <section className="hero-section relative flex min-h-[90vh] items-center overflow-hidden">
        <HeroBackground
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80"
          alt="Lumière salon interior"
          parallax
        />
        <div className="hero-overlay pointer-events-none absolute inset-0 z-[1]" />
        <div className="relative z-[2] mx-auto max-w-7xl px-6 py-32 lg:px-8">
          <p className="hero-tagline animate-fade-in-up text-xs uppercase tracking-[0.4em] text-gold">
            London&apos;s Premier Hair Atelier
          </p>
          <h1 className="animate-fade-in-up font-serif mt-6 max-w-3xl text-5xl leading-tight md:text-7xl [animation-delay:0.1s]">
            Where Artistry
            <span className="text-gradient-gold"> Meets </span>
            Elegance
          </h1>
          <p className="animate-fade-in-up mt-8 max-w-xl text-lg leading-relaxed text-muted [animation-delay:0.2s]">
            Discover bespoke hair experiences crafted by master stylists in an
            atmosphere of understated luxury.
          </p>
          <div className="animate-fade-in-up mt-10 flex flex-wrap gap-4 [animation-delay:0.3s]">
            <Link
              href="/booking"
              className="gradient-gold px-8 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
            >
              Reserve Your Visit
            </Link>
            <Link
              href="/services"
              className="theme-btn-outline border border-gold/40 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <ElegantScheduleSection />
      <ElegantPriceList />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <HeroBackground
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"
              alt="Salon experience"
              className="aspect-[4/5]"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-gold">The Experience</p>
              <h2 className="font-serif mt-4 text-4xl md:text-5xl">
                A Sanctuary of Style
              </h2>
              <p className="mt-6 leading-relaxed text-muted">
                Step into Lumière and leave the ordinary behind. Our atelier offers
                personalized consultations, premium products, and an unhurried
                approach to every appointment.
              </p>
              <ul className="mt-8 space-y-4 text-sm text-muted">
                <li className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  Complimentary consultation with every first visit
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  Organic, salon-exclusive product lines
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  Private styling suites available
                </li>
              </ul>
              <Link
                href="/stylists"
                className="mt-10 inline-block text-sm uppercase tracking-widest text-gold hover:text-gold-light"
              >
                Meet Our Stylists →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="shimmer-border h-px" />
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="font-serif text-4xl md:text-5xl">Ready to Transform?</h2>
          <p className="mt-6 text-muted">
            Book your appointment today and experience the Lumière difference.
          </p>
          <Link
            href="/booking"
            className="gradient-gold mt-10 inline-block px-10 py-4 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
