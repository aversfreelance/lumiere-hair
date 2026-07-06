import Link from "next/link";
import { StylePageHero } from "@/components/style/StylePageHero";
import { formatPrice } from "@/lib/booking-utils";
import type { Service } from "@/lib/services-data";

export function StyleServiceDetailPage({ service }: { service: Service }) {
  return (
    <>
      <StylePageHero title={service.name} subtitle={service.category} />
      <div className="st-container st-page st-service-detail">
        <p className="st-service-detail-desc">{service.description}</p>
        <p className="st-service-detail-meta">
          {service.durationMinutes} min · {formatPrice(service.priceCents)}
        </p>
        <div className="st-service-detail-actions">
          <Link href={`/booking?service=${service.id}`} className="st-btn st-btn-teal">
            Book this service →
          </Link>
          <Link href="/services" className="st-service-detail-back">
            ← All services
          </Link>
        </div>
      </div>
    </>
  );
}
