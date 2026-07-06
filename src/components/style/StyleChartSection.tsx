import Link from "next/link";
import { formatPrice } from "@/lib/booking-utils";
import { FALLBACK_SERVICES, sortServicesByPrice } from "@/lib/services-data";

const services = sortServicesByPrice(FALLBACK_SERVICES);

export function StyleChartSection() {
  return (
    <section className="st-charts-section">
      <div className="st-container">
        <div className="st-chart-list">
          {services.map((item, i) => (
            <Link key={item.id} href={`/services/${item.id}`} className="st-chart-item">
              <span className="st-chart-rank">{i + 1}</span>
              <div className="st-chart-info">
                <h4>{item.name}</h4>
                <p>{item.category}</p>
              </div>
              <span className="st-chart-price">{formatPrice(item.priceCents)}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
