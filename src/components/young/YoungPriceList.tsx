import Link from "next/link";
import type { ReactNode } from "react";
import { formatPrice } from "@/lib/booking-utils";
import { FALLBACK_SERVICES, sortServicesByPrice, type Service } from "@/lib/services-data";

type YoungPriceListProps = {
  header?: ReactNode;
  showHeader?: boolean;
  showDescription?: boolean;
  services?: Service[];
  className?: string;
};

export function YoungPriceList({
  header,
  showHeader = true,
  showDescription = false,
  services: servicesProp,
  className = "",
}: YoungPriceListProps) {
  const services = sortServicesByPrice(servicesProp ?? FALLBACK_SERVICES);

  return (
    <section className={`ss-container ss-price-section ${className}`.trim()}>
      {showHeader && (
        <div className="ss-price-header">
          <h2 className="ss-fresh-title">
            <span className="ss-fresh-title-icon">✂</span>
            {header ?? (
              <>
                Full <strong>price list</strong>
              </>
            )}
          </h2>
        </div>
      )}

      <div className="ss-price-list">
        {services.map((item, i) => (
          <Link key={item.id} href={`/services/${item.id}`} className="ss-price-item">
            <span className="ss-price-rank">{String(i + 1).padStart(2, "0")}</span>
            <div className="ss-price-info">
              <h3 className="ss-price-name">{item.name}</h3>
              <p className="ss-news-category">{item.category}</p>
              {showDescription && (
                <p className="ss-news-lead ss-price-desc">{item.description}</p>
              )}
            </div>
            <div className="ss-price-meta">
              <span className="ss-price-duration">{item.durationMinutes} min</span>
              <span className="ss-service-price">{formatPrice(item.priceCents)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
