import type { Metadata } from "next";
import Link from "next/link";
import { withDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formatPrice } from "@/lib/booking-utils";
import { ThemePageSwitch } from "@/components/theme/ThemePageSwitch";
import { YoungServicesPage } from "@/components/young/YoungServicesPage";
import { StyleServicesPage } from "@/components/style/StyleServicesPage";
import { FALLBACK_SERVICES, sortServicesByPrice } from "@/lib/services-data";

export default async function ServicesPage() {
  return (
    <ThemePageSwitch elegant={<ElegantServicesPage />} young={<YoungServicesPage />} style={<StyleServicesPage />} />
  );
}

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our premium hair services and treatments.",
};

async function ElegantServicesPage() {
  const allServices = await withDb(
    async (db) => db.select().from(services).where(eq(services.isActive, true)),
    FALLBACK_SERVICES
  );

  const displayServices = sortServicesByPrice(
    allServices.length > 0 ? allServices : FALLBACK_SERVICES,
  );

  return (
    <div>
      <section className="border-b border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Menu</p>
          <h1 className="font-serif mt-4 text-5xl md:text-6xl">Our Services</h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted">
            Each service is performed with meticulous attention to detail using
            only the finest professional products.
          </p>
        </div>
      </section>

      <section className="el-price-section py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="el-price-list">
            {displayServices.map((service, i) => (
              <Link key={service.id} href={`/services/${service.id}`} className="el-price-item group">
                <span className="el-price-rank">{String(i + 1).padStart(2, "0")}</span>
                <div className="el-price-info">
                  <h2 className="font-serif text-xl transition-colors group-hover:text-gold-light">
                    {service.name}
                  </h2>
                  <p className="mt-1 text-xs uppercase tracking-widest text-muted">{service.category}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
                </div>
                <div className="el-price-meta">
                  <span className="text-sm text-muted">{service.durationMinutes} min</span>
                  <span className="el-price-value">{formatPrice(service.priceCents)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
