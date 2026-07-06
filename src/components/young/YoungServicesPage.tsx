import { withDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { FALLBACK_SERVICES } from "@/lib/services-data";
import { YoungPriceList } from "@/components/young/YoungPriceList";

export async function YoungServicesPage() {
  const allServices = await withDb(
    async (db) => db.select().from(services).where(eq(services.isActive, true)),
    FALLBACK_SERVICES,
  );

  const displayServices = allServices.length > 0 ? allServices : FALLBACK_SERVICES;

  return (
    <div className="ss-container ss-page-dark">
      <h1 className="ss-page-title">
        Our <span>Services</span>
      </h1>
      <p className="ss-news-lead" style={{ textAlign: "center", marginBottom: 32 }}>
        Each service is performed with meticulous attention to detail using only the finest
        professional products.
      </p>
      <YoungPriceList
        showHeader={false}
        showDescription
        services={displayServices}
        className="ss-price-section-page"
      />
    </div>
  );
}
