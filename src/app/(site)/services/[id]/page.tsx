import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { withDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { formatPrice } from "@/lib/booking-utils";
import { FALLBACK_SERVICES, getFallbackServiceById, type Service } from "@/lib/services-data";
import { ThemePageSwitch } from "@/components/theme/ThemePageSwitch";
import { StyleServiceDetailPage } from "@/components/style/StyleServiceDetailPage";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getService(id: string): Promise<Service | null> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) return null;

  const row = await withDb(
    async (db) =>
      db
        .select({
          id: services.id,
          name: services.name,
          description: services.description,
          category: services.category,
          durationMinutes: services.durationMinutes,
          priceCents: services.priceCents,
        })
        .from(services)
        .where(eq(services.id, numericId))
        .limit(1)
        .then((rows) => rows[0] ?? null),
    getFallbackServiceById(numericId) ?? null
  );

  return row ?? getFallbackServiceById(numericId) ?? null;
}

export function generateStaticParams() {
  return FALLBACK_SERVICES.map((service) => ({ id: String(service.id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    return { title: "Service not found" };
  }

  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) notFound();

  return (
    <ThemePageSwitch
      elegant={<ElegantServiceDetail service={service} />}
      young={<YoungServiceDetail service={service} />}
      style={<StyleServiceDetailPage service={service} />}
    />
  );
}

function ElegantServiceDetail({ service }: { service: Service }) {
  return (
    <div>
      <section className="border-b border-border bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">{service.category}</p>
          <h1 className="font-serif mt-4 text-5xl md:text-6xl">{service.name}</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="text-lg leading-relaxed text-muted">{service.description}</p>
          <p className="mt-6 text-sm text-muted">
            {service.durationMinutes} min · {formatPrice(service.priceCents)}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/booking?service=${service.id}`}
              className="border border-gold/40 px-6 py-3 text-xs uppercase tracking-widest text-gold hover:bg-gold/10"
            >
              Book
            </Link>
            <Link href="/services" className="px-6 py-3 text-xs uppercase tracking-widest text-muted hover:text-foreground">
              All services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function YoungServiceDetail({ service }: { service: Service }) {
  return (
    <div className="ss-container ss-page-dark">
      <p className="ss-news-category">{service.category}</p>
      <h1 className="ss-page-title">
        {service.name.split(" ").slice(0, -1).join(" ")}{" "}
        <span>{service.name.split(" ").slice(-1)[0]}</span>
      </h1>
      <p className="ss-news-lead">{service.description}</p>
      <p className="ss-news-lead">
        {service.durationMinutes} min · {formatPrice(service.priceCents)}
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <Link href={`/booking?service=${service.id}`} className="ss-more-link">
          Book
        </Link>
        <Link href="/services" className="ss-more-link">
          All services
        </Link>
      </div>
    </div>
  );
}
