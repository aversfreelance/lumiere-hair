import Link from "next/link";
import { formatPrice } from "@/lib/booking-utils";
import { FALLBACK_SERVICES, sortServicesByPrice } from "@/lib/services-data";

const services = sortServicesByPrice(FALLBACK_SERVICES);

export function ElegantPriceList() {
  return (
    <section className="el-price-section border-y border-border bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Menu</p>
          <h2 className="font-serif mt-4 text-4xl md:text-5xl">Services & Pricing</h2>
        </div>

        <div className="el-price-list mt-16">
          {services.map((item, i) => (
            <Link key={item.id} href={`/services/${item.id}`} className="el-price-item group">
              <span className="el-price-rank">{String(i + 1).padStart(2, "0")}</span>
              <div className="el-price-info">
                <h3 className="font-serif text-xl transition-colors group-hover:text-gold-light">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted">{item.category}</p>
              </div>
              <div className="el-price-meta">
                <span className="text-sm text-muted">{item.durationMinutes} min</span>
                <span className="el-price-value">{formatPrice(item.priceCents)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
