import Link from "next/link";
import { StylePageHero } from "@/components/style/StylePageHero";
import { formatPrice } from "@/lib/booking-utils";
import { FALLBACK_SERVICES, sortServicesByPrice } from "@/lib/services-data";

const services = sortServicesByPrice(FALLBACK_SERVICES);

export function StyleServicesPage() {
  return (
    <>
      <StylePageHero title="Services" subtitle="our full menu" />
      <div className="st-container st-page">
        {services.map((service) => (
          <div key={service.id} className="st-service-row">
            <div>
              <span className="st-news-cat">{service.category}</span>
              <h3 className="st-service-name">{service.name}</h3>
              <p className="st-service-desc">{service.description}</p>
              <span className="st-service-meta">{service.durationMinutes} min</span>
            </div>
            <div className="st-service-right">
              <div className="st-service-price">{formatPrice(service.priceCents)}</div>
              <Link href={`/booking?service=${service.id}`} className="st-btn">Book</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
